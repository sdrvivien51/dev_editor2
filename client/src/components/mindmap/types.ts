import { Node, Edge, Connection } from '@xyflow/react';

export interface NodeData {
  label: string;
}

export type CustomNode = Node<NodeData>;
export type CustomEdge = Edge;

export interface MindMapState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
}
