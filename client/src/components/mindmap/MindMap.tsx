import { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  useReactFlow,
  ConnectionMode,
  Node,
} from '@xyflow/react';
import { nanoid } from 'nanoid';

import FloatingEdge from './FloatingEdge';
import MindMapNode from './MindMapNode';
import { initialNodes, initialEdges, MindMapNode as MindMapNodeType } from './InitialElements';
import { getClosestEdge } from './utils';

import '@xyflow/react/dist/style.css';
import './MindMap.css';

const MIN_DISTANCE = 200;
const nodeTypes = { mindmap: MindMapNode };
const edgeTypes = { floating: FloatingEdge };

export default function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();
  
  const onConnect = useCallback(
    (params: Connection) => {
      const edge: Edge = {
        ...params,
        type: 'floating',
        id: `edge-${params.source}-${params.target}`,
        style: { stroke: '#b1b1b7' }
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onNodeDrag = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const closeEdge = getClosestEdge(node, nodes, MIN_DISTANCE);
      
      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');
        
        if (closeEdge && !nextEdges.find(
          (ne) => ne.source === closeEdge.source && ne.target === closeEdge.target
        )) {
          nextEdges.push({
            ...closeEdge,
            className: 'temp',
            style: { stroke: '#b1b1b7', strokeDasharray: '5,5' }
          });
        }
        
        return nextEdges;
      });
    },
    [nodes, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const closeEdge = getClosestEdge(node, nodes, MIN_DISTANCE);
      
      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');
        
        if (closeEdge && !nextEdges.find(
          (ne) => ne.source === closeEdge.source && ne.target === closeEdge.target
        )) {
          nextEdges.push({
            ...closeEdge,
            style: { stroke: '#b1b1b7' }
          });
        }
        
        return nextEdges;
      });
    },
    [nodes, setEdges]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent) => {
      const targetIsPane = (event.target as Element)?.classList.contains('react-flow__pane');
      if (!targetIsPane) return;

      const id = nanoid();
      const { clientX, clientY } = event;
      const position = project({ x: clientX, y: clientY });

      const newNode: MindMapNodeType = {
        id,
        type: 'mindmap',
        position,
        data: { label: '🔵' }
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [project, setNodes]
  );

  return (
    <div className="mindmap-container" style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
        minZoom={0.2}
        maxZoom={4}
        fitView
        className="mindmap-flow"
      >
        <Background color="#b1b1b7" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
