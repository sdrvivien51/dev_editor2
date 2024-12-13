import React from 'react';
import { ChartConfig } from './ChartConfig';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';

interface ChartToolboxProps {
  onConfigSave: (config: {
    type: 'bar' | 'line' | 'pie' | 'doughnut';
    labels: string[];
    data: number[];
    colors: string[];
  }) => void;
}

export function ChartToolbox({ onConfigSave }: ChartToolboxProps) {
  return (
    <div className="chart-toolbox">
      <ChartConfig onSave={onConfigSave} />
    </div>
  );
}
