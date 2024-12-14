import { BaseEdge, getSmoothStepPath, EdgeProps, useReactFlow } from '@xyflow/react';
import { getEdgeParams } from './utils';

function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style = {},
  data,
  selected,
}: EdgeProps) {
  const { getNode } = useReactFlow();
  const sourceNode = getNode(source);
  const targetNode = getNode(target);

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
    borderRadius: 10,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 4 : 3,
          stroke: selected ? '#ff0072' : '#784be8',
          opacity: 1,
          pointerEvents: 'all',
          visibility: 'visible',
        }}
      />
      {data?.label && (
        <text
          x={sx + (tx - sx) * 0.5}
          y={sy + (ty - sy) * 0.5}
          textAnchor="middle"
          alignmentBaseline="middle"
          style={{
            fill: '#888',
            fontSize: '12px',
            pointerEvents: 'none',
          }}
        >
          {data.label}
        </text>
      )}
    </>
  );
}

export default FloatingEdge;
