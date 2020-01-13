import Document from "./document";
import Node from "./node";
import Edge from "./edge";
import User from "./user";

const modelsByName = {
  user: User,
  document: Document,
  node: Node,
  edge: Edge
};

// Ordered
const models = [User, Document, Node, Edge];

export { models, modelsByName };
