import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';

interface MermaidConfigProps {
  onSave: (config: {
    type: 'flowchart' | 'sequence';
    code: string;
    caption: string;
  }) => void;
}

export function MermaidConfig({ onSave }: MermaidConfigProps) {
  return (
    <div className="inline-block">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Configure diagram</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[800px]">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Interactive Diagram Editor</h4>
              <p className="text-sm text-muted-foreground">
                Drag nodes to position them and connect them by clicking the Connect button.
              </p>
            </div>

            {/* MermaidCanvas component removed */}

          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}