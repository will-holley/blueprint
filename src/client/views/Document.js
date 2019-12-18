import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
// Hooks
import { useHotkeys } from "react-hotkeys-hook";
// Data
import useStore from "../data/store";
// Components
import { Container, Actions } from "./../components/style/Document.style";
import Node from "./../components/Node";

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

  // Create a reference to the document plane DOM element. Nodes
  // will use this for computing their positions.
  const el = useRef(null);

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

  //! ============
  //! == RENDER ==
  //! ============
  return (
    <Container ref={el} height={docHeight} width={docWidth}>
      <Actions>
        <p>Document: {id}</p>
        <button onClick={addBaseNode}>New Base</button>
      </Actions>
      {Object.keys(nodes).map(nodeId => {
        const { parentId, dimensions, position, content } = nodes[nodeId];

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
      {/* {edges.map(edge => {
        console.log(edge);
        return <div />;
      })} */}
    </Container>
  );
};

Document.propTypes = {};
Document.defaultProps = {};

export default Document;
