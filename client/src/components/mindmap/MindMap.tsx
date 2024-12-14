import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useReactFlow,
  ConnectionLineType,
  Panel,
  ReactFlowProvider,
  type Node,
  type Edge,
  type OnConnectStart,
  type OnConnectEnd,
} from '@xyflow/react';
import { useShallow } from 'zustand/shallow';
import { Trash2 } from 'lucide-react';

import useStore, { type RFState } from './store';
import '@xyflow/react/dist/style.css';
import './MindMap.css';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  updateNodeLabel: state.updateNodeLabel,
});

interface MindMapNodeProps {
  id: string;
  data: { label: string };
}

const MindMapNode = ({ id, data }: MindMapNodeProps) => {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);

  return (
    <div className="mindmap-node">
      <input
        value={data.label}
        onChange={(evt) => updateNodeLabel(id, evt.target.value)}
        className="node-input"
      />
      <button className="delete-button">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

const nodeTypes = {
  mindmap: MindMapNode,
};

const connectionLineStyle = { stroke: '#F6AD55', strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'default' };

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(
    useShallow(selector)
  );
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!(event instanceof MouseEvent)) return;

      const targetIsPane = (event.target as Element).classList.contains(
        'react-flow__pane'
      );

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodes.find(node => node.id === connectingNodeId.current);

        if (!parentNode) return;

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        addChildNode(parentNode, position);
      }
    },
    [screenToFlowPosition, addChildNode, nodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
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

// Wrap with ReactFlowProvider before exporting
export default function MindMap() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
