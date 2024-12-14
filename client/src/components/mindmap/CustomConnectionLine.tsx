import React from 'react';
import { getStraightPath } from '@xyflow/react';

function CustomConnectionLine({ fromX, fromY, toX, toY }: any) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  const defaultStyle = {
    stroke: '#784be8',
    strokeWidth: 3,
    strokeDasharray: '5,5',
    fill: 'none',
  };

  return (
    <g>
      <path style={defaultStyle} d={edgePath} />
    </g>
  );
}

export default CustomConnectionLine;
