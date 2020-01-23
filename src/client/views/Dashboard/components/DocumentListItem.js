import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Moment from "moment";
//* Components
import GradientText from "client/components/GradientText";
import { H1, P } from "client/components/tags";
//* Hooks
import { useHistory } from "react-router-dom";

//* ===============================
//* == Presentational Components ==
//* ===============================

const Container = styled.div`
  cursor: pointer;
  margin-bottom: 4rem;
`;

//* =====================
//* == React Component ==
//* =====================

const TODAY = new Date();

const DocumentListItem = ({
  id,
  name,
  humanId,
  createdBy,
  updatedAt,
  private: _private,
  createdByUser
}) => {
  const { push } = useHistory();
  const interactionTimestamp = Moment(updatedAt);
  return (
    <Container onClick={() => push(`d/${humanId}`)}>
      <GradientText interactive>
        <H1>{name ? name : humanId}</H1>
      </GradientText>
      {/* <H3>tag1, tag2, tag3</H3> */}
      <P>
        {_private
          ? "For your eyes only 😎"
          : `${createdByUser ? "Yours - " : ""}Public 🥳`}
      </P>
      <P>
        {interactionTimestamp.isSame(TODAY, "day")
          ? interactionTimestamp.fromNow()
          : interactionTimestamp.startOf("day").fromNow()}
      </P>
    </Container>
  );
};

DocumentListItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  humanId: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  private: PropTypes.bool.isRequired,
  createdByUser: PropTypes.bool
};
DocumentListItem.defaultProps = {};

export default DocumentListItem;
