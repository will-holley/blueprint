import { makeWrapResolversPlugin } from "graphile-utils";
import { hri } from "human-readable-ids";

export default makeWrapResolversPlugin({
  Mutation: {
    createDocument: async (resolve, source, args, context, resolveInfo) => {
      if (!args.input.document) {
        args.input.document = {};
      }
      args.input.document.humanId = hri.random();
      const response = await resolve();
      return response;
    },
    createNode: async (resolve, source, args, context, resolveInfo) => {
      // Add human ids
      args.input._node.humanId = hri.random();
      if (args.input._node.edgesToNodeBUsingId) {
        args.input._node.edgesToNodeBUsingId.create[0].humanId = hri.random();
      }
      return resolve(source, args, context, resolveInfo);
    }
  }
});
