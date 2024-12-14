import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MindMapData } from './InitialElements';

const handleStyle = { 
  width: 8, 
  height: 8, 
  background: '#b1b1b7',
  border: '2px solid white',
  borderRadius: '50%'
};

function MindMapNode({ data }: NodeProps<MindMapData>) {
  return (
    <div className="mindmap-node">
      <Handle
        style={handleStyle}
        position={Position.Right}
        type="source"
      />
      <Handle
        style={handleStyle}
        position={Position.Left}
        type="target"
      />
      <div className="mindmap-node-content">
        {data.label}
      </div>
    </div>
  );
}

export default memo(MindMapNode);
