import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
// Data
import { useCurrentDocument } from "client/data/selectors/document";
// Components
import Node from "./Node";
import Edge from "./Edge";
import InteractiveSVG from "./InteractiveSVG";
import Actions from "./Actions";
// Rendering Enginers
import renderTree from "./layouts/tree";
import dagger from "./layouts/dagre";

const Document = () => {
  const [currentDocument, actions] = useCurrentDocument();

  /**
   * Wait until nodes have rendered to display them.
   */
  const [nodesRendered, setNodesRendered] = useState(false);
  useEffect(() => {
    if (!currentDocument || nodesRendered) return;
    const nodeId = Object.keys(currentDocument.nodes)[0];
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
      await actions.setActiveDocument(params.humanId);
      // TODO: set node heights here so edges will respect
    }
    loadDocument();
  }, [params.humanId]);

  if (currentDocument) {
    const result = dagger(currentDocument.nodes, currentDocument.edges);
    const nodes = Object.values(result[0]);
    const edges = Object.values(result[1]);
    return (
      <>
        <Actions />
        <InteractiveSVG opacity={nodesRendered ? 1 : 0}>
          {nodes.map(
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
          {edges.map(({ id, position }) => (
            <Edge key={id} position={position} />
          ))}
        </InteractiveSVG>
      </>
    );
  } else {
    return null;
  }
};

Document.propTypes = {};
Document.defaultProps = {};

export default Document;
