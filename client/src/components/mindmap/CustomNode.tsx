import { Handle, Position, NodeProps } from '@xyflow/react';
import { MindMapData } from './types';

function CustomNode({ id, data, selected }: NodeProps<MindMapData>) {
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
    <div className={`mindmap-node ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={handleStyle}
        isConnectable={true}
      />
      <div className="node-content">
        <input
          value={data.label || ''}
          onChange={(evt) => data.onChange?.(evt.target.value)}
          className="nodrag node-input"
          placeholder="Enter text..."
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={handleStyle}
        isConnectable={true}
      />
    </div>
  );
}

export default CustomNode;
