import { Node, Edge, Position } from '@xyflow/react';

export interface MindMapData {
  label: string;
}

// Extend the base Node type from ReactFlow
export type MindMapNode = Node<MindMapData>;

const nodeDefaults = {
  type: 'mindmap' as const,
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  style: {
    borderRadius: '100%',
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ddd',
  },
};

export const initialNodes: MindMapNode[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: '⬛️' },
    ...nodeDefaults,
  },
  {
    id: '2',
    position: { x: 250, y: -100 },
    data: { label: '🟩' },
    ...nodeDefaults,
  },
  {
    id: '3',
    position: { x: 250, y: 100 },
    data: { label: '🟧' },
    ...nodeDefaults,
  },
  {
    id: '4',
    position: { x: 500, y: 0 },
    data: { label: '🟦' },
    ...nodeDefaults,
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'floating',
    style: { stroke: '#b1b1b7' },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'floating',
    style: { stroke: '#b1b1b7' },
  },
];
