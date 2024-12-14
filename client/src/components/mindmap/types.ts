import { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';

export interface MindMapData {
  label: string;
  [key: string]: unknown;
}

export type MindMapNode = Node<MindMapData>;
export type MindMapEdge = Edge;

export interface RFState {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addChildNode: (parentNode: Node, position: { x: number; y: number }) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
}
