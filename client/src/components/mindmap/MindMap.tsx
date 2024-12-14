import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  OnConnectStart,
  OnConnectEnd,
  useReactFlow,
  Panel
} from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import './MindMap.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'mindmap',
    data: { label: 'Mind Map' },
    position: { x: 250, y: 250 },
  },
];

interface MindMapNodeProps {
  id: string;
  data: { label: string };
}

const MindMapNode = ({ id, data }: MindMapNodeProps) => (
  <div className="mindmap-node">
    <div className="node-content">{data.label}</div>
    <button className="delete-button">
      <Trash2 className="h-4 w-4" />
    </button>
  </div>
);

const nodeTypes = {
  mindmap: MindMapNode,
};

function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

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
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: Node = {
          id: `node-${Date.now()}`,
          type: 'mindmap',
          position,
          data: { label: `Node ${nodes.length + 1}` },
        };

        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [
          ...eds,
          {
            id: `edge-${Date.now()}`,
            source: connectingNodeId.current!,
            target: newNode.id,
            type: 'default'
          }
        ]);
      }
    },
    [screenToFlowPosition, nodes.length, setNodes, setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setNodes((nds) => nds.filter((n) => n.id !== node.id));
    setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default MindMap;
