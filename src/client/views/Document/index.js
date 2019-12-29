import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
// Data
import useStore from "client/data/store";
// Components
import Node from "./Node";
import Edge from "./Edge";
import InteractiveSVG from "./InteractiveSVG";
import Actions from "./Actions";
// Rendering Enginers
import { renderTree } from "./graphRenderers";

const Document = () => {
  const [
    {
      currentDoc: { id },
      documents
    },
    actions
  ] = useStore();
  const params = useParams();
  const currentDocument = id ? documents[id] : null;

  /**
   *! When the document has changed.
   */
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

  return currentDocument ? (
    <>
      <Actions />
      <InteractiveSVG>
        {Object.values(
          renderTree(currentDocument.nodes, currentDocument.edges)
        ).map(
          ({ id: nodeId, humanId, position, contentType, content, depth }) => (
            <Node
              key={nodeId}
              humanId={humanId}
              id={nodeId}
              position={position}
              contentType={contentType}
              content={content}
              depth={depth}
            />
          )
        )}
        {Object.values(currentDocument.edges).map(
          ({ id, humanId, nodeA, nodeB }) => (
            <Edge
              key={id}
              id={id}
              humanId={humanId}
              nodeAId={nodeA}
              nodeBId={nodeB}
            />
          )
        )}
      </InteractiveSVG>
    </>
  ) : (
    <></>
  );
};

Document.propTypes = {};
Document.defaultProps = {};

export default Document;
