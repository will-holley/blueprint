import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
// Redux
import { connect } from "react-redux";
import { logout } from "client/data/services/user/actions";
import { createDocument } from "client/data/services/document/actions";
// Components
import { RightActions, ActionLink, ActionDivider } from "client/layout/Actions";
import { EmojiButton } from "client/components/Buttons";

const Actions = ({ isLoggedIn, ...props }) => {
  const [disabled, setDisabled] = useState(false);
  const { push } = useHistory();

  const handleDocumentCreationButtonClick = async () => {
    setDisabled(true);
    const humanId = await props.createDocument();
    push(`d/${humanId}`);
  };

  return (
    <RightActions>
      {isLoggedIn ? (
        <>
          <EmojiButton
            onClick={handleDocumentCreationButtonClick}
            disabled={disabled}
          >
            ➕
          </EmojiButton>
          <ActionLink onClick={props.logout}>Logout</ActionLink>
        </>
      ) : (
        <>
          <ActionLink to="/join">Join</ActionLink>
          <ActionDivider>or</ActionDivider>
          <ActionLink to="/login">Login</ActionLink>
        </>
      )}
    </RightActions>
  );
};

Actions.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  createDocument: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};
Actions.defaultProps = {};

const mapStateToProps = ({ user: { id } }, ownProps) => ({
  isLoggedIn: Boolean(id)
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  logout: () => dispatch(logout()),
  createDocument: async () => dispatch(createDocument())
});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
