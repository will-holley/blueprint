import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Moment from "moment";
// Data
import useStore from "client/data/store";
// Components
import { Container, DocumentInformation } from "./ui";
import GradientText from "client/components/GradientText";
import { H1, H3, H4 } from "client/components/tags";
import Actions from "./Actions";
// Styles
import { getRandomGradient } from "client/styles/gradients";

const Documents = () => {
  const [{ documents, user }, actions] = useStore();
  const { push } = useHistory();

  const documentsExist = Object.keys(documents).length;

  useEffect(() => {
    actions.setActiveDocument(null);
  }, []);

  return (
    <Container>
      <Actions />
      {documentsExist ? (
        Object.entries(documents).map(([id, doc]) => {
          const _private = Math.random() > 0.35;
          const gradient = getRandomGradient();
          return (
            <DocumentInformation
              key={id}
              onClick={() => push(`d/${doc.humanId}`)}
            >
              <GradientText interactive>
                <H1>{doc.name ? doc.name : doc.humanId}</H1>
              </GradientText>
              {/* <H3>tag1, tag2, tag3</H3> */}
              <H4>{doc.private ? "Private 😎" : "Public 🥳"}</H4>
              <H4>
                {Moment(doc.updatedAt)
                  .startOf("day")
                  .fromNow()}
              </H4>
            </DocumentInformation>
          );
        })
      ) : user ? (
        <GradientText>
          <H1>Click ➕ to start</H1>
        </GradientText>
      ) : (
        <H1>👀 ➡️</H1>
      )}
    </Container>
  );
};

Documents.propTypes = {};
Documents.defaultProps = {};

export default Documents;
