import { useRef, useEffect } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import useStore from './store';
import { MindMapData } from './types';

const MindMapNode = ({ id, data }: NodeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const label = (data as MindMapData)?.label || 'New Node';

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="mindmap-node">
      <Handle 
        type="target" 
        position={Position.Top}
        style={{ top: '-10px', background: '#784be8' }}
        className="handle target-handle"
      />
      <input
        ref={inputRef}
        value={label}
        onChange={(evt) => updateNodeLabel(id, evt.target.value)}
        className="node-input"
      />
      <Handle 
        type="source" 
        position={Position.Bottom}
        style={{ bottom: '-10px', background: '#784be8' }}
        className="handle source-handle"
      />
    </div>
  );
};

export default MindMapNode;