/**
 * @fileoverview `ContentContainer` prepares the application by loading applicable content,
 * such as documents.
 */
//* Libs
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTransition, animated } from "react-spring";
//* Redux
import { connect } from "react-redux";
import { loadUser } from "client/data/services/user/actions";
import { populateAllDocuments } from "client/data/services/document/actions";
import { setLoading } from "client/data/services/ui/actions";
//* Components
import GradientText from "client/components/GradientText";
import { H1 } from "client/components/tags";

const Loading = styled.div`
  padding: 5rem 10rem;
`;

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  // DEV:
  //background: conic-gradient(#fff 90deg, #000 2turn);
`;

const ContentContainer = ({ children, loading, userIsLoggedIn, onLoad }) => {
  /**
   * Load any data which should be populated in application
   * on initialization and when the authentication state changes.
   * TODO: fix -- this is loading twice!
   */
  useEffect(() => {
    (async () => {
      await onLoad();
    })();
  }, [userIsLoggedIn]);

  const transitions = useTransition(!loading, null, {
    from: {
      position: "absolute",
      opacity: 0
    },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });
  return (
    <Container>
      {loading ? (
        <Loading>
          <GradientText>
            <H1>Loading</H1>
          </GradientText>
        </Loading>
      ) : (
        transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div key={key} style={props}>
                {children}
              </animated.div>
            )
        )
      )}
    </Container>
  );
};

ContentContainer.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool.isRequired,
  userIsLoggedIn: PropTypes.bool.isRequired,
  onLoad: PropTypes.func.isRequired
};

const mapStateToProps = ({ ui: { loading }, user: { id } }, ownProps) => ({
  loading,
  userIsLoggedIn: Boolean(id)
});

const mapDispatchToProps = dispatch => ({
  onLoad: async () => {
    await dispatch(loadUser());
    await dispatch(populateAllDocuments());
    setTimeout(() => dispatch(setLoading(false)), 600);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);
