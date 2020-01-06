import React, { useState } from "react";
import PropTypes from "prop-types";
// Content Container Action Containers
import { LeftActions, RightActions } from "client/layout/Actions";
// Local UI Elements
import { Title, HotkeyShortcutsContainer } from "./ui";
// Global UI Elements
import { EmojiButton } from "client/components/Buttons";
// Redux
import {
  activeDocumentSelector,
  documentPermissionsSelector
} from "client/data/selectors/document";
import { connect, useSelector } from "react-redux";
import {
  addNode,
  updateDocumentName,
  zoomIn,
  zoomOut,
  resetZoom
} from "client/data/services/document/actions";
// Hooks
import { useHistory } from "react-router-dom";
import { useHotkeys } from "client/utils/hooks";
import useZoom from "./hotkeys/zoom";
import useArrowNavigation from "./hotkeys/arrows";
import useEscape from "./hotkeys/escape";
import useBackspace from "./hotkeys/backspace";
import useEnter from "./hotkeys/enter";
import useDisableHotkeys from "./hotkeys/disable";

const Actions = ({
  newBaseNode,
  updateName,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom
}) => {
  const { push } = useHistory();
  const { name, humanId, activeNodeId, id: docId } = useSelector(
    activeDocumentSelector
  );
  const permissions = useSelector(documentPermissionsSelector);

  //! ================
  //! == Hotkey Map ==
  //! ================

  // TODO: wrap this up in a useEffect

  const keyboardShortcuts = [
    ["cmd + =", "zoom in"],
    ["cmd + -", "zoom out"],
    ["cmd + 0", "reset zoom"],
    ["escape, with node selected", "de-select node"],
    ["cmd + arrow up", "move up"],
    ["cmd + arrow down", "move down"],
    ["cmd + arrow left", "move left"],
    ["cmd + arrow right", "move right"],
    ["cmd + k", "show/hide hotkeys"],
    ["cmd + enter", "create base node"],
    ["enter, with node selected", "create child node"],
    ["cmd + shift + enter, with node selected", "create sibling node"],
    ["cmd + delete", "delete node"]
  ];

  //! ====================
  //! == Attach Hotkeys ==
  //! ====================
  useZoom();
  useArrowNavigation();
  useEscape();
  useBackspace();
  useEnter();
  useDisableHotkeys();

  //* Auditing
  //useHotkeys("*", event => console.info(event));

  //! Hotkey Menu
  const [showHotkeyMenu, setShowHotkeyMenu] = useState(false);
  const toggleHotkeyMenu = event => setShowHotkeyMenu(!showHotkeyMenu);
  useHotkeys("cmd+k", toggleHotkeyMenu, [showHotkeyMenu]);

  //! Render
  return (
    <>
      <LeftActions>
        <EmojiButton onClick={() => push("/")}>🎨</EmojiButton>
        {permissions.addNodes && (
          <EmojiButton onClick={newBaseNode}>🌀</EmojiButton>
        )}
        <Title
          disabled={!permissions.editTitle}
          value={name !== null ? name : humanId}
          onChange={({ target: { value } }) => updateName(value)}
        />
      </LeftActions>
      <RightActions>
        <EmojiButton onClick={toggleHotkeyMenu}>⌨️</EmojiButton>
        <EmojiButton onClick={handleZoomIn}>➕</EmojiButton>
        <EmojiButton onClick={handleResetZoom}>🔍</EmojiButton>
        <EmojiButton onClick={handleZoomOut}>➖</EmojiButton>
      </RightActions>
      {showHotkeyMenu && (
        <HotkeyShortcutsContainer>
          <h2>Hotkeys</h2>
          {keyboardShortcuts.map(([cmd, action]) => (
            <div key={cmd}>
              <code>{cmd}</code>
              <span>{action}</span>
            </div>
          ))}
        </HotkeyShortcutsContainer>
      )}
    </>
  );
};

Actions.propTypes = {
  newBaseNode: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  handleZoomIn: PropTypes.func.isRequired,
  handleZoomOut: PropTypes.func.isRequired,
  handleResetZoom: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  newBaseNode: () => dispatch(addNode(null)),
  updateName: name => dispatch(updateDocumentName(name)),
  handleZoomIn: () => dispatch(zoomIn()),
  handleZoomOut: () => dispatch(zoomOut()),
  handleResetZoom: () => dispatch(resetZoom())
});

export default connect(null, mapDispatchToProps)(Actions);
