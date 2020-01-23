import { makeChangeNullabilityPlugin } from "graphile-utils";

export default makeChangeNullabilityPlugin({
  _NodeInput: {
    humanId: true
  },
  DocumentInput: {
    humanId: true
  },
  CreateDocumentInput: {
    document: true
  },
  EdgeNodeBForeignEdgeCreateInput: {
    humanId: true
  }
});
