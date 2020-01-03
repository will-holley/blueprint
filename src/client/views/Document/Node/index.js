//* Libraries
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Spring } from "react-spring";
//* Hooks
import { useOnClickOutside, useHotkeys } from "client/utils/hooks";
//* Data
import useStore from "client/data/store";
import { useDocumentPermissions } from "client/data/selectors/document";
//* Components
import { Container, Text, NewChildButton } from "./ui";
import { P } from "client/components/tags";

const Node = ({
  id,
  humanId,
  position: { x, y },
  contentType,
  content,
  dev,
  showButtons
}) => {
  //! ============
  //! == CONFIG ==
  //! ============

  const permissions = useDocumentPermissions();

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
      //? Focus
      _el.focus();
      //? If this node cannot be edited, do not move cursor.
      if (permissions.readOnly) return;
      //? Set cursor to end of content
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

  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
      {props => (
        <Container
          style={props}
          ref={el}
          id={id}
          width={300}
          height={height}
          y={y}
          x={x}
          dev={dev}
        >
          {dev && (
            <small>
              {humanId} - {id}
            </small>
          )}
          <Text
            active={isActive}
            ref={textInput}
            onClick={handleClick}
            readOnly={permissions.readOnly}
            contentEditable={!permissions.readOnly}
            suppressContentEditableWarning={true}
            onInput={handleTextInput}
            placeholder={"💭"}
          >
            {content}
          </Text>
          {showButtons && !permissions.readOnly && (
            <NewChildButton onClick={addChild}>➕</NewChildButton>
          )}
        </Container>
      )}
    </Spring>
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
  dev: PropTypes.bool.isRequired,
  showButtons: PropTypes.bool.isRequired
};

Node.defaultProps = {
  dev: false,
  showButtons: false
};

export default Node;
