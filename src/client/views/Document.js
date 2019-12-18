import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
// Hooks
import { useHotkeys } from "../utils/hooks";
// Data
import useStore from "../data/store";
import { useGetActiveNode } from "../data/selectors";
// Components
import { Container, Actions } from "./../components/style/Document.style";
import Node from "./../components/Node";
import { AutoSizer } from "react-virtualized";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";

const Document = () => {
  //! ============
  //! == CONFIG ==
  //! ============

  const [
    {
      currentDoc: {
        id,
        dimensions: { height: docHeight, width: docWidth },
        activeNodeId
      },
      documents
    },
    actions
  ] = useStore();
  const { nodes, edges } = documents[id];

  //! ====================
  //! == EVENT HANDLERS ==
  //! ====================

  /**
   * Adds new node to document.
   * @param {Object} event
   */
  const addBaseNode = event => actions.addNode(null);

  //! =============
  //! == HOTKEYS ==
  //! =============

  /**
   * Cmd+Enter either creates a new child node if a node isn't currently
   * selected.
   */
  useHotkeys(
    "cmd+enter",
    () => {
      if (!activeNodeId) addBaseNode();
    },
    // Callback is memoized until `activeNodeId` has changed.
    [activeNodeId]
  );

  /**
   * If a node is active and user presses enter, create a new child
   * node of the active node.
   */
  useHotkeys(
    "enter",
    () => {
      if (activeNodeId) actions.addNode(activeNodeId);
      return false;
    },
    [activeNodeId]
  );

  /**
   * Deactivate all nodes
   */
  useHotkeys("Escape", () => actions.setActiveNodeId(null));

  /**
   * Do not allow tabbing
   */
  useHotkeys("Tab,Shift+Tab", event => {
    return false;
  });

  const [activeNode] = useGetActiveNode();
  // arrow key navigation
  useHotkeys(
    "up",
    event => {
      if (!activeNode) return;
      // If active node is not a base node, navigate to its parent.
      if (activeNode.parentId) actions.setActiveNodeId(activeNode.parentId);
    },
    // Current only memoize if activeNode changes.  Parent Nodes cannot be deleted right now,
    // but when they can, append `node`.
    [activeNode]
  );
  useHotkeys(
    "down",
    event => {
      if (!activeNode || !activeNode.children.length) return;
      // If active node has a child node, navigate to it.  If it has multiple
      // navigate to left most.
      actions.setActiveNodeId(activeNode.children[0]);
    },
    [activeNode, nodes]
  );
  // TODO: - rethink the key interface to keep it consistent b/c
  // TODO:   up+down are naked and left+right and cmd+
  // TODO: - re-use sibling logic
  // TODO: - move these into a separate file
  /**
   * Navigate to the active node's left sibling,
   * if one exists.  If the leftmost node is currently
   * active, set the rightmost node as active.
   */
  useHotkeys(
    "cmd+left",
    event => {
      if (!activeNode || nodes[activeNode.parentId].children.length === 1)
        return;
      // Find id of left most child
      const levelIds = nodes[activeNode.parentId].children;
      const index = levelIds.indexOf(activeNode.id);
      const nextIndex = index - 1 >= 0 ? index - 1 : levelIds.length - 1;
      actions.setActiveNodeId(levelIds[nextIndex]);
    },
    [activeNode, nodes]
  );
  /**
   * Navigate to the active node's right sibling,
   * if one exists. If the rightmost node is currently
   * active, set the leftmost node as active.
   */
  useHotkeys(
    "cmd+right",
    event => {
      if (!activeNode || nodes[activeNode.parentId].children.length === 1)
        return;
      const levelIds = nodes[activeNode.parentId].children;
      const index = levelIds.indexOf(activeNode.id);
      const nextIndex = index + 1 <= levelIds.length - 1 ? index + 1 : 0;
      actions.setActiveNodeId(levelIds[nextIndex]);
    },
    [activeNode, nodes]
  );

  //? DEV: Audit hotkeys
  //useHotkeys("*", event => console.info(event));

  //! ============
  //! == RENDER ==
  //! ============
  return (
    <Container>
      <Actions>
        <p>Document: {id}</p>
        <button onClick={addBaseNode}>New Base</button>
      </Actions>
      <AutoSizer>
        {({ width, height }) =>
          width === 0 || height === 0 ? null : (
            <UncontrolledReactSVGPanZoom
              tool="auto"
              toolbarProps={{ position: "none" }}
              miniatureProps={{ position: "none" }}
              width={width}
              height={height}
              detectAutoPan={false}
              background="transparent"
              scaleFactor={1}
              // Shrink
              scaleFactorMin={0.4}
              // Enlarge -- by setting value equal to
              // `scaleFactor`, enlarging is disabled.
              scaleFactorMax={1}
            >
              <svg viewBox="0 0 0 0" style={{ height: "auto" }}>
                {Object.keys(nodes).map(nodeId => {
                  const { parentId, dimensions, position, content } = nodes[
                    nodeId
                  ];
                  return (
                    <Node
                      key={nodeId}
                      id={nodeId}
                      parentId={parentId}
                      position={position}
                      dimensions={dimensions}
                      content={content}
                    />
                  );
                })}
              </svg>
            </UncontrolledReactSVGPanZoom>
          )
        }
      </AutoSizer>
    </Container>
  );
};

Document.propTypes = {};
Document.defaultProps = {};

export default Document;
