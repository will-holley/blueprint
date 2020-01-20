import { Environment, Network, RecordSource, Store } from "relay-runtime";
import api from "./api";

const source = new RecordSource();

export default new Environment({
  // Cannot pass `api.request` in directly
  network: Network.create((operation, variables) =>
    api.request(operation, variables)
  ),
  store: new Store(source)
});
