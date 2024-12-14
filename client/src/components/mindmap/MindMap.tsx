import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Connection,
  addEdge,
  useReactFlow,
  MarkerType,
  ReactFlowProvider
} from '@xyflow/react';
import { useShallow } from 'zustand/shallow';
import MindMapNode from './MindMapNode';
import FloatingEdge from './FloatingEdge';
import CustomConnectionLine from './CustomConnectionLine';
import useStore from './store';
import { RFState } from './types';
import '@xyflow/react/dist/style.css';
import './MindMap.css';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
});

const nodeTypes = {
  mindmap: MindMapNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const connectionLineStyle = {
  stroke: '#b1b1b7',
  strokeWidth: 2,
};

const defaultEdgeOptions = {
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#b1b1b7',
  },
  style: { stroke: '#b1b1b7', strokeWidth: 2 },
};

let id = 1;
const getId = () => `${id++}`;

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(useShallow(selector));
  const { screenToFlowPosition } = useReactFlow();
  
  const onConnect = useCallback((params: Connection) => {
    useStore.setState((state) => ({
      edges: addEdge(params, state.edges),
    }));
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');

      if (targetIsPane) {
        const { clientX, clientY } = event instanceof MouseEvent ? event : event.touches[0];
        const position = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });

        const newNode = {
          id: getId(),
          type: 'mindmap',
          position,
          data: { label: `Node ${id}` },
        };

        useStore.setState((state) => ({
          nodes: [...state.nodes, newNode],
        }));
      }
    },
    [screenToFlowPosition]
  );

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={CustomConnectionLine}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default function MindMapWrapper() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}