import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
// Hooks
import { useWindowSize, useOnClickOutside, useHotkeys } from "../utils/hooks";
// Data
import useStore from "../data/store";
// Components
import { Container, Text, NewChildButton } from "./style/Node.style";
import { Edge } from "./../components/style/Edge.style";
import { P } from "./tags";

const Node = ({
  id,
  parentId,
  position: { x, y, draggable },
  dimensions: { height, width },
  content: { type, text },
  depth,
  showId,
  showButtons
}) => {
  //! ============
  //! == CONFIG ==
  //! ============

  const [state, actions] = useStore();

  //* Determine if this node is active
  const isActive = state.currentDoc.activeNodeId === id;

  //* Ref used for tracking container height.
  const el = useRef(null);
  const textInput = useRef(null);

  //! ===============
  //! == UTILITIES ==
  //! ===============

  /**
   * Calculates the height of container based on the height
   * of all child elements.
   */
  const calculateHeight = () => {
    return Array.from(el.current.children)
      .map(({ offsetHeight }) => offsetHeight)
      .reduce((acc, height) => (acc += height), 0);
  };

  //! ===============
  //! == LIFECYCLE ==
  //! ===============

  /**
   * When `isActive` changes, check if this node should
   * be focused.
   */
  useEffect(() => {
    const _el = textInput.current;
    if (isActive) {
      // focus
      _el.focus();
      // Set cursor to end of content
      if (_el.innerHTML.length) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(_el, 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else if (window.document.activeElement === _el) {
      // Programmatically de-focus if this element is not active
      // but was.  This occurs when `escape` key is pressed.
      _el.blur();
    }
  }, [isActive]);

  /**
   * When node renders, set height property in the store.
   */
  useEffect(() => {
    // on mount
    actions.updateNodeHeight(id, calculateHeight());
  }, []);

  //! ====================
  //! == EVENT HANDLERS ==
  //! ====================

  /**
   * Adds a new child node.
   * @param {Object} event
   */
  const addChild = event => actions.addNode(id);

  /**
   * Controlled input logic that updates the Node's text as the user changes it.
   * Also updates node height in state if number of text lines has changed.
   * @param {Object} event
   */
  const handleTextInput = ({ target: { value } }) => {
    // Compute the current height of the node and determine whether or not it has
    // changed since the last text change. If it has changed, update the height
    // as well as the visible text.
    const nodeHeight = calculateHeight();
    //* Track text area size.
    actions.updateNodeText(
      id,
      value,
      nodeHeight !== height ? nodeHeight : null
    );
  };

  const handleClick = event => actions.setActiveNode(id);

  /**
   * If this node is current active, set it as inactive
   */
  useOnClickOutside(el, () => {
    if (isActive) actions.setActiveNode(null);
  });

  //! =============
  //! == HOTKEYS ==
  //! =============

  // Prevent the enter key from expanding the text area
  useHotkeys("enter", () => {
    return false;
  });

  //! ============
  //! == RENDER ==
  //! ============

  //$ Position Calibration
  // How many pixels should be between nodes
  const yBottomPadding = 75;

  // Render relative to window innerHeight and innerWidth
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const calibrateX = n => windowWidth / 2 + n - width / 2;
  const calibrateY = n => windowHeight / 2 + n - height / 2;
  const calibratedY = calibrateY(y) + yBottomPadding * depth;
  const calibratedX = calibrateX(x);

  // Create Edge to parent
  let d = [];
  if (parentId) {
    const {
      position: { y: parentY, x: parentX },
      dimensions: { width: parentWidth, height: parentHeight }
    } = state.documents[state.currentDoc.id].nodes[parentId];

    // Calculate Edge position
    d = [
      "M",
      calibrateX(parentX) + parentWidth / 2,
      calibrateY(parentY) + parentHeight + yBottomPadding * (depth - 1),
      "L",
      calibratedX + width / 2,
      calibratedY
    ];
  }

  return (
    <>
      {parentId && <Edge key={`${parentId}-${id}`} d={d.join(" ")} />}
      <Container
        ref={el}
        width={width}
        height={height}
        y={calibratedY}
        x={calibratedX}
      >
        {showId && (
          <small>
            {id} - {depth}
          </small>
        )}
        <Text
          ref={textInput}
          onClick={handleClick}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={handleTextInput}
          placeholder={"💭"}
        >
          {text}
        </Text>
        {showButtons && <NewChildButton onClick={addChild}>➕</NewChildButton>}
      </Container>
    </>
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
  }).isRequired,
  depth: PropTypes.number,
  showId: PropTypes.bool.isRequired,
  showButtons: PropTypes.bool.isRequired
};

Node.defaultProps = {
  showId: true,
  showButtons: false
};

export default Node;
