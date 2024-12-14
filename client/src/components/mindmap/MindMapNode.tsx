import React, { memo, useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from './types';

const MindMapNode = ({ data, isConnectable }: CustomNodeProps) => {
  const [label, setLabel] = useState(data.label);

  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(evt.target.value);
  }, []);

  return (
    <div className="mindmap-node nodrag">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="react-flow__handle handle-top"
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
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
        isConnectable={isConnectable}
        className="react-flow__handle handle-right"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="react-flow__handle handle-bottom"
      />
    </div>
  );
};

export default memo(MindMapNode);
