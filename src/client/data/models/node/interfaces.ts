interface NodeType {
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
}

export { NodeType };
