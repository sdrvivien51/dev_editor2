import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useReactFlow,
  Connection,
  OnConnectStart,
  OnConnectEnd,
} from '@xyflow/react';
import { useShallow } from 'zustand/shallow';
import MindMapNode from './MindMapNode';
import useStore from './store';
import { RFState, MindMapNode as MindMapNodeType } from './types';
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

function Flow() {
  const store = useStore(useShallow(selector));
  const { screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const targetIsPane = (event.target as Element)?.classList.contains('react-flow__pane');

      if (targetIsPane && connectingNodeId.current && event instanceof MouseEvent) {
        const parentNode = store.nodes.find((node) => node.id === connectingNodeId.current);
        if (!parentNode) return;

        const { clientX, clientY } = event;
        const position = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });

        store.addChildNode(parentNode, position);
      }
    },
    [screenToFlowPosition, store]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const newEdge: Edge = {
          id: `${params.source}-${params.target}`,
          source: params.source,
          target: params.target,
        };
        useStore.setState((state) => ({
          edges: [...state.edges, newEdge],
        }));
      }
    },
    []
  );

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={store.nodes}
        edges={store.edges}
        onNodesChange={store.onNodesChange}
        onEdgesChange={store.onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
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
    <Flow />
  );
}
