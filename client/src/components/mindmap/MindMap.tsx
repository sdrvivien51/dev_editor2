import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  ReactFlowProvider,
  useStoreApi,
  useReactFlow,
  Connection,
  MarkerType,
} from '@xyflow/react';
import { MindMapNode, MindMapEdge } from './types';
import MindMapNodeComponent from './MindMapNode';
import '@xyflow/react/dist/style.css';
import './MindMap.css';

const MIN_DISTANCE = 150;

const nodeTypes = {
  mindmap: MindMapNodeComponent,
};

const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'mindmap',
    data: { label: 'Main Topic' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: MindMapEdge[] = [];

const Flow = () => {
  const store = useStoreApi();
  const { getInternalNode } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'mindmap',
        markerEnd: { type: MarkerType.Arrow },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const getClosestEdge = useCallback((node: MindMapNode) => {
    const { nodeLookup } = store.getState();
    const internalNode = getInternalNode(node.id);

    if (!internalNode) return null;

    const closestNode = Array.from(nodeLookup.values()).reduce(
      (res: { distance: number; node: any }, n) => {
        if (n.id !== internalNode.id) {
          const dx =
            n.internals.positionAbsolute.x - internalNode.internals.positionAbsolute.x;
          const dy =
            n.internals.positionAbsolute.y - internalNode.internals.positionAbsolute.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            res.node = n;
          }
        }
        return res;
      },
      {
        distance: Number.MAX_VALUE,
        node: null,
      }
    );

    if (!closestNode.node) return null;

    const closeNodeIsSource =
      closestNode.node.internals.positionAbsolute.x < internalNode.internals.positionAbsolute.x;

    return {
      id: closeNodeIsSource
        ? `${closestNode.node.id}-${node.id}`
        : `${node.id}-${closestNode.node.id}`,
      source: closeNodeIsSource ? closestNode.node.id : node.id,
      target: closeNodeIsSource ? node.id : closestNode.node.id,
      type: 'mindmap',
      markerEnd: { type: MarkerType.Arrow },
    };
  }, []);

  const onNodeDrag = useCallback(
    (_: React.MouseEvent, node: MindMapNode) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) => ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          closeEdge.className = 'temp';
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: MindMapNode) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) => ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      style={{ background: '#F7F9FB' }}
    >
      <Background />
    </ReactFlow>
  );
};

export default function MindMap() {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '500px' }}>
        <Flow />
      </div>
    </ReactFlowProvider>
  );
}
