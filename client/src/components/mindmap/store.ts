import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import {
  EdgeChange,
  NodeChange,
  XYPosition,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { RFState, MindMapNode, MindMapEdge } from './types';

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: 'root',
      type: 'mindmap',
      data: { label: 'Root Node' },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  addChildNode: (parentNode: MindMapNode, position: XYPosition) => {
    const newNode: MindMapNode = {
      id: nanoid(),
      type: 'mindmap',
      data: { label: 'New Node' },
      position,
    };

    const newEdge: MindMapEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      }),
    });
  },
}));

export default useStore;
