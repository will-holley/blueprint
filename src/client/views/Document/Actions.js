import React, { useState } from "react";
import PropTypes from "prop-types";
// Content Container Action Containers
import { LeftActions, RightActions } from "client/layout/Actions";
// Local UI Elements
import { Title, HotkeyShortcutsContainer } from "./ui";
// Global UI Elements
import { EmojiButton } from "client/components/Buttons";
// Hooks
import {
  useDocumentPermissions,
  useCurrentDocument
} from "client/data/selectors/document";
// Hooks
import { useHistory } from "react-router-dom";
import { useHotkeys } from "client/utils/hooks";
import useZoom from "./hotkeys/zoom";
import useArrowNavigation from "./hotkeys/arrows";
import useEscape from "./hotkeys/escape";
import useBackspace from "./hotkeys/backspace";
import useEnter from "./hotkeys/enter";
import useDisableHotkeys from "./hotkeys/disable";

const Actions = () => {
  const { push } = useHistory();
  const [
    { name, humanId, activeNodeId, id: docId },
    actions
  ] = useCurrentDocument();
  const permissions = useDocumentPermissions();

  //! ================
  //! == Hotkey Map ==
  //! ================

  // TODO: wrap this up in a useEffect

  const keyboardShortcuts = [
    ["cmd + =", "zoom in"],
    ["cmd + -", "zoom out"],
    ["escape, with node selected", "de-select node"],
    ["cmd + arrow up", "move up"],
    ["cmd + arrow down", "move down"],
    ["cmd + arrow left", "move left"],
    ["cmd + arrow right", "move right"],
    ["cmd + k", "show/hide hotkeys"]
  ];

  if (permissions.addNode) {
    keyboardShortcuts.push(["cmd + enter", "create base node"]);
    keyboardShortcuts.push(["enter, with node selected", "create child node"]);
    keyboardShortcuts.push([
      "cmd + shift + enter, with node selected",
      "create sibling node"
    ]);
  }

  if (!permissions.readOnly) {
    keyboardShortcuts.push(["cmd + delete", "delete node"]);
  }

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
  ////useHotkeys("*", event => console.info(event)

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
          <EmojiButton onClick={event => actions.addNode(null)}>🌀</EmojiButton>
        )}
        <Title
          disabled={!permissions.editTitle}
          value={name !== null ? name : humanId}
          onChange={({ target: { value } }) =>
            actions.updateDocumentName(docId, value)
          }
        />
      </LeftActions>
      <RightActions>
        <EmojiButton onClick={toggleHotkeyMenu}>⌨️</EmojiButton>
        <EmojiButton onClick={actions.zoomIn}>➕</EmojiButton>
        <EmojiButton onClick={actions.resetZoom}>🔍</EmojiButton>
        <EmojiButton onClick={actions.zoomOut}>➖</EmojiButton>
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

export default Actions;
