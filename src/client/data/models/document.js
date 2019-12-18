import uuidv4 from "uuid/v4";

const createDoc = () => ({
  id: uuidv4(),
  nodes: {},
  edges: []
});

const actions = {};

export { createDoc, actions };
