//* Setup functions
import {
  createExtensionsAndFunctions,
  createTables
} from "../src/server/data/db/setup";

export default async function() {
  //? Create the test database.
  await createExtensionsAndFunctions();
  await createTables(true);
  //? Halt for a second
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
}
