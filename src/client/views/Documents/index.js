import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Moment from "moment";
import { connect } from "react-redux";
//* Redux Actions
import { setActiveDocument } from "client/data/services/document/actions";
// Components
import { Container, DocumentInformation } from "./ui";
import GradientText from "client/components/GradientText";
import { H1, H3, P } from "client/components/tags";
import Actions from "./Actions";

// Styles
import { getRandomGradient } from "client/styles/gradients";

const Documents = ({ allDocs, activeDocId, userId }) => {
  const { push } = useHistory();

  useEffect(() => {
    // Clear any active document
    if (activeDocId) setActiveDocument(null);
  }, [activeDocId]);

  return (
    <Container>
      <Actions />
      {allDocs.length ? (
        allDocs.map(([id, doc]) => {
          const ownedByUser = userId ? userId === doc.createdBy : false;
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
              <P>
                {doc.private
                  ? "For your eyes only 😎"
                  : `${ownedByUser ? "Yours - " : ""}Public 🥳`}
              </P>
              <P>
                {Moment(doc.updatedAt)
                  .startOf("day")
                  .fromNow()}
              </P>
            </DocumentInformation>
          );
        })
      ) : userId ? (
        <GradientText>
          <H1>Click ➕ to start</H1>
        </GradientText>
      ) : (
        <H1>👀 ➡️</H1>
      )}
    </Container>
  );
};

Documents.propTypes = {
  allDocs: PropTypes.array.isRequired,
  activeDocId: PropTypes.string,
  userId: PropTypes.string
};
Documents.defaultProps = {};

const mapStateToProps = ({ documents, user }, ownProps) => ({
  allDocs: Object.entries(documents.all),
  activeDocId: documents.active.id,
  userId: user.id
});

export default connect(mapStateToProps)(Documents);
