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

  //! ===============
  //! == UTILITIES ==
  //! ===============

  const findParentId = nodeId => {
    const edge = Object.values(edges).find(({ nodeB }) => nodeB === nodeId);
    return edge ? edge.nodeA : null;
  };

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
      if (activeNodeId) {
        const parentId = findParentId(activeNodeId);
        actions.addNode(parentId);
      }
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
      // Do not allow the base node to be deleted.
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
      if (!activeNodeId) return;
      //? Determine if there is an edge where this node is the target
      const parentId = findParentId(activeNodeId);
      // If active node is not a base node, navigate to its parent.
      if (parentId) actions.setActiveNode(parentId);
    }, // but when they can, append `node`. // Current only memoize if activeNode changes.  Parent Nodes cannot be deleted right now,
    [activeNodeId]
  );

  // If active node has a child node, navigate to it.  If it has multiple
  // navigate to left most.
  useHotkeys(
    "cmd+down",
    event => {
      if (!activeNode) return;
      const childIds = Object.values(edges)
        .filter(({ nodeA }) => {
          return nodeA === activeNodeId;
        })
        .map(({ nodeB }) => nodeB);
      if (!childIds.length) actions.addNode(activeNodeId);
      else actions.setActiveNode(childIds[0]);
    },
    [activeNodeId]
  );

  /**
   * If base node, do nothing.
   * TODO: Restore cousin traversal: If multiple nodes on layer, traverse horizontally.
   * @param {function} computeNextIndex : child index computer
   */
  const handleHorizontalNavigation = computeNextIndex => {
    if (!activeNode) return;
    const parentId = findParentId(activeNodeId);
    const siblingIds = Object.values(edges)
      .filter(({ nodeA }) => parentId === nodeA)
      .map(({ nodeB }) => nodeB);
    const index = siblingIds.indexOf(activeNode.id);
    const nextIndex = computeNextIndex(index, siblingIds);
    actions.setActiveNode(siblingIds[nextIndex]);
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
