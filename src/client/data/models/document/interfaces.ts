import { NodesType, EdgesType } from "client/data/models/graph/interfaces";

interface DocumentType {
  _id: string;
  id: string;
  nodes: NodesType;
  edges: EdgesType;
}

export { DocumentType };
