import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
// Hooks
import { useHotkeys } from "react-hotkeys-hook";
// Data
import useStore from "../data/store";
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
        dimensions: { height: docHeight, width: docWidth }
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

  // TODO: Not sure if i should be binding the event handlers within document
  // TODO: (because they're document specific hotkeys) or if they should be
  // TODO: declared within `App` to avoid any conflicts. I may be okay because
  // TODO: `useHotkeys` binds to this element and not the document!
  useHotkeys("cmd+enter", addBaseNode);

  // // Hijack zoom
  // let viewer;
  // useHotkeys("cmd+3", () => {
  //   console.log(viewer);
  //   viewer.zoomOnViewerCenter(2);
  //   return false;
  // });

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
              scaleFactorMin={0.5}
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
