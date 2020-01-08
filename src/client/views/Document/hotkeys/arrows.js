//* libraries
import { useSelector, useDispatch } from "react-redux";
//* selectors
import { activeDocumentSelector } from "client/data/selectors/document";
//* actions
import { setActiveNode, addNode } from "client/data/services/document/actions";
//* everything else
import { useHotkeys } from "client/utils/hooks";
import { findParentNodeId } from "./utils";

const useArrowNavigation = () => {
  const { activeNodeId, edges, nodes } = useSelector(activeDocumentSelector);
  const dispatch = useDispatch();

  function up(event) {
    if (!activeNodeId) return false;
    //? Determine if there is an edge where this node is the target
    const parentId = findParentNodeId(activeNodeId, edges);
    // If active node is not a base node, navigate to its parent.
    if (parentId) dispatch(setActiveNode(parentId));
    // Prevent default behavior (shifting cursor the beginning of text)
    return false;
  }
  /**
   * If active node has a child node, navigate to it.
   * If it has multiple navigate to left most.
   */
  function down(event) {
    if (!activeNodeId) return false;
    const childIds = Object.values(edges)
      .filter(({ nodeA }) => {
        return nodeA === activeNodeId;
      })
      .map(({ nodeB }) => nodeB);
    if (!childIds.length) dispatch(addNode(activeNodeId));
    else dispatch(setActiveNode(childIds[0]));
    // Prevent default behavior
    return false;
  }
  /**
   * If base node, do nothing.
   * TODO: Restore cousin traversal: If multiple nodes on layer, traverse horizontally.
   * @param {function} computeNextIndex : child index computer
   */
  const handleHorizontalNavigation = computeNextIndex => {
    if (!activeNodeId) return false;
    // Find sibling nodes
    const parentId = findParentNodeId(activeNodeId, edges);
    const siblingIds = Object.values(edges)
      .filter(({ nodeA }) => parentId === nodeA)
      .map(({ nodeB }) => nodeB);
    // If there are no siblings, exit.
    if (!siblingIds.length) return false;
    // Otherwise, find the sibling id
    const index = siblingIds.indexOf(activeNodeId);
    const nextIndex = computeNextIndex(index, siblingIds);
    const id = siblingIds[nextIndex];
    dispatch(setActiveNode(id));
    // Prevent default behavior
    return false;
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
    return handleHorizontalNavigation(computeLeft);
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
    return handleHorizontalNavigation(computeRight);
  }
  useHotkeys("cmd+up", up, [activeNodeId]);
  useHotkeys("cmd+down", down, [activeNodeId]);
  useHotkeys("cmd+left", left, [activeNodeId, nodes]);
  useHotkeys("cmd+right", right, [activeNodeId, nodes]);
};

export default useArrowNavigation;
