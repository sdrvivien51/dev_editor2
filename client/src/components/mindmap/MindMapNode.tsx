
import React, { memo, useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from './types';

const MindMapNode = ({ data, isConnectable }: CustomNodeProps) => {
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(evt.target.value);
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${label.length * 8}px`;
    }
  }, [label]);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    }, 1);
  }, []);

  return (
    <div className="mindmap-node nodrag">
      <div className="inputWrapper">
        <div className="dragHandle">
          <svg viewBox="0 0 24 24">
            <path
              fill="#333"
              stroke="#333"
              strokeWidth="1"
              d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={onChange}
          className="nodrag node-input"
          placeholder="Enter text..."
        />
      </div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="react-flow__handle"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ height: '100%', width: '100%', opacity: 0 }}
        isConnectable={isConnectable}
        className="react-flow__handle source"
      />
    </div>
  );
};

export default memo(MindMapNode);
