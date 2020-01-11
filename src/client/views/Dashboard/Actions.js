import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
// Redux
import { connect, useDispatch } from "react-redux";
import { logout } from "client/data/services/user/actions";
import { createDocument } from "client/data/services/document/actions";
import {
  toggleDashboardVisibilityFilter,
  toggleDeletedVisibility
} from "client/data/services/ui/actions";
// Components
import {
  LeftActions,
  RightActions,
  ActionLink,
  ActionDivider
} from "client/layout/Actions";
import { EmojiButton } from "client/components/Buttons";
import Toggle from "client/components/Toggle";

const Actions = ({ isLoggedIn, showDeletedDocuments, filterDocuments }) => {
  const [disabled, setDisabled] = useState(false);
  const { push } = useHistory();
  const dispatch = useDispatch();

  const handleDocumentCreationButtonClick = async event => {
    setDisabled(true);
    const humanId = await dispatch(createDocument());
    push(`d/${humanId}`);
  };

  const handleLogout = event => dispatch(logout());

  const handleVisibilityFilterToggle = event =>
    dispatch(toggleDashboardVisibilityFilter());

  const handleDeletedVisibility = event => dispatch(toggleDeletedVisibility());

  return (
    <>
      {isLoggedIn && (
        <LeftActions>
          <Toggle
            a="All Blueprints"
            b="Your Blueprints"
            active={filterDocuments === "public" ? "a" : "b"}
            handleClick={handleVisibilityFilterToggle}
          />
        </LeftActions>
      )}
      <RightActions>
        {isLoggedIn ? (
          <>
            <EmojiButton onClick={handleDeletedVisibility}>
              {showDeletedDocuments ? "✅" : "❌"}🗑
            </EmojiButton>
            <EmojiButton
              onClick={handleDocumentCreationButtonClick}
              disabled={disabled}
            >
              ➕
            </EmojiButton>
            <ActionLink onClick={handleLogout}>Logout</ActionLink>
          </>
        ) : (
          <>
            <ActionLink to="/join">Join</ActionLink>
            <ActionDivider>or</ActionDivider>
            <ActionLink to="/login">Login</ActionLink>
          </>
        )}
      </RightActions>
    </>
  );
};

Actions.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  showDeletedDocuments: PropTypes.bool.isRequired,
  filterDocuments: PropTypes.string.isRequired
};
Actions.defaultProps = {};

const mapStateToProps = (
  {
    user: { id },
    ui: {
      dashboard: { showDeleted, filter }
    }
  },
  ownProps
) => ({
  isLoggedIn: Boolean(id),
  showDeletedDocuments: showDeleted,
  filterDocuments: filter
});

export default connect(mapStateToProps)(Actions);
