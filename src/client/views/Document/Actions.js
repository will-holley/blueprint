import React, { useState } from "react";
import PropTypes from "prop-types";
//* Content Container Action Containers
import { LeftActions, RightActions } from "client/components/Actions";
//* Local UI Elements
import Spotlight from "./Spotlight";
import Name from "./Components/Name";
//* Global UI Elements
import { EmojiButton } from "client/components/Buttons";
//* Hooks
import { useHistory } from "react-router-dom";
import { useHotkeys } from "client/utils/hooks";
import useZoom from "./hotkeys/zoom";
import useArrowNavigation from "./hotkeys/arrows";
import useEscape from "./hotkeys/escape";
import useBackspace from "./hotkeys/backspace";
import useEnter from "./hotkeys/enter";
import useDisableHotkeys from "./hotkeys/disable";

const Actions = ({
  addNode,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  currentZoom,
  editable,
  activeNodeId,
  setActiveNodeId,
  isPrivate,
  documentId,
  displayName,
  edges,
  refetch
}) => {
  // ===========
  // == State ==
  // ===========
  const [spotlightVisible, setSpotlightVisible] = useState(false);
  const handleSpotlightTrigger = event =>
    setSpotlightVisible(!spotlightVisible);

  const { push } = useHistory();

  // ====================
  // == Attach Hotkeys ==
  // ====================

  useZoom(handleZoomIn, handleZoomOut, handleResetZoom, currentZoom);
  useArrowNavigation(setActiveNodeId, activeNodeId, edges, addNode);
  useEscape(setActiveNodeId);
  useBackspace(activeNodeId, refetch);
  useEnter(addNode, activeNodeId, edges);
  useDisableHotkeys();

  //* Auditing
  //useHotkeys("*", event => console.info(event));

  // Hotkey Menu
  useHotkeys("cmd+k", handleSpotlightTrigger, [spotlightVisible]);

  // ====================
  // == Event Handlers ==
  // ====================

  const newBaseNode = event => addNode(null);

  // ============
  // == Render ==
  // ============
  return (
    <>
      <LeftActions>
        <EmojiButton onClick={() => push("/")}>🎨</EmojiButton>
        {editable && <EmojiButton onClick={newBaseNode}>🌀</EmojiButton>}
        <Name text={displayName} editable={editable} documentId={documentId} />
      </LeftActions>
      <RightActions>
        <EmojiButton onClick={handleSpotlightTrigger}>💡</EmojiButton>
        <EmojiButton onClick={handleZoomIn}>➕</EmojiButton>
        <EmojiButton onClick={handleResetZoom}>🔍</EmojiButton>
        <EmojiButton onClick={handleZoomOut}>➖</EmojiButton>
      </RightActions>
      {spotlightVisible && (
        <Spotlight
          documentId={documentId}
          editable={editable}
          closeSpotlight={handleSpotlightTrigger}
          visibilityIsPrivate={isPrivate}
        />
      )}
    </>
  );
};

Actions.propTypes = {
  displayName: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  addNode: PropTypes.func.isRequired,
  handleZoomIn: PropTypes.func.isRequired,
  handleZoomOut: PropTypes.func.isRequired,
  handleResetZoom: PropTypes.func.isRequired,
  currentZoom: PropTypes.number.isRequired,
  editable: PropTypes.bool.isRequired,
  activeNodeId: PropTypes.string,
  setActiveNodeId: PropTypes.func.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  edges: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired
};

export default Actions;
