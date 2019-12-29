import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
// Hooks
import {
  useWindowSize,
  useOnClickOutside,
  useHotkeys
} from "client/utils/hooks";
// Data
import useStore from "client/data/store";
// Components
import { Container, Text, NewChildButton } from "./ui";
import { P } from "client/components/tags";
// Utils
import { calibratePosition, yBottomPadding } from "./../utils";

const Node = ({
  id,
  position: { x, y, draggable },
  height,
  contentType,
  content,
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

  /**
   * Shifts the cursor to end of text's innerHTML.
   */
  const cursorToEnd = () => {
    const _el = textInput.current;
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(_el, 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
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
      if (_el.innerHTML.length) cursorToEnd();
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
  const handleTextInput = async ({ target: { innerText } }) => {
    // Compute the current height of the node and determine whether or not it has
    // changed since the last text change. If it has changed, update the height
    // as well as the visible text.
    const nodeHeight = calculateHeight();
    //* Track text area size.
    await actions.updateNodeText(
      id,
      innerText,
      nodeHeight !== height ? nodeHeight : null
    );
    //* Ensure the cursor remains at the end of the value
    cursorToEnd();
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

  // Render relative to window innerHeight and innerWidth
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const calibratedX = calibratePosition(x, windowWidth, 300);
  const calibratedY =
    calibratePosition(y, windowHeight, height) + yBottomPadding * depth;

  return (
    <>
      <Container
        ref={el}
        id={id}
        width={300}
        height={height}
        y={calibratedY}
        x={calibratedX}
      >
        {showId && (
          <small>
            {id} - {depth} - ({calibratedX},{calibratedY})
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
          {content}
        </Text>
        {showButtons && <NewChildButton onClick={addChild}>➕</NewChildButton>}
      </Container>
    </>
  );
};

Node.propTypes = {
  id: PropTypes.string.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  height: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  content: PropTypes.string,
  depth: PropTypes.number,
  showId: PropTypes.bool.isRequired,
  showButtons: PropTypes.bool.isRequired
};

Node.defaultProps = {
  showId: false,
  showButtons: false,
  height: 0
};

export default Node;
