import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Plus, Trash2 } from 'lucide-react';

interface MermaidConfigProps {
  onSave: (config: {
    type: 'flowchart' | 'sequence' | 'mindmap';
    code: string;
    caption: string;
  }) => void;
}

export function MermaidConfig({ onSave }: MermaidConfigProps) {
  const [type, setType] = useState<'flowchart' | 'sequence' | 'mindmap'>('mindmap');
  const [nodes, setNodes] = useState<{ id: string; text: string; parent?: string }[]>([
    { id: '1', text: 'Main Idea' }
  ]);

  const addNode = (parentId?: string) => {
    const newId = (nodes.length + 1).toString();
    setNodes([...nodes, { 
      id: newId, 
      text: `Node ${newId}`,
      parent: parentId 
    }]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id && node.parent !== id));
  };

  const updateNode = (id: string, text: string) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, text } : node
    ));
  };

  const generateMermaidCode = () => {
    switch (type) {
      case 'mindmap':
        return `mindmap
  ${nodes.map(node => {
    if (!node.parent) {
      return `root((${node.text}))`;
    }
    return `    ${node.parent}[${node.text}]`;
  }).join('\n  ')}`;
      
      case 'flowchart':
        return `flowchart TD
  ${nodes.map(node => `${node.id}[${node.text}]`).join('\n  ')}
  ${nodes.filter(node => node.parent)
    .map(node => `${node.parent} --> ${node.id}`).join('\n  ')}`;
      
      case 'sequence':
        return `sequenceDiagram
  ${nodes.map(node => `participant ${node.text}`).join('\n  ')}
  ${nodes.filter(node => node.parent)
    .map(node => {
      const parent = nodes.find(n => n.id === node.parent);
      return `${parent?.text} ->> ${node.text}: Message`;
    }).join('\n  ')}`;
    }
  };

  const handleSave = () => {
    onSave({
      type,
      code: generateMermaidCode(),
      caption: `${type} diagram`
    });
  };

  return (
    <div className="inline-block">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Configure diagram</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-96">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Diagram Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Configure your diagram structure and content.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Diagram Type</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select diagram type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mindmap">Mind Map</SelectItem>
                  <SelectItem value="flowchart">Flowchart</SelectItem>
                  <SelectItem value="sequence">Sequence Diagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Nodes</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode()}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Node
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {nodes.map((node) => (
                  <div key={node.id} className="flex gap-2 items-center">
                    <Input
                      value={node.text}
                      onChange={(e) => updateNode(node.id, e.target.value)}
                      placeholder="Node text"
                      className="flex-1"
                    />
                    {!node.parent && node.id !== '1' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNode(node.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {node.id !== '1' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addNode(node.id)}
                        className="h-8 px-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              Insert Diagram
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
