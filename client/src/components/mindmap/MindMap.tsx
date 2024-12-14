
import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  useStoreApi,
  useReactFlow,
  ReactFlowProvider,
  ConnectionLineType,
  OnConnectStart,
  OnConnectEnd
} from '@xyflow/react';
import { useShallow } from 'zustand/react-shallow';
import useStore from './store';
import MindMapNode from './MindMapNode';
import FloatingEdge from './FloatingEdge';
import CustomConnectionLine from './CustomConnectionLine';
import './MindMap.css';

const nodeTypes = {
  mindmap: MindMapNode
};

const edgeTypes = {
  floating: FloatingEdge
};

const defaultEdgeOptions = {
  type: 'floating',
  style: { strokeWidth: 2, stroke: 'black' }
};

function MindMap() {
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      addChildNode: state.addChildNode
    }))
  );
  
  const connectingNodeId = useRef<string | null>(null);
  const store = useStoreApi();
  const { screenToFlowPosition } = useReactFlow();

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeLookup } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeLookup.get(connectingNodeId.current);
        const { clientX, clientY } = event as MouseEvent;
        const position = screenToFlowPosition({ x: clientX, y: clientY });

        if (parentNode) {
          addChildNode(parentNode, position);
        }
      }
    },
    [addChildNode, screenToFlowPosition]
  );

  return (
    <ReactFlowProvider>
      <div className="mindmap-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineComponent={CustomConnectionLine}
          connectionLineType={ConnectionLineType.Straight}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default MindMap;
