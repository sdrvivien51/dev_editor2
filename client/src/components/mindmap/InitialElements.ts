
import { Position } from '@xyflow/react';

export const initialNodes = [
  {
    id: '1',
    type: 'mindmap',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    style: {
      width: 150,
      height: 40,
    },
  },
  {
    id: '2',
    type: 'mindmap',
    data: { label: 'Node 2' },
    position: { x: 250, y: -100 },
    style: {
      width: 150,
      height: 40,
    },
  },
  {
    id: '3',
    type: 'mindmap',
    data: { label: 'Node 3' },
    position: { x: 250, y: 100 },
    style: {
      width: 150,
      height: 40,
    },
  }
];

export const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'floating',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'floating',
  }
];
