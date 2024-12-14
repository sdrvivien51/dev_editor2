import React, { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeData } from './types';

function MindMapNode({ data, id }: NodeProps<NodeData>) {
  const [label, setLabel] = useState(data.label);

  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(evt.target.value);
  }, []);

  return (
    <div className="mindmap-node nodrag">
      <Handle
        type="target"
        position={Position.Top}
        className="react-flow__handle handle-top"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="react-flow__handle handle-left"
      />
      <div className="node-content">
        <input
          type="text"
          value={label}
          onChange={onChange}
          className="nodrag node-input"
          placeholder="Enter text..."
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="react-flow__handle handle-right"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="react-flow__handle handle-bottom"
      />
    </div>
  );
}

export default memo(MindMapNode);
