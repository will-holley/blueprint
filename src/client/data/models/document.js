import uuidv4 from "uuid/v4";
import { hri } from "human-readable-ids";

const createDoc = () => ({
  _id: uuidv4(),
  id: hri.random(),
  nodes: {},
  edges: []
});

const actions = {};

export { createDoc, actions };
