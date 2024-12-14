import React, { useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import useStore from './store';
import { MindMapData } from './types';

function MindMapNode({ id, data }: NodeProps<MindMapData>) {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(id, evt.target.value || '');
  }, [id, updateNodeLabel]);

  return (
    <div className="mindmap-node">
      <Handle 
        type="target"
        position={Position.Top}
        className="handle"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="handle"
      />
      <div className="node-content">
        <input
          value={data?.label || ''}
          onChange={onChange}
          className="nodrag node-input"
          placeholder="Enter text..."
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="handle"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="handle"
      />
    </div>
  );
}

export default MindMapNode;
