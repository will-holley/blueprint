import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
// Data
import { connect } from "react-redux";
import { setActiveDocument } from "client/data/services/document/actions";
// Components
import Node from "./Node";
import Edge from "./Edge";
import InteractiveSVG from "./InteractiveSVG";
import Actions from "./Actions";
// Rendering Enginers
import renderTree from "./layouts/tree";
import dagger from "./layouts/dagre";

const Document = ({ id, nodes, edges, updateActiveDocument }) => {
  /**
   * Wait until nodes have rendered to display them.
   */
  const [nodesRendered, setNodesRendered] = useState(false);
  useEffect(() => {
    if (!id || nodesRendered) return;
    const nodeId = Object.keys(nodes)[0];
    const el = document.getElementById(nodeId);
    if (Boolean(el)) setNodesRendered(true);
  });

  /**
   *! When the document has changed.
   */
  const params = useParams();
  useEffect(() => {
    /**
     * Sets the active document and fetches node & edge data.
     * Creates an initial node if one does not exist.
     */
    async function loadDocument() {
      await updateActiveDocument(params.humanId);
      // TODO: set node heights here so edges will respect
    }
    loadDocument();
  }, [params.humanId]);

  console.log("rendering");

  if (id) {
    const result = dagger(nodes, edges);
    const positionedNodes = Object.values(result[0]);
    const positionedEdges = Object.values(result[1]);
    return (
      <>
        <Actions />
        <InteractiveSVG opacity={nodesRendered ? 1 : 0}>
          {positionedNodes.map(
            ({ id: nodeId, humanId, position, contentType, content }) => (
              <Node
                key={nodeId}
                humanId={humanId}
                id={nodeId}
                position={position}
                contentType={contentType}
                content={content}
              />
            )
          )}
          {positionedEdges.map(({ id, position }) => (
            <Edge key={id} position={position} />
          ))}
        </InteractiveSVG>
      </>
    );
  } else {
    return null;
  }
};

Document.propTypes = {
  updateActiveDocument: PropTypes.func.isRequired,
  id: PropTypes.string,
  nodes: PropTypes.object.isRequired,
  edges: PropTypes.object.isRequired
};
Document.defaultProps = {};

const mapStateToProps = (
  {
    documents: {
      active: { id },
      all
    }
  },
  ownProps
) => ({
  id,
  nodes: id ? all[id].nodes : {},
  edges: id ? all[id].edges : {}
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateActiveDocument: async humanId => dispatch(setActiveDocument(humanId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Document);
