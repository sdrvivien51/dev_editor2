import { useState, useCallback } from 'react';
import { ReactFlow, Controls, Panel, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import './MindMap.css';

const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Mind Map' },
    position: { x: 250, y: 250 },
  },
];

function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const addNode = useCallback(() => {
    const newNode = {
      id: `${nodes.length + 1}`,
      data: { label: `Node ${nodes.length + 1}` },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-left" className="flex gap-2">
          <Button onClick={addNode} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Node
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default MindMap;
