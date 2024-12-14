import { useCallback } from 'react';
import { BaseEdge, EdgeProps, getSimpleBezierPath } from '@xyflow/react';

export default function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = useCallback((evt: React.MouseEvent<SVGGElement, MouseEvent>, id: string) => {
    evt.stopPropagation();
    // Handle edge click if needed
  }, []);

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: '#b1b1b7',
      }}
      interactionWidth={20}
      onClick={(event) => onEdgeClick(event, id)}
    />
  );
}
