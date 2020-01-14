import db from "./index";
import { models, modelsByName } from "./../models";

//* Constants
const gqlUser = process.env.GRAPHQL_USER;

const USER_REF = modelsByName.user.ref;
const DOCUMENT_REF = modelsByName.document.ref;
const NODE_REF = modelsByName.node.ref;
const EDGE_REF = modelsByName.edge.ref;

const types = [
  // Json Web Token type
  `
  DO $$ BEGIN
    CREATE TYPE public.jwt_token as (
      role text,
      exp integer,
      user_id uuid,
      email text
    );
  EXCEPTION
      WHEN duplicate_object THEN null;
  END $$;
  `
];
const extensions = ["CREATE EXTENSION IF NOT EXISTS pgcrypto;"];
const functions = [
  // Automatic Timestamp Updating
  `
  CREATE OR REPLACE FUNCTION public.on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE 'plpgsql';
`,
  `
  DROP FUNCTION IF EXISTS public.generate_jwt_token;
  CREATE FUNCTION public.generate_jwt_token(
    id uuid,
    email text
  ) RETURNS public.jwt_token AS $$
  BEGIN
    RETURN (
      'app_user',
      EXTRACT(EPOCH FROM now() + INTERVAL '1 day'),
      id,
      email
    )::public.jwt_token;
  END;
  $$ LANGUAGE 'plpgsql';
`,
  // User Account Creation
  `
  DROP FUNCTION IF EXISTS public.register_user;
  CREATE FUNCTION public.register_user(
    email text,
    password text
  ) RETURNS public.jwt_token AS $$
  DECLARE
    account ${USER_REF};
    salt text;
    hashed_password text;
  BEGIN
    -- Generate Salt
    salt := (SELECT gen_salt('bf'));
    -- Hash Password
    hashed_password := (SELECT crypt(password, salt));
    -- Insert record
    INSERT INTO ${USER_REF} (email, password, salt)
    VALUES (email, hashed_password, salt)
    RETURNING * INTO account;
    -- Return JWT token
    RETURN public.generate_jwt_token(account.id, account.email);
    END;
    $$ LANGUAGE plpgsql STRICT SECURITY DEFINER;
  `,
  // User Account Authentication
  `
  DROP FUNCTION IF EXISTS public.login_user;
  CREATE OR REPLACE FUNCTION public.login_user(
    email text,
    password text
  ) RETURNS public.jwt_token AS $$
  DECLARE
    account ${USER_REF};
  BEGIN
    -- Find user account
    SELECT a.* INTO account
      FROM ${USER_REF} AS a
      WHERE a.email = login_user.email;
    -- Check that passwords match
    IF account.password = crypt(password, account.salt) THEN
      RETURN public.generate_jwt_token(account.id, account.email);
    ELSE
      RETURN null;
    END IF;
  END;
  $$ LANGUAGE plpgsql STRICT SECURITY DEFINER;
  `,
  // Current User Identification
  `
    DROP FUNCTION IF EXISTS public.current_user_id;
    CREATE FUNCTION public.current_user_id() RETURNS uuid AS $$
      SELECT NULLIF(current_setting('jwt.claims.user_id', true), '')::uuid;
    $$ LANGUAGE sql STABLE;
  `,
  // Set document created by
  `
  DROP FUNCTION IF EXISTS document.on_insert_document CASCADE;
  CREATE FUNCTION document.on_insert_document() RETURNS trigger AS $$
  BEGIN
    -- Validate that a user id is present
    IF current_user_id() IS NULL THEN
      RAISE EXCEPTION 'current_user_id is null!';
    END IF;
    -- Update
    NEW.created_by := current_user_id();
    RETURN NEW;
  END;
  $$ LANGUAGE 'plpgsql';
  `
];

const triggers = [
  // When a document is created, set the created_by value.
  `CREATE TRIGGER set_created_by BEFORE INSERT ON ${DOCUMENT_REF}
  FOR EACH ROW EXECUTE FUNCTION document.on_insert_document();`
];

const roles = [
  // Create GraphQL access-control user
  `
  DO $$
  DECLARE
    count int;
  BEGIN
    SELECT 1 INTO count FROM pg_roles WHERE rolname = '${gqlUser}';
  IF count > 0 THEN
    DROP OWNED BY ${gqlUser};
    REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM ${gqlUser};
    REVOKE ALL ON SCHEMA document FROM ${gqlUser};
    DROP ROLE ${gqlUser};
  END IF;
  END$$;
  CREATE ROLE ${gqlUser};
  ALTER ROLE ${gqlUser} WITH LOGIN;
  `,
  // Session user
  `
  DO $$
  DECLARE
    count int;
  BEGIN
    SELECT 1 INTO count FROM pg_roles WHERE rolname = 'app_user';
  IF count > 0 THEN
    DROP OWNED BY app_user;
    REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM app_user;
    REVOKE ALL ON SCHEMA document FROM app_user;
    DROP ROLE app_user;
  END IF;
  END$$;
  CREATE ROLE app_user;`
];

/**
 ** Public Permissions
 * - execute public.register_user
 * - execute public.login_user
 * - select public documents
 * - select nodes/edges within public documents
 ** User permissions (user inherits all public)
 * TODO: explicit inheritance rather than dual grants/assignments?
 * - app_user can select any public document/node/edge
 * - document/node/edge tables
 * -- app_user can insert on document table
 * -- app_user can read select/update documents they've authored
 * -- app_user can select/insert/update nodes on documents they've authored
 * -- app_user can select/insert/update edges on documents they've authored
 * - app_user can query their own user record
 * - set current user id when bearer token is present
 */
const permissions = [
  /**
   *? Enable row level security
   */
  `ALTER TABLE ${USER_REF} ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE ${DOCUMENT_REF} ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE ${NODE_REF} ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE ${EDGE_REF} ENABLE ROW LEVEL SECURITY;`,
  /**
   *? Public Permissions
   */
  `GRANT EXECUTE ON FUNCTION public.register_user TO ${gqlUser};`,
  `GRANT EXECUTE ON FUNCTION public.login_user TO ${gqlUser};`,
  // Don't expose a mutation for `public.generate_jwt_token`
  `COMMENT ON FUNCTION public.generate_jwt_token IS '@omit';`,
  // Select must be granted prior to policy creation
  `GRANT USAGE ON SCHEMA document TO ${gqlUser}, app_user;`,
  `GRANT SELECT ON TABLE ${DOCUMENT_REF} TO ${gqlUser}, app_user;`,
  `GRANT SELECT ON TABLE ${NODE_REF} TO ${gqlUser}, app_user;`,
  `GRANT SELECT ON TABLE ${EDGE_REF} TO ${gqlUser}, app_user;`,
  // Create policies
  `CREATE POLICY public_visibility ON ${DOCUMENT_REF}
  AS PERMISSIVE FOR SELECT TO ${gqlUser}, app_user
  USING (private = False);
  `,
  `CREATE POLICY public_visibility ON ${NODE_REF}
  AS PERMISSIVE FOR SELECT TO ${gqlUser}, app_user
  USING (
    EXISTS (
      SELECT private
      FROM ${DOCUMENT_REF}
      WHERE id = document and ${DOCUMENT_REF}.private = False
    )
  );`,
  `CREATE POLICY public_visibility ON ${EDGE_REF}
  AS PERMISSIVE FOR SELECT TO ${gqlUser}, app_user
  USING (
    EXISTS (
      SELECT ${DOCUMENT_REF}.id
      FROM ${NODE_REF}
      JOIN ${DOCUMENT_REF} ON ${DOCUMENT_REF}.id = ${NODE_REF}.document
      WHERE 
        ${DOCUMENT_REF}.private = False AND (
          ${NODE_REF}.id = node_a OR
          ${NODE_REF}.id = node_b
        )
    )
  );`,
  // Important: Needs permission to set `app_user` in transactions
  // See "How it works" -- https://www.graphile.org/postgraphile/security/
  `GRANT app_user TO ${gqlUser};`,
  /**
   *? User Permissions
   */
  // User can select their own record
  // TODO: users can select email + name of other users.
  // TODO: see the postgresconf presentation...
  `GRANT SELECT ON TABLE ${USER_REF} TO app_user;`,
  `CREATE POLICY user_can_select_self ON ${USER_REF}
  FOR SELECT TO app_user
  USING ("id" = current_user_id());
  `,
  // user can select
  // document
  `CREATE POLICY creator_select ON ${DOCUMENT_REF}
  AS PERMISSIVE FOR SELECT TO app_user
  USING ("created_by" = current_user_id());`,
  // select node
  `CREATE POLICY private_visibility ON ${NODE_REF}
  AS PERMISSIVE FOR SELECT TO app_user
  USING (
    EXISTS (
      SELECT private
      FROM ${DOCUMENT_REF}
      WHERE id = document AND document.created_by = current_user_id()
    )
  );
  `,
  // select edge
  `CREATE POLICY private_visibility ON ${EDGE_REF}
  AS PERMISSIVE FOR SELECT TO app_user
  USING (
    EXISTS (
      SELECT ${DOCUMENT_REF}.id
      FROM ${NODE_REF}
      JOIN ${DOCUMENT_REF} ON ${DOCUMENT_REF}.id = ${NODE_REF}.document
      WHERE
        ${DOCUMENT_REF}.created_by = current_user_id() AND (
          ${NODE_REF}.id = node_a OR
          ${NODE_REF}.id = node_b
        )
    )
  );`,
  //* User can insert / update documents
  `GRANT TRIGGER, UPDATE, INSERT ON TABLE ${DOCUMENT_REF} TO app_user;`,
  `GRANT EXECUTE ON FUNCTION document.on_insert_document TO app_user;`,
  // row level policies
  // document insert
  `CREATE POLICY app_user_insert ON ${DOCUMENT_REF}
  AS PERMISSIVE FOR INSERT TO app_user
  WITH CHECK (TRUE);`,
  // document update
  `CREATE POLICY creator_update ON ${DOCUMENT_REF}
  AS PERMISSIVE FOR UPDATE TO app_user
  USING ("created_by" = current_user_id());`,
  //* User can insert / update nodes
  `GRANT UPDATE, INSERT ON TABLE ${NODE_REF} TO app_user;`,
  // node insert
  `CREATE POLICY app_user_insert ON ${NODE_REF}
  AS PERMISSIVE FOR INSERT TO app_user
  WITH CHECK (
    EXISTS (
      SELECT private
      FROM ${DOCUMENT_REF}
      WHERE id = document AND document.created_by = current_user_id()
    )
  );`,
  // node update
  `CREATE POLICY creator_update ON ${NODE_REF}
  AS PERMISSIVE FOR UPDATE TO app_user
  USING (
    EXISTS (
      SELECT private
      FROM ${DOCUMENT_REF}
      WHERE id = document AND document.created_by = current_user_id() 
    )
  );`,
  //* User can insert / update edges
  `GRANT UPDATE, INSERT ON TABLE ${EDGE_REF} TO app_user;`,
  // edge insert
  `CREATE POLICY app_user_insert ON ${EDGE_REF}
  AS PERMISSIVE FOR INSERT TO app_user
  WITH CHECK (
    -- node_a's document is owned by user
    EXISTS (
      SELECT ${DOCUMENT_REF}.id
      FROM ${NODE_REF}
      JOIN ${DOCUMENT_REF} ON ${DOCUMENT_REF}.id = ${NODE_REF}.document
      WHERE ${DOCUMENT_REF}.created_by = current_user_id() AND ${NODE_REF}.id = node_a
    ) AND
    -- node_b's document is owned by user
    EXISTS (
      SELECT ${DOCUMENT_REF}.id
      FROM ${NODE_REF}
      JOIN ${DOCUMENT_REF} ON ${DOCUMENT_REF}.id = ${NODE_REF}.document
      WHERE ${DOCUMENT_REF}.created_by = current_user_id() AND ${NODE_REF}.id = node_b
    )
  );`,
  // edge update
  `CREATE POLICY creator_update ON ${EDGE_REF}
  AS PERMISSIVE FOR UPDATE TO app_user
  USING (
    -- node_a's document is owned by user
    EXISTS (
      SELECT ${DOCUMENT_REF}.id
      FROM ${NODE_REF}
      JOIN ${DOCUMENT_REF} ON ${DOCUMENT_REF}.id = ${NODE_REF}.document
      WHERE ${DOCUMENT_REF}.created_by = current_user_id() AND ${NODE_REF}.id = node_a
    ) AND
    -- node_b's document is owned by user
    EXISTS (
      SELECT ${DOCUMENT_REF}.id
      FROM ${NODE_REF}
      JOIN ${DOCUMENT_REF} ON ${DOCUMENT_REF}.id = ${NODE_REF}.document
      WHERE document.document.created_by = current_user_id() AND ${NODE_REF}.id = node_b
    )
  );`
];

const schemas = ["document"];

async function dropTables() {
  //? This cannot run in production.
  if (process.env.NODE_ENV === "production") return;
  //? Drop
  const commands = Object.values(models).map(
    api => `DROP TABLE IF EXISTS ${api.schema}.${api.table} CASCADE;`
  );
  await db.raw(commands.join(""));
}

async function createTables() {
  // Create tables if they don't exist
  models.forEach(async api => {
    await api.createTable();
  });
}

async function _execQuery(query) {
  try {
    await db.raw(query);
  } catch (error) {
    throw new Error(error);
  }
}

const createTypes = async () => _execQuery(types.join(""));
const createExtensions = async () => _execQuery(extensions.join());
const createFunctions = async () => _execQuery(functions.join(""));
const createTriggers = async () => _execQuery(triggers.join(""));
const createRoles = async () => _execQuery(roles.join(""));
const createPermissions = async () => _execQuery(permissions.join(""));
const createSchemas = async () =>
  _execQuery(
    schemas.map(s => `CREATE SCHEMA IF NOT EXISTS ${s}`).join("\n") + ";"
  );

/**
 * Create types, functions, extensions, and roles.
 * TODO: wrap this entire block in a single transaction within a single sql transaction
 * TODO: consider strengthening the authentication using stored sessions:
 * https://postgresconf.org/system/events/document/000/000/996/pgconf_us_2019.pdf -- pg27+
 * TODO: don't consider the above... DO IT B/C THE AUTHORS ADMIT THE DOCS SUCK
 * https://github.com/graphile/postgraphile/issues/1049
 * TODO: this should fix issues where methods are visible to the unauthenticated graphql
 * TODO: api because of the app/app_user grant.
 */
async function setupDatabase(forceCreateTables = false) {
  // Pre-table creation
  await createTypes();
  await createExtensions();
  await createSchemas();
  // Create tables
  if (forceCreateTables) {
    await dropTables();
  }
  await createTables();
  // Post-table creation
  await createRoles();
  await createFunctions();
  await createTriggers();
  await createPermissions();
}

export default setupDatabase;
export { createTables, dropTables };
