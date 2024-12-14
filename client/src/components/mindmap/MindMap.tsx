import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  MarkerType,
} from '@xyflow/react';
import { initialNodes, initialEdges } from './InitialElements';
import MindMapNode from './MindMapNode';
import FloatingEdge from './FloatingEdge';
import { NodeData, MindMapNode as MindMapNodeType } from './types';
import './MindMap.css';

const MIN_DISTANCE = 150;

const nodeTypes = {
  mindmap: MindMapNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

let id = 1;
const getId = () => `${id++}`;

const Flow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!event.target || !reactFlowWrapper.current) return;

      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane && reactFlowInstance) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: (event as MouseEvent).clientX - left - 75,
          y: (event as MouseEvent).clientY - top - 25,
        });

        const newNode: Node<NodeData> = {
          id: getId(),
          type: 'mindmap',
          position,
          data: { label: `Node ${id}` },
        };

        setNodes((nds) => nds.concat(newNode));
        
        if (connectingNodeId.current) {
          const newEdge: Edge = {
            id: `e${connectingNodeId.current}-${newNode.id}`,
            source: connectingNodeId.current,
            target: newNode.id,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
          };
          setEdges((eds) => eds.concat(newEdge));
        }
      }
    },
    [reactFlowInstance]
  );

  const getClosestEdge = useCallback(
    (node: Node) => {
      return nodes
        .filter((n) => n.id !== node.id)
        .reduce<{ distance: number; node: Node | null }>(
          (closest, curr) => {
            const distance = Math.sqrt(
              Math.pow(node.position.x - curr.position.x, 2) +
              Math.pow(node.position.y - curr.position.y, 2)
            );

            if (distance < closest.distance && distance < MIN_DISTANCE) {
              return { distance, node: curr };
            }
            return closest;
          },
          { distance: Infinity, node: null }
        );
    },
    [nodes]
  );

  const onNodeDrag = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const { node: closestNode } = getClosestEdge(node);

      if (closestNode) {
        const edgeId = `temp-${node.id}-${closestNode.id}`;
        const existingEdge = edges.find(
          (e) =>
            (e.source === node.id && e.target === closestNode.id) ||
            (e.source === closestNode.id && e.target === node.id)
        );

        if (!existingEdge) {
          const tempEdge: Edge = {
            id: edgeId,
            source: node.id,
            target: closestNode.id,
            type: 'floating',
            className: 'temp-edge',
            markerEnd: { type: MarkerType.Arrow },
          };

          setEdges((eds) => [...eds.filter((e) => !e.className?.includes('temp')), tempEdge]);
        }
      } else {
        setEdges((eds) => eds.filter((e) => !e.className?.includes('temp')));
      }
    },
    [getClosestEdge, edges, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const { node: closestNode } = getClosestEdge(node);

      setEdges((eds) => {
        const remainingEdges = eds.filter((e) => !e.className?.includes('temp'));
        
        if (closestNode) {
          const newEdge: Edge = {
            id: `${node.id}-${closestNode.id}`,
            source: node.id,
            target: closestNode.id,
            type: 'floating',
            markerEnd: { type: MarkerType.Arrow },
          };
          return [...remainingEdges, newEdge];
        }
        
        return remainingEdges;
      });
    },
    [getClosestEdge]
  );

  return (
    <div className="mindmap-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        style={{ background: '#F7F9FB' }}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

const MindMap = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Flow />
    </div>
  );
};

export default MindMap;
