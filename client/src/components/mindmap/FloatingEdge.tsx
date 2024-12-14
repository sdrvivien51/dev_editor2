import { useCallback } from 'react';
import { useStore, getBezierPath, BaseEdge } from '@xyflow/react';
import { getEdgeParams } from './utils';

interface FloatingEdgeProps {
  id: string;
  source: string;
  target: string;
  markerEnd?: string;
  style?: React.CSSProperties;
}

const FloatingEdge = ({ id, source, target, markerEnd, style }: FloatingEdgeProps) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodes.find((n) => n.id === source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodes.find((n) => n.id === target), [target])
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: '#222',
      }}
    />
  );
};

export default FloatingEdge;
