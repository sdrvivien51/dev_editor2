import React, { useRef, useCallback } from 'react';
import { Handle, Position, NodeProps, useConnection } from '@xyflow/react';
import useStore from './store';
import { MindMapData } from './types';

function MindMapNode({ id, data }: NodeProps<MindMapData>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const connection = useConnection();
  
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    updateNodeLabel(id, value);
  }, [id, updateNodeLabel]);

  const isTarget = connection?.inProgress && connection?.fromNode?.id !== id;
  const isSource = connection?.inProgress && connection?.fromNode?.id === id;

  return (
    <div className="mindmap-node">
      <Handle
        type="target"
        position={Position.Left}
        className={`customHandle ${isTarget ? 'connecting' : ''}`}
        isConnectable={true}
        style={{
          opacity: 1,
          visibility: 'visible',
          backgroundColor: isTarget ? '#ff0072' : '#784be8',
          border: '2px solid white',
          zIndex: 1000
        }}
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
        position={Position.Right}
        className={`customHandle ${isSource ? 'connecting' : ''}`}
        isConnectable={true}
        style={{
          opacity: 1,
          visibility: 'visible',
          backgroundColor: isSource ? '#ff0072' : '#784be8',
          border: '2px solid white',
          zIndex: 1000
        }}
      />
    </div>
  );
}

export default MindMapNode;
