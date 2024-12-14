import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import {
  EdgeChange,
  NodeChange,
  XYPosition,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { RFState, MindMapNode, MindMapData } from './types';

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: 'root',
      type: 'mindmap',
      data: { label: 'New Mind Map' },
      position: { x: 0, y: 0 },
      style: { backgroundColor: 'white', padding: '10px', borderRadius: '5px' }
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
  addChildNode: (parentNode: Node<MindMapNodeData>, position: XYPosition) => {
    const newNode = {
      id: nanoid(),
      type: 'mindmap',
      data: { label: 'New Node' },
      position,
      style: { backgroundColor: 'white', padding: '10px', borderRadius: '5px' }
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
      type: 'default',
      animated: false,
      style: { stroke: '#784be8', strokeWidth: 2 }
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
