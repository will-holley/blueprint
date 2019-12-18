import { createHook } from "react-sweet-state";
import { store } from "./store";

// TODO: Consider memoizing
// TODO: see https://atlassian.github.io/react-sweet-state/#/advanced/selector
const getActiveNode = state =>
  state.documents[state.currentDoc.id].nodes[state.currentDoc.activeNodeId];

const useGetActiveNode = createHook(store, { selector: getActiveNode });

export { useGetActiveNode };
