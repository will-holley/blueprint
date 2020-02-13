import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { hri } from "human-readable-ids";
// Data
import { useQuery, gql, useMutation } from "@apollo/client";
import {
  DocumentQuery,
  CREATE_NODE_MUTATION,
  CREATE_BASE_NODE_MUTATION
} from "./gql";
// Components
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";
import Node from "./Node";
import Edge from "./Edge";
import InteractiveSVG from "./InteractiveSVG";
import Actions from "./Actions";
// Rendering Engines
import dagger from "./layouts/dagre";
import FDS from "./layouts/fds";

const Document = () => {
  const { humanId } = useParams();
  const { loading, error, data, refetch } = useQuery(DocumentQuery, {
    variables: { id: humanId }
  });
  const document = data ? data.documentByHumanId : null;

  // ====================
  // == Document State ==
  // ====================
  const [zoom, setZoom] = useState(1);
  const [activeNodeId, setActiveNodeId] = useState(null);

  // ======================
  // == Document Actions ==
  // ======================
  const createNodeConfig = {
    // Reload the view
    onCompleted: async ({ createNode: { _node } }) => {
      await refetch();
      setActiveNodeId(_node.id);
    }
  };
  const [createBaseNode] = useMutation(
    CREATE_BASE_NODE_MUTATION,
    createNodeConfig
  );
  const [createNode] = useMutation(CREATE_NODE_MUTATION, createNodeConfig);
  const addNode = parentNodeId => {
    if (parentNodeId) {
      createNode({
        variables: {
          parentNodeId,
          documentId: data.documentByHumanId.id
        }
      });
    } else {
      createBaseNode({
        variables: {
          documentId: data.documentByHumanId.id
        }
      });
    }
  };

  // ============
  // == Render ==
  // ============

  /**
   * Node positions can only be calculated once they have been rendered into view.
   * In practice, this means that initially nodes will appear in a lumpy cluster, and
   * only upon the 1st re-render do they take their intended tree structure.  As such,
   * we wait to actually show the nodes until they're able to be properly rendered.  At
   * this point, we also set an active node.  This all assumes there are nodes present
   * in the document.
   */
  const [nodesRendered, setNodesRendered] = useState(false);
  useEffect(() => {
    if (loading || nodesRendered) return;
    // There are nodes to render into view.
    if (document && document._nodes.length > 0) {
      // Sets a random base node as the active node
      const baseNodes = document._nodes.filter(
        node => node.edgesByNodeB.nodes.length === 0
      );
      const node = baseNodes[0];
      const el = window.document.getElementById(node.id);
      if (Boolean(el)) {
        setActiveNodeId(node.id);
        setNodesRendered(true);
      }
    } else {
      setNodesRendered(true);
    }
  });

  if (!loading) {
    // Handle bad ids + errors + expired JWT
    if (!document) return <Redirect to="/" />;
    const {
      id,
      name,
      createdByUser,
      _nodes,
      edges,
      private: _private
    } = document;
    const editable = Boolean(createdByUser);
    const displayName = name !== null ? name : humanId;

    const result = dagger(_nodes, edges);
    const positionedNodes = Object.values(result[0]);
    const positionedEdges = Object.values(result[1]);
    //const [positionedNodes, positionedEdges] = FDS(_nodes, edges);

    return (
      <>
        <Helmet>
          <title>{displayName}</title>
        </Helmet>
        <Actions
          documentId={id}
          displayName={displayName}
          isPrivate={_private}
          editable={editable}
          handleZoomIn={event => setZoom(zoom + 0.1)}
          handleZoomOut={event => setZoom(zoom - 0.1)}
          handleResetZoom={event => setZoom(1)}
          currentZoom={zoom}
          activeNodeId={activeNodeId}
          setActiveNodeId={setActiveNodeId}
          addNode={addNode}
          edges={positionedEdges}
          refetch={refetch}
        />
        <InteractiveSVG
          opacity={nodesRendered ? 1 : 0}
          zoom={zoom}
          activeNodeId={activeNodeId}
        >
          {/**
           * It is necessary to render the edges first and then the nodes as SVG layer order
           * is a stack i.e. first-rendered, bottom-most displayed.
           */}
          <g>
            {positionedEdges.map(({ id, position }) => (
              <Edge key={id} position={position} id={id} />
            ))}
          </g>
          <g>
            {positionedNodes.map(
              ({ id: nodeId, humanId, position, contentType, content }) => (
                <Node
                  key={nodeId}
                  humanId={humanId}
                  id={nodeId}
                  position={position}
                  contentType={contentType}
                  content={content}
                  editable={editable}
                  isActive={activeNodeId === nodeId}
                  setAsActive={() => setActiveNodeId(nodeId)}
                  handleClickOutside={() => setActiveNodeId(null)}
                  addChildNode={() => addNode(nodeId)}
                />
              )
            )}
          </g>
        </InteractiveSVG>
      </>
    );
  } else {
    return null;
  }
};

export default Document;
