interface NodeType {
  // private uuid
  _id: string;
  // human readable uuid
  id: string;
  parentId: string;
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    height: number;
    width: number;
  };
  content: {
    type: string | null;
    text: string | null;
  };
  draggable: boolean;
  depth: number | undefined;
  edges: {
    // nodeId: edgeId
    [id: string]: string;
  };
}

interface NodesType {
  [id: string]: NodeType;
}

interface EdgeType {
  _id: string;
  id: string;
  parent: string | null;
  child: string | null;
  peers: { [id: string]: boolean } | null;
}

interface EdgesType {
  [edgeId: string]: EdgeType;
}

export { NodeType, NodesType, EdgeType, EdgesType };
