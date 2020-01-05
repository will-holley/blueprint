import { dropTables } from "../src/server/data/db/setup";

async function globalTeardown() {
  await dropTables();
  process.exit(0);
}

export default globalTeardown;
