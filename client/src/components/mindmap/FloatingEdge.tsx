import { BaseEdge, EdgeProps, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import { getEdgeParams } from './utils';

function FloatingEdge({ 
  id, 
  source, 
  target, 
  markerEnd, 
  style = {},
  data,
  selected
}: EdgeProps) {
  const { getNode } = useReactFlow();
  const sourceNode = getNode(source);
  const targetNode = getNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
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
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 4 : 3,
          stroke: selected ? '#ff0072' : '#784be8',
          pointerEvents: 'all',
        }}
        className="react-flow__edge-floating"
      />
      {data?.label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          alignmentBaseline="middle"
          className="react-flow__edge-text"
        >
          {data.label}
        </text>
      )}
    </>
  );
}

export default FloatingEdge;
