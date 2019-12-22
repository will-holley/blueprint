import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
// Data
import useStore from "client/data/store";
// Components
import {
  Container,
  Actions,
  Title,
  LeftActions,
  RightActions,
  HotkeyShortcutsContainer
} from "client/components/style/Document.style";
import Node from "client/components/Node";
import InteractiveSVG from "client/components/InteractiveSVG";
import { EmojiButton } from "client/components/style/Buttons";
// Events
import { useKeyboardHotkeys } from "./events";
import { useHotkeys } from "client/utils/hooks";

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
  ["cmd + k", "show keyboard shortcuts"]
];

const Document = () => {
  const [
    {
      currentDoc: {
        id,
        dimensions: { height: docHeight, width: docWidth },
        activeNodeId
      },
      documents
    },
    actions
  ] = useStore();
  const { nodes, edges } = documents[id];
  //! Hotkey Menu
  const [showHotkeyMenu, setShowHotkeyMenu] = useState(false);
  //! Set up zoom variables
  const defaultZoom = 1;
  const [zoom, setZoom] = useState(defaultZoom);

  //! Zoom
  const handleZoomIn = event => {
    const newZoom = zoom + 0.1;
    setZoom(newZoom);
    return false;
  };

  const handleZoomOut = event => {
    const newZoom = zoom - 0.1;
    setZoom(newZoom);
    return false;
  };

  const resetZoom = event => {
    setZoom(defaultZoom);
    return false;
  };

  useHotkeys("cmd+=", handleZoomIn, [zoom]);
  useHotkeys("cmd+-", handleZoomOut, [zoom]);

  //! Attach Node keyboard shortcuts
  useKeyboardHotkeys(nodes, activeNodeId && nodes[activeNodeId]);

  const toggleHotkeyMenu = event => setShowHotkeyMenu(!showHotkeyMenu);
  useHotkeys("cmd+k", toggleHotkeyMenu, [showHotkeyMenu]);

  return (
    <Container>
      <LeftActions>
        <EmojiButton onClick={event => actions.addNode(null)}>🌀</EmojiButton>
        <Title>{id}</Title>
      </LeftActions>
      <RightActions>
        <EmojiButton onClick={toggleHotkeyMenu}>⌨️</EmojiButton>
        <EmojiButton onClick={handleZoomIn}>➕</EmojiButton>
        <EmojiButton onClick={resetZoom}>🔍</EmojiButton>
        <EmojiButton onClick={handleZoomOut}>➖</EmojiButton>
      </RightActions>
      {showHotkeyMenu && (
        <HotkeyShortcutsContainer>
          <h2>shortcuts</h2>
          {keyboardShortcuts.map(([cmd, action]) => (
            <div key={cmd}>
              <code>{cmd}</code>
              <span>{action}</span>
            </div>
          ))}
        </HotkeyShortcutsContainer>
      )}
      <InteractiveSVG zoom={zoom}>
        {Object.values(nodes).map(
          ({ id: nodeId, parentId, dimensions, position, content, depth }) => (
            <Node
              key={nodeId}
              id={nodeId}
              parentId={parentId}
              position={position}
              dimensions={dimensions}
              content={content}
              depth={depth}
            />
          )
        )}
      </InteractiveSVG>
    </Container>
  );
};

Document.propTypes = {};
Document.defaultProps = {};

export default Document;
