import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartConfigProps {
  onSave: (config: {
    type: 'bar' | 'line' | 'pie' | 'doughnut';
    labels: string[];
    data: number[];
    colors: string[];
  }) => void;
}

export function ChartConfig({ onSave }: ChartConfigProps) {
  const [type, setType] = useState<'bar' | 'line' | 'pie' | 'doughnut'>('bar');
  const [labels, setLabels] = useState('');
  const [data, setData] = useState('');
  const [colors, setColors] = useState('#FF6384,#36A2EB,#FFCE56');

  const handleSave = () => {
    const chartConfig = {
      type,
      labels: labels.split(',').map(l => l.trim()),
      data: data.split(',').map(d => Number(d.trim())),
      colors: colors.split(',').map(c => c.trim()),
    };
    onSave(chartConfig);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Configurer le graphique</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Type de graphique</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Barres</SelectItem>
                <SelectItem value="line">Ligne</SelectItem>
                <SelectItem value="pie">Camembert</SelectItem>
                <SelectItem value="doughnut">Anneau</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Labels (séparés par des virgules)</Label>
            <Input
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="Label 1, Label 2, Label 3"
            />
          </div>

          <div className="space-y-2">
            <Label>Données (séparées par des virgules)</Label>
            <Input
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="10, 20, 30"
            />
          </div>

          <div className="space-y-2">
            <Label>Couleurs (séparées par des virgules)</Label>
            <Input
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="#FF6384, #36A2EB, #FFCE56"
            />
          </div>

          <Button onClick={handleSave}>Appliquer</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
