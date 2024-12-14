import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import useStore from './store';
import { MindMapData } from './types';

const MindMapNode = ({ id, data }: NodeProps<MindMapData>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);

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
        className="handle target-handle"
      />
      <input
        ref={inputRef}
        value={data.label}
        onChange={(evt) => updateNodeLabel(id, evt.target.value)}
        className="node-input"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="handle source-handle"
      />
    </div>
  );
};

export default MindMapNode;