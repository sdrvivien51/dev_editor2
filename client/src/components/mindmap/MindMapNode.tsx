import { useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import useStore from './store';
import { MindMapData } from './types';

export default function MindMapNode({ id, data }: NodeProps<MindMapData>) {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(id, evt.target.value);
  }, [id, updateNodeLabel]);

  return (
    <div className="mindmap-node">
      <Handle
        type="target"
        position={Position.Top}
        className="target-handle"
      />
      <div className="node-content">
        <input
          value={data?.label || ''}
          onChange={onChange}
          className="nodrag node-input"
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="source-handle"
      />
    </div>
  );
}
