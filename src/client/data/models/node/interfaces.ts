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
  children: Array<string>;
}

interface NodesType {
  [key: string]: NodeType;
}

export { NodeType, NodesType };
