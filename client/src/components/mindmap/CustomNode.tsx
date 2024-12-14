import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeData } from './types';

const CustomNode = ({ data }: NodeProps<NodeData>) => {
  return (
    <div className="mindmap-node">
      <Handle
        type="target"
        position={Position.Top}
        className="react-flow__handle handle-top"
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="react-flow__handle handle-left"
        isConnectable={true}
      />
      <div className="node-content">
        <input
          type="text"
          defaultValue={data.label}
          className="nodrag node-input"
          placeholder="Enter text..."
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="react-flow__handle handle-right"
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="react-flow__handle handle-bottom"
        isConnectable={true}
      />
    </div>
  );
};

export default memo(CustomNode);
