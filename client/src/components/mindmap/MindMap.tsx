import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Connection,
  Edge,
  MarkerType,
} from '@xyflow/react';
import CustomNode from './CustomNode';
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import './MindMap.css';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Root Node' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: Edge[] = [];

function Flow() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes]);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge({
          ...params,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#784be8' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#784be8',
          },
        }, eds)
      );
    },
    [setEdges]
  );

  const addNewNode = useCallback(() => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      data: { label: `Node ${nodes.length + 1}` },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        selectionKeyCode="Shift"
        multiSelectionKeyCode="Control"
      >
        <Background />
        <Controls />
        <div style={{ position: 'absolute', right: 10, top: 10 }}>
          <button
            onClick={addNewNode}
            className="nodrag"
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              background: '#784be8',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Add Node
          </button>
        </div>
      </ReactFlow>
    </div>
  );
}

export default function MindMapWrapper() {
  return (
    <div className="mindmap-wrapper">
      <Flow />
    </div>
  );
}
