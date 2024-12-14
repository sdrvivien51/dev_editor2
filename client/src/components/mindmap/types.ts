import { Edge, Node } from '@xyflow/react';

export interface MindMapData {
  label: string;
  width?: number;
  height?: number;
  onChange?: (value: string) => void;
  [key: string]: unknown;
}

export type MindMapNode = Node<MindMapData>;
export type MindMapEdge = Edge;

export interface RFState {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  addChildNode: (parentNode: MindMapNode, position: { x: number; y: number }) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  onConnect?: (connection: any) => void;
}
