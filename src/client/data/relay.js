import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { gqlAPI } from "./../utils/api";

// https://relay.dev/docs/en/network-layer
function fetchQuery(operation, variables) {
  return gqlAPI.request(
    "",
    "POST",
    {},
    {
      query: operation.text, // GraphQL text from input
      variables
    }
  );
}

const source = new RecordSource();
const store = new Store(source);
const network = Network.create(fetchQuery);
const handlerProvider = null;

const environment = new Environment({
  handlerProvider, // Can omit.
  network,
  store
});

export default environment;
