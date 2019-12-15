import React from "react";
import PropTypes from "prop-types";
// Data
import Store from "../data/store";
// Components
import Nodes from "../components/Nodes";

/**
 * TODO: Turn this into a "document" which lives
 * under a collection which lives under the dashboard.
 */
const Dashboard = ({}) => (
  <>
    <Store>
      {(state, actions) => {
        const doc = Object.values(state.documents)[0];
        const hasNodes = Boolean(Object.keys(doc.nodes).length);
        return (
          <>
            <button onClick={event => actions.addNode(null)}>New Base</button>
            {hasNodes && <Nodes rootId={null} />}
          </>
        );
      }}
    </Store>
  </>
);

Dashboard.defaultProps = {};
Dashboard.propTypes = {};

export default Dashboard;
