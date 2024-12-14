
import React from 'react';
import { getStraightPath } from '@xyflow/react';

function CustomConnectionLine({ fromX, fromY, toX, toY }) {
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
      <circle cx={toX} cy={toY} fill="#784be8" r={3} stroke="#784be8" strokeWidth={1.5} />
    </g>
  );
}

export default CustomConnectionLine;
