import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
// Data
import useStore from "client/data/store";
// Components
import { Container, Actions } from "client/components/style/Document.style";
import Node from "client/components/Node";
import InteractiveSVG from "client/components/InteractiveSVG";
// Events

import { useKeyboardHotkeys } from "./events";

const Document = () => {
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

  //! Attach keyboard shortcuts
  useKeyboardHotkeys(nodes, activeNodeId && nodes[activeNodeId]);

  return (
    <Container>
      <Actions>
        <p>Document: {id}</p>
        <button onClick={event => actions.addNode(null)}>New Base</button>
      </Actions>
      <InteractiveSVG>
        {Object.values(nodes).map(
          ({ id: nodeId, parentId, dimensions, position, content, depth }) => (
            <Node
              key={nodeId}
              id={nodeId}
              parentId={parentId}
              position={position}
              dimensions={dimensions}
              content={content}
              depth={depth}
            />
          )
        )}
      </InteractiveSVG>
    </Container>
  );
};

Document.propTypes = {};
Document.defaultProps = {};

export default Document;
