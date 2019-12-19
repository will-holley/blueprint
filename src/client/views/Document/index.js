import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
// Hooks
import { useHotkeys } from "client/utils/hooks";
// Data
import useStore from "client/data/store";
// Components
import { Container, Actions } from "client/components/style/Document.style";
import Node from "client/components/Node";
import { AutoSizer } from "react-virtualized";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";
// Events
import { useKeyboardHotkeys } from "./events";

const Document = () => {
  //! ===========
  //! == HOOKS ==
  //! ===========

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

  //! ============
  //! == EVENTS ==
  //! ============

  useKeyboardHotkeys(nodes, activeNodeId && nodes[activeNodeId]);

  //! ============
  //! == RENDER ==
  //! ============
  return (
    <Container>
      <Actions>
        <p>Document: {id}</p>
        <button onClick={event => actions.addNode(null)}>New Base</button>
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
                  const {
                    parentId,
                    dimensions,
                    position,
                    content,
                    depth
                  } = nodes[nodeId];
                  return (
                    <Node
                      key={nodeId}
                      id={nodeId}
                      parentId={parentId}
                      position={position}
                      dimensions={dimensions}
                      content={content}
                      depth={depth}
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
