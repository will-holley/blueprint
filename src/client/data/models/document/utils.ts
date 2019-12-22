import uuidv4 from "uuid/v4";
import { hri } from "human-readable-ids";
import { DocumentType } from "./interfaces";

const createDoc = (): DocumentType => ({
  _id: uuidv4(),
  id: hri.random(),
  nodes: {},
  edges: {}
});

export { createDoc };
