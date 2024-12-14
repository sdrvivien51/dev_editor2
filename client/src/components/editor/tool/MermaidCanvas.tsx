import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import Xarrow, { Xwrapper } from 'react-xarrows';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Link as LinkIcon, Database, Square, Diamond, Hexagon } from 'lucide-react';

interface Node {
  id: string;
  text: string;
  type: 'default' | 'decision' | 'process' | 'database' | 'input' | 'subgraph';
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface Connection {
  start: string;
  end: string;
  label?: string;
}

interface MermaidCanvasProps {
  onSave: (config: {
    type: 'flowchart' | 'sequence' | 'mindmap';
    code: string;
    caption: string;
  }) => void;
}

export function MermaidCanvas({ onSave }: MermaidCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNodeType, setSelectedNodeType] = useState<Node['type']>('default');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectingMode, setConnectingMode] = useState(false);
  const [startNode, setStartNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getNodeDefaults = (type: Node['type']) => {
    switch (type) {
      case 'decision':
        return { width: 120, height: 80, shape: 'diamond' };
      case 'database':
        return { width: 100, height: 80, shape: 'cylinder' };
      case 'input':
        return { width: 120, height: 60, shape: 'parallelogram' };
      case 'subgraph':
        return { width: 160, height: 100, shape: 'rectangle', className: 'border-2' };
      default:
        return { width: 120, height: 60, shape: 'rectangle' };
    }
  };

  const addNode = () => {
    const defaults = getNodeDefaults(selectedNodeType);
    const newNode: Node = {
      id: `node-${Date.now()}`,
      text: `New ${selectedNodeType}`,
      type: selectedNodeType,
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100,
      width: defaults.width,
      height: defaults.height
    };
    setNodes([...nodes, newNode]);
  };

  const getNodeIcon = (type: Node['type']) => {
    switch (type) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'decision':
        return <Diamond className="h-4 w-4" />;
      case 'process':
        return <Square className="h-4 w-4" />;
      case 'subgraph':
        return <Hexagon className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (connectingMode) {
      if (startNode === null) {
        setStartNode(nodeId);
      } else if (startNode !== nodeId) {
        setConnections([...connections, { 
          start: startNode, 
          end: nodeId,
          label: 'connects to'
        }]);
        setStartNode(null);
        setConnectingMode(false);
      }
    }
  };

  const generateMermaidCode = () => {
    const code = `flowchart LR\n${nodes.map(node => 
      `  ${node.id}["${node.text}"]`
    ).join('\n')}\n${connections.map(conn =>
      `  ${conn.start} --> |${conn.label}| ${conn.end}`
    ).join('\n')}`;

    onSave({
      type: 'flowchart',
      code,
      caption: 'Interactive Flowchart'
    });
  };

  return (
    <div className="relative border rounded-lg p-4" style={{ height: '600px', overflow: 'hidden' }}>
      <div className="absolute top-4 right-4 flex gap-2">
        <Select value={selectedNodeType} onValueChange={(value: Node['type']) => setSelectedNodeType(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Node type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Default
              </div>
            </SelectItem>
            <SelectItem value="decision">
              <div className="flex items-center gap-2">
                <Diamond className="h-4 w-4" />
                Decision
              </div>
            </SelectItem>
            <SelectItem value="process">
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Process
              </div>
            </SelectItem>
            <SelectItem value="database">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database
              </div>
            </SelectItem>
            <SelectItem value="subgraph">
              <div className="flex items-center gap-2">
                <Hexagon className="h-4 w-4" />
                Subgraph
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={addNode}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Node
        </Button>

        <Button
          variant={connectingMode ? "secondary" : "outline"}
          size="sm"
          onClick={() => {
            setConnectingMode(!connectingMode);
            setStartNode(null);
          }}
          className="gap-2"
        >
          <LinkIcon className="h-4 w-4" />
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

      <div ref={canvasRef} className="relative w-full h-full bg-white/50">
        <Xwrapper>
          {nodes.map((node) => (
            <Draggable
              key={node.id}
              defaultPosition={{ x: node.x, y: node.y }}
              onDrag={(e, data) => {
                const updatedNodes = nodes.map(n =>
                  n.id === node.id ? { ...n, x: data.x, y: data.y } : n
                );
                setNodes(updatedNodes);
              }}
            >
              <div
                id={node.id}
                className={`absolute cursor-move p-4 border bg-white shadow-sm ${
                  connectingMode ? 'cursor-pointer hover:border-blue-500' : ''
                } ${startNode === node.id ? 'border-blue-500' : ''} ${
                  node.type === 'decision' ? 'rotate-45' :
                  node.type === 'database' ? 'rounded-b-xl' :
                  node.type === 'subgraph' ? 'border-2 border-dashed' :
                  'rounded-lg'
                }`}
                style={{
                  width: node.width,
                  height: node.height,
                }}
                onClick={() => handleNodeClick(node.id)}
              >
                <div className={node.type === 'decision' ? '-rotate-45' : ''}>
                  <div className="flex items-center gap-2">
                    {getNodeIcon(node.type)}
                    <span>{node.text}</span>
                  </div>
                </div>
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
              labels={{
                middle: <div className="bg-white px-2 text-sm">{connection.label}</div>
              }}
            />
          ))}
        </Xwrapper>
      </div>
    </div>
  );
}
