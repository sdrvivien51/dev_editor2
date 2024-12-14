import { ReactFlow, Controls, Panel, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Mind Map' },
    position: { x: 0, y: 0 },
  },
];

function MindMap() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={[]}
        fitView
      >
        <Background />
        <Controls showInteractive={false} />
        <Panel position="top-left">React Flow Mind Map</Panel>
      </ReactFlow>
    </div>
  );
}

export default MindMap;