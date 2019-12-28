import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
// Data
import useStore from "client/data/store";
// Components
import Node from "./Node";
import InteractiveSVG from "./InteractiveSVG";
import Actions from "./Actions";

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
   * On document mount
   */
  useEffect(() => {
    //! Set the humanId from the url param
    actions.setLoading(true);
    actions.setActiveDocument(params.humanId);
    actions.setLoading(false);
    //! If this is a new document and there are no nodes, create one
    if (id && !currentDocument.nodes.length) {
      const nodeId = actions.addNode();
      actions.setActiveNode(nodeId);
    }
  }, [id]);

  return currentDocument ? (
    <>
      <Actions />
      <InteractiveSVG>
        {Object.values(currentDocument.nodes).map(
          ({
            id: nodeId,
            parentId,
            dimensions,
            position,
            content,
            depth,
            edges
          }) => (
            <Node
              key={nodeId}
              id={nodeId}
              parentId={parentId}
              position={position}
              dimensions={dimensions}
              content={content}
              depth={depth}
              edges={edges}
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
