//* Libs
import { postgraphile } from "postgraphile";
//* Config
import { postgraphileConnection } from "./../data/db";
import options from "./options";

/**
 * Created async
 */
function createPGQLClient() {
  return postgraphile(postgraphileConnection, ["public", "document"], options);
}

export default createPGQLClient;
