import { Node, Edge } from '@xyflow/react';

export interface NodeData {
  label: string;
}

export interface MindMapNode extends Node<NodeData> {
  type?: 'mindmap';
}

export interface MindMapEdge extends Edge {
  type?: 'mindmap';
}

export interface MindMapProps {
  onNodesChange?: (changes: any[]) => void;
  onEdgesChange?: (changes: any[]) => void;
  onConnect?: (params: any) => void;
}
