import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import Xarrow, { Xwrapper } from 'react-xarrows';
import { Button } from "@/components/ui/button";
import { Plus, Link as LinkIcon } from 'lucide-react';

interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface Connection {
  start: string;
  end: string;
}

interface MermaidCanvasProps {
  onSave: (config: {
    type: 'flowchart' | 'sequence' | 'mindmap';
    code: string;
    caption: string;
  }) => void;
}

export function MermaidCanvas({ onSave }: MermaidCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', text: 'Main Idea', x: 300, y: 100 }
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectingMode, setConnectingMode] = useState(false);
  const [startNode, setStartNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = () => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      text: `Node ${nodes.length + 1}`,
      x: Math.random() * 200 + 200,
      y: Math.random() * 200 + 100
    };
    setNodes([...nodes, newNode]);
  };

  const handleNodeClick = (nodeId: string) => {
    if (connectingMode) {
      if (startNode === null) {
        setStartNode(nodeId);
      } else if (startNode !== nodeId) {
        setConnections([...connections, { start: startNode, end: nodeId }]);
        setStartNode(null);
        setConnectingMode(false);
      }
    }
  };

  const handleDrag = (nodeId: string, e: any, data: { x: number; y: number }) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, x: data.x, y: data.y } : node
    ));
  };

  const generateMermaidCode = () => {
    const code = `flowchart LR\n${connections.map(conn => 
      `  ${conn.start}[${nodes.find(n => n.id === conn.start)?.text}] --> ${conn.end}[${nodes.find(n => n.id === conn.end)?.text}]`
    ).join('\n')}`;
    
    onSave({
      type: 'flowchart',
      code,
      caption: 'Interactive Flowchart'
    });
  };

  return (
    <div className="relative border rounded-lg p-4" style={{ height: '500px', overflow: 'hidden' }}>
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addNode}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Node
        </Button>
        <Button
          variant={connectingMode ? "secondary" : "outline"}
          size="sm"
          onClick={() => {
            setConnectingMode(!connectingMode);
            setStartNode(null);
          }}
        >
          <LinkIcon className="h-4 w-4 mr-1" />
          Connect
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={generateMermaidCode}
        >
          Save
        </Button>
      </div>
      
      <div ref={canvasRef} className="relative w-full h-full">
        <Xwrapper>
          {nodes.map((node) => (
            <Draggable
              key={node.id}
              defaultPosition={{ x: node.x, y: node.y }}
              onDrag={(e, data) => handleDrag(node.id, e, data)}
            >
              <div
                id={node.id}
                className={`absolute cursor-move p-2 rounded-lg border bg-white shadow-sm ${
                  connectingMode ? 'cursor-pointer hover:border-blue-500' : ''
                } ${startNode === node.id ? 'border-blue-500' : ''}`}
                onClick={() => handleNodeClick(node.id)}
              >
                {node.text}
              </div>
            </Draggable>
          ))}
          
          {connections.map((connection, index) => (
            <Xarrow
              key={index}
              start={connection.start}
              end={connection.end}
              strokeWidth={2}
              color="rgb(100, 100, 100)"
              path="straight"
            />
          ))}
        </Xwrapper>
      </div>
    </div>
  );
}
