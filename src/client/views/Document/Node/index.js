//* Libraries
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Spring } from "react-spring";
//* GraphQL
import { gql, useMutation } from "@apollo/client";
//* Hooks
import { useOnClickOutside, useHotkeys } from "client/utils/hooks";
//* Components
import { Container, Text, NewChildButton } from "./ui";
import { P } from "client/components/tags";
//* Constants
import { VERTEX_WIDTH } from "./../constants";

const UPDATE_TEXT = gql`
  mutation UpdateText($id: UUID!, $text: String!) {
    updateNode(input: { patch: { content: $text }, id: $id }) {
      clientMutationId
      _node {
        id
        content
      }
    }
  }
`;

const Node = ({
  id,
  humanId,
  position: { x, y },
  contentType,
  content,
  editable,
  isActive,
  handleClickOutside,
  setAsActive,
  addChildNode,
  //
  dev,
  showButtons
}) => {
  //! ============
  //! == CONFIG ==
  //! ============

  //* Ref used for tracking container height.
  const containerRef = useRef(null);
  const textInput = useRef(null);

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
   * When `isActive` changes, check if this node should
   * be focused.
   */
  useEffect(() => {
    const _el = textInput.current;
    if (isActive) {
      // Focus
      _el.focus();
      // If this node cannot be edited, do not set cursor.
      if (!editable) return;
      // Set cursor to end of content
      const caretPos = _el.value.length;
      _el.setSelectionRange(caretPos, caretPos);
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
   * Syncs vertex text with the server.
   * @param {Event}
   */
  const [updateText] = useMutation(UPDATE_TEXT);
  const handleTextInput = async ({ target: { value } }) => {
    await updateText({ variables: { id, text: value } });
  };

  /**
   * If this node is current active, set it as inactive
   */
  useOnClickOutside(containerRef, event => {
    if (!isActive) return;
    handleClickOutside();
  });

  /**
   * Set height outside of the react dom in order to avoid a re-render.
   * @param {Number} newHeight - Textarea height in pixels.
   */
  const handleHeightChange = newHeight => {
    const _el = ReactDOM.findDOMNode(containerRef.current);
    _el.setAttribute("height", newHeight);
    _el.style.height = newHeight;
  };

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

  console.log("Re-rendering");

  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
      {props => (
        <Container
          style={props}
          ref={containerRef}
          id={id}
          // Height is set by `handleHeightChange`
          width={VERTEX_WIDTH}
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
            inputRef={textInput}
            readOnly={!editable}
            onChange={handleTextInput}
            placeholder={isActive && !editable ? "🔵" : "💭"}
            value={content}
            onHeightChange={handleHeightChange}
            onClick={setAsActive}
          />
          {showButtons && editable && (
            <NewChildButton onClick={addChildNode}>➕</NewChildButton>
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
  editable: PropTypes.bool.isRequired,
  addChildNode: PropTypes.func.isRequired,
  handleClickOutside: PropTypes.func.isRequired,
  setAsActive: PropTypes.func.isRequired,
  // Local Dev
  dev: PropTypes.bool.isRequired,
  showButtons: PropTypes.bool.isRequired
};

Node.defaultProps = {
  dev: false,
  showButtons: false
};

export default Node;
