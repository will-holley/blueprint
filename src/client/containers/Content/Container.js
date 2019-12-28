/**
 * @fileoverview `ContentContainer` prepares the application by loading applicable content,
 * such as documents.
 */
//* Libs
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTransition, animated } from "react-spring";
//* Hooks
import useStore from "client/data/store";
//* Components
import ColoredH1 from "client/components/ColoredH1";

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

const ContentContainer = ({ children }) => {
  const [
    {
      ui: { loading }
    },
    actions
  ] = useStore();

  useEffect(() => {
    /**
     * Load any data which should be populated in application
     * on initialization.
     */
    async function loadData() {
      await actions.populateAllDocuments();
      // After content has loaded
      setTimeout(() => actions.setLoading(false), 600);
    }

    loadData();
  }, [window.location.href]);

  const transitions = useTransition(!loading, null, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });
  return (
    <Container>
      {loading ? (
        <Loading>
          <ColoredH1>Loading</ColoredH1>
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

ContentContainer.propTypes = { children: PropTypes.node.isRequired };

export default ContentContainer;
