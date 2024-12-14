import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  useReactFlow,
  ReactFlowProvider,
  NodeMouseHandler,
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

const connectionLineStyle = { stroke: '#784be8', strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'default' };

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(useShallow(selector));
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const targetIsPane = (event.target as Element)?.classList?.contains('react-flow__pane');

      if (targetIsPane && connectingNodeId.current && event instanceof MouseEvent) {
        const parentNode = nodes.find(node => node.id === connectingNodeId.current);
        if (!parentNode) return;

        const { clientX, clientY } = event;
        const position = screenToFlowPosition({ x: clientX, y: clientY });
        
        addChildNode(parentNode, position);
      }
      connectingNodeId.current = null;
    },
    [addChildNode, nodes, screenToFlowPosition]
  );

  const onNodeClick: NodeMouseHandler = useCallback((event: React.MouseEvent, node: Node) => {
    const isDeleteButton = (event.target as Element).closest('.delete-button');
    if (isDeleteButton) {
      const updatedNodes = nodes.filter((n) => n.id !== node.id);
      const updatedEdges = edges.filter(
        (e) => e.source !== node.id && e.target !== node.id
      );
      useStore.setState({ nodes: updatedNodes, edges: updatedEdges });
    }
  }, [nodes, edges]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.Straight}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

const MindMapWrapper = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

export default MindMapWrapper;