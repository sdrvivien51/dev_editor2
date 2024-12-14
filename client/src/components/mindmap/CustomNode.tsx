
import React from 'react';
import { Handle, Position } from '@xyflow/react';

function CustomNode() {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <div>Custom Node</div>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default CustomNode;
