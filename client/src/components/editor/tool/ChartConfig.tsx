import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Plus, Trash2 } from 'lucide-react';
import { ChartType } from 'chart.js';
import { ChartData } from './ChartTool';

// Color palettes
const colorPalettes = {
  pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFB3F7', '#B3FFF7'],
  vivid: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
  soft: ['#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', '#E6E6FA', '#FFB6C1'],
  earth: ['#8B4513', '#556B2F', '#8FBC8F', '#DAA520', '#CD853F', '#D2691E'],
  modern: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5']
};

interface ChartConfigProps {
  onSave: (config: NonNullable<ChartData['chartData']>) => void;
  initialData?: ChartData['chartData'];
}

interface DataEntry {
  label: string;
  value: string;
}

export function ChartConfig({ onSave, initialData }: ChartConfigProps) {
  const [type, setType] = useState<ChartType>(initialData?.type || 'bar');
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [borderWidth, setBorderWidth] = useState<number>(initialData?.borderWidth || 1);
  const [tension, setTension] = useState<number>(initialData?.tension || 0.1);
  const [entries, setEntries] = useState<DataEntry[]>(
    initialData
      ? initialData.labels.map((label, index) => ({
          label,
          value: initialData.data[index].toString(),
        }))
      : [{ label: 'Label 1', value: '10' }]
  );
  const [selectedPalette, setSelectedPalette] = useState<keyof typeof colorPalettes>(() => {
    if (!initialData?.colors?.length) return 'pastel';
    const colorStr = initialData.colors.join(',');
    return (Object.entries(colorPalettes).find(([_, colors]) =>
      colors.slice(0, initialData.colors.length).join(',') === colorStr
    )?.[0] as keyof typeof colorPalettes) || 'pastel';
  });

  const addEntry = () => {
    setEntries([...entries, { label: `Label ${entries.length + 1}`, value: '0' }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof DataEntry, value: string) => {
    setEntries(entries.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSave = () => {
    try {
      const labels = entries.map(e => e.label);
      const data = entries.map(e => Number(e.value));
      const colors = colorPalettes[selectedPalette].slice(0, entries.length);

      onSave({
        type,
        labels,
        data,
        colors,
        title: title || undefined,
        borderWidth,
        tension: type === 'line' ? tension : undefined
      });
    } catch (error) {
      console.error('Failed to save chart configuration:', error);
    }
  };

  return (
    <div className="inline-block">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Configure chart</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-96">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Chart Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Configure your chart's appearance and data.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select value={type} onValueChange={(value: ChartType) => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="pie">Pie</SelectItem>
                  <SelectItem value="doughnut">Doughnut</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color Palette</Label>
              <Select value={selectedPalette} onValueChange={setSelectedPalette}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color palette" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pastel">Pastel</SelectItem>
                  <SelectItem value="vivid">Vivid</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="earth">Earth</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1 mt-1">
                {colorPalettes[selectedPalette]
                  .slice(0, 6)
                  .map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Chart Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter chart title (optional)"
              />
            </div>

            {type === 'line' && (
              <div className="space-y-2">
                <Label>Line Tension</Label>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={tension}
                  onChange={(e) => setTension(Number(e.target.value))}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Border Width</Label>
              <Input
                type="number"
                min={0}
                max={10}
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Data Points</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addEntry}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {entries.map((entry, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={entry.label}
                      onChange={(e) => updateEntry(index, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={entry.value}
                      onChange={(e) => updateEntry(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="w-24"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEntry(index)}
                      disabled={entries.length === 1}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              Update Chart
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
