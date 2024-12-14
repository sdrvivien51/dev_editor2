import React, { useRef, useCallback } from 'react';
import { Handle, Position, NodeProps, useConnection } from '@xyflow/react';
import useStore from './store';
import { MindMapData } from './types';

function MindMapNode({ id, data }: NodeProps<MindMapData>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const connection = useConnection();
  
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(id, evt.target.value);
  }, [id, updateNodeLabel]);

  const isTarget = connection?.inProgress && connection.fromNode?.id !== id;

  return (
    <div className="mindmap-node">
      {(!connection?.inProgress || isTarget) && (
        <Handle
          type="target"
          position={Position.Left}
          className="customHandle"
          isConnectable={true}
        />
      )}
      <div className="node-content">
        <input
          ref={inputRef}
          value={data.label || ''}
          onChange={onChange}
          className="nodrag node-input"
          placeholder="Enter text..."
        />
      </div>
      {!connection?.inProgress && (
        <Handle
          type="source"
          position={Position.Right}
          className="customHandle"
          isConnectable={true}
        />
      )}
    </div>
  );
}

export default MindMapNode;
