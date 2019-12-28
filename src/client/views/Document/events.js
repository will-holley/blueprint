// store
import useStore from "client/data/store";
// hooks
import { useHotkeys } from "client/utils/hooks";

/**
 * Hooks all of the keyboard shortcuts in
 */
const useKeyboardHotkeys = () => {
  const [
    {
      documents,
      currentDoc: { activeNodeId, id: docId }
    },
    actions
  ] = useStore();

  const { nodes, edges } = documents[docId];
  const activeNode = activeNodeId && nodes[activeNodeId];

  //! ==============
  //! == DOCUMENT ==
  //! ==============

  /**
   *? DEV: Audit hotkeys
   */
  ////useHotkeys("*", event => console.info(event));

  /**
   * Cmd+Enter either creates a new child node if a node isn't currently
   * selected.
   */
  useHotkeys(
    "cmd+enter",
    () => {
      if (!activeNodeId) actions.addNode(null);
    }, // Callback is memoized until `activeNodeId` has changed.
    [activeNodeId]
  );

  useHotkeys(
    "cmd+shift+enter",
    event => {
      if (activeNodeId && activeNode.parentId)
        actions.addNode(activeNode.parentId);
      return false;
    },
    [activeNodeId]
  );

  /**
   * Deactivate all nodes
   */
  useHotkeys("Escape", () => actions.setActiveNode(null));

  //! =================
  //! == ACTIVE NODE ==
  //! =================

  /**
   * Disable default behaviors.
   */
  useHotkeys("Tab,Shift+Tab,shift+enter", event => {
    return false;
  });

  /**
   * If a node is active and user presses enter, create a new child
   * node of the active node.
   */
  useHotkeys(
    "enter,cmd+enter",
    () => {
      if (activeNodeId) actions.addNode(activeNodeId);
      return false;
    },
    [activeNodeId]
  );

  /**
   * Delete a node.  Deletes all nodes underneath it.
   */
  useHotkeys(
    "cmd+backspace",
    event => {
      if (activeNodeId) actions.deleteNode(activeNodeId);
      return false;
    },
    [activeNodeId]
  );

  //$ ================
  //$ == NAVIGATION ==
  //$ ================
  //$ Cmd + Arrow Key

  /**
   * Navigate up
   */
  useHotkeys(
    "cmd+up",
    event => {
      if (!activeNode) return;
      // If active node is not a base node, navigate to its parent.
      if (activeNode.parentId) actions.setActiveNode(activeNode.parentId);
    }, // but when they can, append `node`. // Current only memoize if activeNode changes.  Parent Nodes cannot be deleted right now,
    [activeNodeId]
  );

  // If active node has a child node, navigate to it.  If it has multiple
  // navigate to left most.
  useHotkeys(
    "cmd+down",
    event => {
      if (!activeNode) return;
      const edgeIds = Object.values(activeNode.edges).filter(id => {
        const { parent, child } = edges[id];
        return parent === activeNodeId;
      });
      if (!edgeIds.length) actions.addNode(activeNodeId);
      else actions.setActiveNode(edges[edgeIds[0]].child);
    },
    [activeNodeId]
  );

  /**
   * If base node, do nothing.
   * If multiple nodes on layer, traverse horizontally.
   * @param {function} computeNextIndex : child index computer
   */
  const handleHorizontalNavigation = computeNextIndex => {
    if (!activeNode || !activeNode.parentId) return;
    const levelIds = Object.keys(nodes[activeNode.parentId].edges);
    const index = levelIds.indexOf(activeNode.id);
    const nextIndex = computeNextIndex(index, levelIds);
    //console.log(computeNextIndex, levelIds, levelIds[nextIndex]);
    actions.setActiveNode(levelIds[nextIndex]);
  };

  /**
   * Navigate to the active node's left sibling,
   * if one exists.  If the leftmost node is currently
   * active, set the rightmost node as active.
   */
  const computeLeft = (index, levelIds) =>
    index - 1 >= 0 ? index - 1 : levelIds.length - 1;
  useHotkeys("cmd+left", event => handleHorizontalNavigation(computeLeft), [
    activeNodeId,
    nodes
  ]);
  /**
   * Navigate to the active node's right sibling,
   * if one exists. If the rightmost node is currently
   * active, set the leftmost node as active.
   */
  const computeRight = (index, levelIds) =>
    index + 1 <= levelIds.length - 1 ? index + 1 : 0;
  useHotkeys("cmd+right", event => handleHorizontalNavigation(computeRight), [
    activeNodeId,
    nodes
  ]);
};

export { useKeyboardHotkeys };
