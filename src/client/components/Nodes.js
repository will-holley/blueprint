import React from "react";
import PropTypes from "prop-types";
// Data
import Store from "../data/store";
// Components
import Node from "./Node";

const Nodes = ({ rootId }) => {
  return (
    <div style={{ border: "1px solid black", paddingLeft: "1rem" }}>
      <Store>
        {(state, actions) => {
          // Fetch all nodes from the first document.  There
          // will only be one document until multi-docs are
          // implemented.
          const allNodes = Object.values(state.documents)[0].nodes;
          // Get nodes from the rootId
          return Object.keys(allNodes)
            .filter(id => allNodes[id].parentId == rootId)
            .map(nodeId => {
              const { parentId, children } = allNodes[nodeId];
              return <Node key={nodeId} id={nodeId} parentId={parentId} />;
            });
        }}
      </Store>
    </div>
  );
};

Nodes.propTypes = { rootId: PropTypes.string };
Nodes.defaultProps = {};

export default Nodes;
