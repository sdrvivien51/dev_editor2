import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionLineType,
  Connection,
  Node,
  useReactFlow,
  ReactFlowProvider,
  NodeMouseHandler,
  OnConnectStart,
  OnConnectEnd,
  XYPosition
} from '@xyflow/react';
import { useShallow } from 'zustand/shallow';
import { Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid/non-secure';

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

const connectionLineStyle = { stroke: '#784be8', strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'default' };

function Flow() {
  const store = useStore();
  const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = store;
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnectStart = useCallback<OnConnectStart>((_, { nodeId }) => {
    if (nodeId) {
      connectingNodeId.current = nodeId;
    }
  }, []);

  const getChildNodePosition = useCallback(
    (event: MouseEvent | TouchEvent, parentNode?: Node) => {
      if (!parentNode?.position) {
        return;
      }

      const isTouchEvent = 'touches' in event;
      const x = isTouchEvent ? event.touches[0].clientX : event.clientX;
      const y = isTouchEvent ? event.touches[0].clientY : event.clientY;

      // Convert screen coordinates to flow coordinates
      const panePosition = screenToFlowPosition({
        x,
        y,
      });

      return {
        x: panePosition.x - parentNode.position.x,
        y: panePosition.y - parentNode.position.y,
      };
    },
    [screenToFlowPosition]
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!event || !(event instanceof MouseEvent)) return;

      const targetIsPane = (event.target as Element)?.classList?.contains(
        'react-flow__pane'
      );

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodes.find(node => node.id === connectingNodeId.current);

        if (!parentNode) return;

        // Use client coordinates for position calculation
        const position = getChildNodePosition(event, parentNode);

        if (position) {
          // Add the new node with correct position relative to parent
          addChildNode(parentNode, {
            x: position.x,
            y: position.y
          });
        }
      }
      // Reset the connecting node id
      connectingNodeId.current = null;
    },
    [getChildNodePosition, addChildNode, nodes]
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

  const onConnect = useCallback((params: Connection) => {
    useStore.setState({
      edges: [...edges, { ...params, id: nanoid(), type: 'default' }]
    });
  }, [edges]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onConnect={onConnect}
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

const MindMapWrapper = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}

export default MindMapWrapper;
