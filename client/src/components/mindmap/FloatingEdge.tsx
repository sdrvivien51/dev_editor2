import { getSmoothStepPath, useInternalNode, EdgeProps } from '@xyflow/react';
import { getEdgeParams } from './utils';

function FloatingEdge({ id, source, target, markerEnd, style }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetX: tx,
    targetY: ty,
    targetPosition: targetPos,
    borderRadius: 12,
    offset: 16,
  });

  return (
    <g className="react-flow__edge-group">
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 3,
          stroke: style?.stroke || '#784be8',
          opacity: 1,
          pointerEvents: 'all',
          filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.2))',
        }}
      />
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        className="react-flow__edge-interaction"
      />
    </g>
  );
}

export default FloatingEdge;
