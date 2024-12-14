import { Node, Edge, NodeProps } from '@xyflow/react';

export interface NodeData {
  label: string;
}

export interface MindMapNodeData extends NodeData {
  id: string;
  type?: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
}

export type MindMapNode = Node<NodeData>;
export type MindMapEdge = Edge;

export interface MindMapProps {
  onNodesChange?: (changes: any[]) => void;
  onEdgesChange?: (changes: any[]) => void;
  onConnect?: (params: any) => void;
}

export interface CustomNodeProps extends NodeProps<NodeData> {
  data: NodeData;
  isConnectable: boolean;
}
