import { BaseEdge, getStraightPath, EdgeProps } from '@xyflow/react';

function FloatingEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  style = {},
  selected,
}: EdgeProps) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: selected ? 4 : 3,
        stroke: selected ? '#ff0072' : '#784be8',
      }}
    />
  );
}

export default FloatingEdge;
