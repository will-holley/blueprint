import React, { useState } from "react";
// Content Container Action Containers
import { LeftActions, RightActions } from "client/containers/Content/Actions";
// Local UI Elements
import { Title, HotkeyShortcutsContainer } from "./ui";
// Global UI Elements
import { EmojiButton } from "client/components/Buttons";
// Data
import useStore from "client/data/store";
// Hooks
import { useHistory } from "react-router-dom";
import { useHotkeys } from "client/utils/hooks";
import { useKeyboardHotkeys } from "./events";

const keyboardShortcuts = [
  ["cmd + =", "zoom in"],
  ["cmd + -", "zoom out"],
  ["cmd + enter", "create base node"],
  ["escape, with node selected", "de-select node"],
  ["enter, with node selected", "create child node"],
  ["cmd + shift + enter, with node selected", "create sibling node"],
  ["cmd + delete", "delete node"],
  ["cmd + arrow up", "move up"],
  ["cmd + arrow down", "move down"],
  ["cmd + arrow left", "move left"],
  ["cmd + arrow right", "move right"],
  ["cmd + k", "show/hide hotkeys"]
];

const Actions = () => {
  const { push } = useHistory();
  const [
    {
      currentDoc: { id, zoom },
      documents
    },
    actions
  ] = useStore();
  const { name, humanId } = documents[id];

  //! Attach Node keyboard shortcuts
  useKeyboardHotkeys();

  //! Hotkey Menu
  const [showHotkeyMenu, setShowHotkeyMenu] = useState(true);
  const toggleHotkeyMenu = event => setShowHotkeyMenu(!showHotkeyMenu);
  useHotkeys("cmd+k", toggleHotkeyMenu, [showHotkeyMenu]);

  //! Zoom
  const handleZoomIn = event => {
    actions.zoomIn();
    return false;
  };

  const handleZoomOut = event => {
    actions.zoomOut();
    return false;
  };

  const resetZoom = event => {
    actions.resetZoom();
    return false;
  };

  useHotkeys("cmd+=", handleZoomIn, [zoom]);
  useHotkeys("cmd+-", handleZoomOut, [zoom]);

  //! Navigation Handlers
  const navigateToDashboard = () => push("/");

  //! Render
  return (
    <>
      <LeftActions>
        <EmojiButton onClick={navigateToDashboard}>🎨</EmojiButton>
        {/* Hide the add button while the document does not support multiple base nodes. */}
        <EmojiButton onClick={event => actions.addNode(null)}>🌀</EmojiButton>
        <Title>{name ? name : humanId}</Title>
      </LeftActions>
      <RightActions>
        <EmojiButton onClick={toggleHotkeyMenu}>⌨️</EmojiButton>
        <EmojiButton onClick={handleZoomIn}>➕</EmojiButton>
        <EmojiButton onClick={resetZoom}>🔍</EmojiButton>
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

export default Actions;
