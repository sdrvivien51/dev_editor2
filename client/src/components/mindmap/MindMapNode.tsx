import React, { useRef, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import useStore from './store';
import { MindMapData } from './types';

function MindMapNode({ id, data }: NodeProps<MindMapData>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(id, evt.target.value);
  }, [id, updateNodeLabel]);

  const handleStyle = {
    width: '12px',
    height: '12px',
    background: '#784be8',
    border: '2px solid white',
    boxShadow: '0 0 6px 2px rgba(120, 75, 232, 0.3)',
  };

  return (
    <div className="mindmap-node">
      <Handle
        type="target"
        position={Position.Top}
        style={handleStyle}
        isConnectable={true}
      />
      <div className="node-content">
        <input
          ref={inputRef}
          value={data?.label || ''}
          onChange={onChange}
          className="nodrag node-input"
          placeholder="Enter text..."
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={handleStyle}
        isConnectable={true}
      />
    </div>
  );
}

export default MindMapNode;
