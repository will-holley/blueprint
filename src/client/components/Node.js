import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
// Hooks
import { useHotkeys } from "react-hotkeys-hook";
import { useWindowSize } from "../utils/hooks";
// Data
import useStore from "../data/store";
// Components
import { Container, Text, NewChildButton } from "./style/Node.style";

const Node = ({
  id,
  parentId,
  position: { x, y, draggable },
  dimensions: { height, width },
  content: { type, text }
}) => {
  //! ============
  //! == CONFIG ==
  //! ============

  const [state, actions] = useStore();

  //* Determine if this node is active
  const isActive = state.currentDoc.activeNode === id;

  //* Ref used for tracking container height.
  const el = useRef(null);
  const textInput = useRef(null);

  // TODO: may need to set this in an `useEffect` onMount tracker to handle weird
  // TODO: behaviors associated with nodes that have no text content (and as such no height)
  // TODO: within the state having their position re-computed when another node is added.
  let lastHeight = null;

  //! ===============
  //! == LIFECYCLE ==
  //! ===============

  /**
   * Run on mount (b/c of empty dependency array)
   */
  useEffect(() => {
    // isActive should always be `true`
    textInput.current.focus();
  }, []);

  //! ====================
  //! == EVENT HANDLERS ==
  //! ====================

  /**
   * Adds a new child node.
   * @param {Object} event
   */
  const addChild = event => actions.addNode(id);

  // TODO: this needs to be attached to text because it's the element
  // TODO: being focused!
  // TODO: See https://github.com/JohannesKlauss/react-hotkeys-hook/issues/127
  ////useHotkeys("cmd+enter", () => console.log("child hotkey"));

  /**
   * Controlled input logic that updates the Node's text as the user changes it.
   * Also updates node height in state if number of text lines has changed.
   * @param {Object} event
   */
  const handleTextInput = ({ target: { value } }) => {
    // Compute the current height of the node and determine whether or not it has
    // changed since the last text change. If it has changed, update the height
    // as well as the visible text.
    const nodeHeight = el.current.clientHeight;
    let shouldUpdateHeight = false;
    if (nodeHeight !== lastHeight) {
      lastHeight = nodeHeight;
      shouldUpdateHeight = true;
    }
    actions.updateNodeText(id, value, shouldUpdateHeight ? nodeHeight : null);
  };

  //! ============
  //! == RENDER ==
  //! ============

  // Render relative to window innerHeight and innerWidth
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const quarterHeight = windowHeight / 4; // start here for vertical tree
  const midWidth = windowWidth / 2;
  const adjustedY = quarterHeight + y;
  const adjustedX = midWidth + x;
  return (
    <Container
      ref={el}
      width={width}
      top={adjustedY - height / 2}
      left={adjustedX - width / 2}
    >
      <Text
        ref={textInput}
        width={width}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleTextInput}
        placeholder={"💭"}
      >
        {text}
      </Text>
      <p>
        {x},{y}
      </p>
      <NewChildButton onClick={addChild}>➕</NewChildButton>
    </Container>
  );
};

Node.propTypes = {
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  dimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number.isRequired
  }).isRequired,
  content: PropTypes.shape({
    type: PropTypes.string,
    text: PropTypes.string
  }).isRequired
};
Node.defaultProps = {};

export default Node;
