import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Moment from "moment";
// Data
import useStore from "client/data/store";
// Components
import { Container, DocumentInformation } from "./ui";
import ColoredH1 from "client/components/ColoredH1";
import { H3, H4 } from "client/components/tags";
import Actions from "./Actions";

const Documents = () => {
  const [{ documents }, actions] = useStore();
  const { push } = useHistory();

  const documentsExist = Object.keys(documents).length;

  return (
    <Container>
      <Actions />
      {documentsExist ? (
        Object.entries(documents).map(([id, doc]) => {
          return (
            <DocumentInformation
              key={id}
              onClick={() => push(`d/${doc.humanId}`)}
            >
              <ColoredH1 interactive>
                {doc.name ? doc.name : doc.humanId}
              </ColoredH1>
              <H3>tag1, tag2, tag3</H3>
              <H4>
                {Moment(doc.updatedAt)
                  .startOf("day")
                  .fromNow()}
              </H4>
            </DocumentInformation>
          );
        })
      ) : (
        <ColoredH1>Click 🌀 to start</ColoredH1>
      )}
    </Container>
  );
};

Documents.propTypes = {};
Documents.defaultProps = {};

export default Documents;
