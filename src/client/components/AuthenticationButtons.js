import React from "react";
import PropTypes from "prop-types";
//* Components
import { ActionDivider, ActionLink } from "./Actions";

const AuthenticationButtons = ({ isAuthenticated, refetchDashboardData }) => {
  const handleLogout = event => {
    window.localStorage.removeItem("jwt");
    refetchDashboardData();
  };

  return isAuthenticated ? (
    <ActionLink onClick={handleLogout}>Logout</ActionLink>
  ) : (
    <>
      <ActionLink to="/join">Join</ActionLink>
      <ActionDivider>or</ActionDivider>
      <ActionLink to="/login">Login</ActionLink>
    </>
  );
};

AuthenticationButtons.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  refetchDashboardData: PropTypes.func.isRequired
};

export default AuthenticationButtons;
