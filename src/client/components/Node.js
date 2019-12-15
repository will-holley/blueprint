import React, { useState } from "react";
import PropTypes from "prop-types";
// Data
import Store from "../data/store";
// Components
import Nodes from "./Nodes";

const Node = ({ id, parentId }) => (
  <div>
    <p>{id}</p>
    <Store>
      {(state, actions) => (
        <>
          <button onClick={event => actions.addNode(id)}>Add Child</button>
          <Nodes rootId={id} />
        </>
      )}
    </Store>
  </div>
);

Node.propTypes = {
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string
};
Node.defaultProps = {};

export default Node;
