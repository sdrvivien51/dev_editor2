import React, { useRef, useCallback } from 'react';
import { Handle, Position, NodeProps, useConnection } from '@xyflow/react';
import useStore from './store';
import { MindMapData } from './types';

function MindMapNode({ id, data }: NodeProps<MindMapData>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const connection = useConnection();
  
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(id, evt.target.value || '');
  }, [id, updateNodeLabel]);

  const isTarget = connection?.inProgress && connection?.fromNode?.id !== id;
  const isSource = connection?.inProgress && connection?.fromNode?.id === id;

  const handleStyle = {
    width: '12px',
    height: '12px',
    background: '#784be8',
    border: '2px solid white',
    borderRadius: '50%',
    opacity: 1,
    zIndex: 1000,
  };

  return (
    <div className="mindmap-node">
      <Handle
        type="target"
        position={Position.Left}
        className={`handle-left ${isTarget ? 'connecting' : ''}`}
        style={{ ...handleStyle, backgroundColor: isTarget ? '#ff0072' : '#784be8' }}
        isConnectableStart={false}
      />
      <Handle
        type="target"
        position={Position.Top}
        className={`handle-top ${isTarget ? 'connecting' : ''}`}
        style={{ ...handleStyle, backgroundColor: isTarget ? '#ff0072' : '#784be8' }}
        isConnectableStart={false}
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
        className={`handle-right ${isSource ? 'connecting' : ''}`}
        style={{ ...handleStyle, backgroundColor: isSource ? '#ff0072' : '#784be8' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`handle-bottom ${isSource ? 'connecting' : ''}`}
        style={{ ...handleStyle, backgroundColor: isSource ? '#ff0072' : '#784be8' }}
      />
    </div>
  );
}

export default MindMapNode;
