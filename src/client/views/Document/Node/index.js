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

const Node = ({
  id,
  humanId,
  position: { x, y, draggable },
  contentType,
  content,
  depth,
  dev,
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
  const [height, setHeight] = useState(0);

  //! ===============
  //! == UTILITIES ==
  //! ===============

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
   * When node renders, calculate its height.
   */
  useEffect(() => {
    //* Calculate height
    const height = Array.from(el.current.children)
      .map(({ offsetHeight }) => offsetHeight)
      .reduce((acc, height) => (acc += height), 0);
    setHeight(height);
  });

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
    //* Track text area size.
    await actions.updateNodeText(id, innerText);
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

  //? Render relative to window innerHeight and innerWidth
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  //* How many pixels should be between nodes
  const yBottomPadding = 75;
  const calibrateX = coord => windowWidth / 2 + coord - 300 / 2;
  const calibrateY = coord => windowHeight / 2 + coord - height / 2;
  const calibratedX = calibrateX(x);
  const calibratedY = calibrateY(y) + yBottomPadding * depth;
  const edgeEnter = [calibratedX + 150, calibratedY];
  const edgeExit = [calibratedX + 150, calibratedY + height];

  return (
    <>
      {dev && (
        <>
          <circle cx={edgeEnter[0]} cy={edgeEnter[1]} r="3" fill="red" />
          <circle cx={edgeExit[0]} cy={edgeExit[1]} r="3" fill="blue" />
        </>
      )}
      <Container
        ref={el}
        id={id}
        width={300}
        height={height}
        y={calibratedY}
        x={calibratedX}
        dev={dev}
        data-edge-enter={edgeEnter}
        data-edge-exit={edgeExit}
      >
        {dev && (
          <small>
            {humanId} - depth: {depth} - (x: {calibratedX}, y:
            {calibratedY})
          </small>
        )}
        <Text
          active={isActive}
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
  humanId: PropTypes.string.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  contentType: PropTypes.string.isRequired,
  content: PropTypes.string,
  depth: PropTypes.number,
  dev: PropTypes.bool.isRequired,
  showButtons: PropTypes.bool.isRequired
};

Node.defaultProps = {
  dev: true,
  showButtons: true,
  height: 0
};

export default Node;
