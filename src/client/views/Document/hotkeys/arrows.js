import { useHotkeys } from "client/utils/hooks";
import { useCurrentDocument } from "client/data/selectors/document";
import { findParentNodeId } from "./utils";

// TODO: activeNodeId isn't updating!
const useArrowNavigation = () => {
  const [{ activeNodeId, edges, nodes }, actions] = useCurrentDocument();

  function up(event) {
    if (!activeNodeId) return;
    //? Determine if there is an edge where this node is the target
    const parentId = findParentNodeId(activeNodeId, edges);
    // If active node is not a base node, navigate to its parent.
    if (parentId) actions.setActiveNode(parentId);
  }
  /**
   * If active node has a child node, navigate to it.
   * If it has multiple navigate to left most.
   */
  function down(event) {
    if (!activeNodeId) return;
    const childIds = Object.values(edges)
      .filter(({ nodeA }) => {
        return nodeA === activeNodeId;
      })
      .map(({ nodeB }) => nodeB);
    if (!childIds.length) actions.addNode(activeNodeId);
    else actions.setActiveNode(childIds[0]);
  }
  /**
   * If base node, do nothing.
   * TODO: Restore cousin traversal: If multiple nodes on layer, traverse horizontally.
   * @param {function} computeNextIndex : child index computer
   */
  const handleHorizontalNavigation = computeNextIndex => {
    if (!activeNodeId) return;
    const parentId = findParentNodeId(activeNodeId, edges);
    const siblingIds = Object.values(edges)
      .filter(({ nodeA }) => parentId === nodeA)
      .map(({ nodeB }) => nodeB);
    const index = siblingIds.indexOf(activeNodeId);
    const nextIndex = computeNextIndex(index, siblingIds);
    actions.setActiveNode(siblingIds[nextIndex]);
  };
  /**
   * Navigate to the active node's left sibling,
   * if one exists.  If the leftmost node is currently
   * active, set the rightmost node as active.
   */
  function computeLeft(index, levelIds) {
    return index - 1 >= 0 ? index - 1 : levelIds.length - 1;
  }
  function left(event) {
    handleHorizontalNavigation(computeLeft);
  }
  /**
   * Navigate to the active node's right sibling,
   * if one exists. If the rightmost node is currently
   * active, set the leftmost node as active.
   */
  function computeRight(index, levelIds) {
    return index + 1 <= levelIds.length - 1 ? index + 1 : 0;
  }
  function right(event) {
    handleHorizontalNavigation(computeRight);
  }
  useHotkeys("cmd+up", up, [activeNodeId]);
  useHotkeys("cmd+down", down, [activeNodeId]);
  useHotkeys("cmd+left", left, [activeNodeId, nodes]);
  useHotkeys("cmd+right", right, [activeNodeId, nodes]);
};

export default useArrowNavigation;
