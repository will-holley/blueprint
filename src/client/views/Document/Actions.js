import React from "react";
import PropTypes from "prop-types";
// Content Container Action Containers
import { LeftActions, RightActions } from "client/layout/Actions";
// Local UI Elements
import { Title } from "./ui";
import Spotlight from "./Spotlight";
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
  resetZoom,
  changeSpotlightVisibility
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
  handleResetZoom,
  spotlightVisible,
  handleSpotlightTrigger
}) => {
  const { push } = useHistory();
  const { name, humanId, activeNodeId, id: docId } = useSelector(
    activeDocumentSelector
  );
  const permissions = useSelector(documentPermissionsSelector);

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
  useHotkeys("cmd+k", handleSpotlightTrigger, [spotlightVisible]);

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
        <EmojiButton onClick={handleSpotlightTrigger}>💡</EmojiButton>
        <EmojiButton onClick={handleZoomIn}>➕</EmojiButton>
        <EmojiButton onClick={handleResetZoom}>🔍</EmojiButton>
        <EmojiButton onClick={handleZoomOut}>➖</EmojiButton>
      </RightActions>
      {spotlightVisible && <Spotlight />}
    </>
  );
};

Actions.propTypes = {
  newBaseNode: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  handleZoomIn: PropTypes.func.isRequired,
  handleZoomOut: PropTypes.func.isRequired,
  handleResetZoom: PropTypes.func.isRequired,
  spotlightVisible: PropTypes.bool.isRequired,
  handleSpotlightTrigger: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  newBaseNode: () => dispatch(addNode(null)),
  updateName: name => dispatch(updateDocumentName(name)),
  handleZoomIn: () => dispatch(zoomIn()),
  handleZoomOut: () => dispatch(zoomOut()),
  handleResetZoom: () => dispatch(resetZoom()),
  handleSpotlightTrigger: () => dispatch(changeSpotlightVisibility())
});

const mapStateToProps = ({
  documents: {
    active: { spotlightVisible }
  }
}) => ({ spotlightVisible });

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
