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

  return (
    <div className="mindmap-node nodrag">
      <Handle
        type="target"
        position={Position.Top}
        className="target-handle nodrag"
        isConnectable={true}
      />
      <div className="node-content">
        <input
          ref={inputRef}
          value={data.label}
          onChange={onChange}
          className="nodrag node-input"
          placeholder="Enter text..."
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="source-handle nodrag"
        isConnectable={true}
      />
    </div>
  );
}

export default MindMapNode;
