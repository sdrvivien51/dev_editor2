import React, { useState } from 'react';
import { ChartData } from 'chart.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

interface ChartConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ChartData;
  chartType: string;
  onSave: (data: ChartData, type: string) => void;
}

const DEFAULT_COLORS = [
  ['#FF6384', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF'],
  ['#E8C1A0', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555'],
  ['#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF'],
];

export const ChartConfigModal: React.FC<ChartConfigModalProps> = ({
  isOpen,
  onClose,
  initialData,
  chartType: initialChartType,
  onSave,
}) => {
  const [chartType, setChartType] = useState(initialChartType);
  const [labels, setLabels] = useState<string[]>(initialData.labels as string[] || []);
  const [values, setValues] = useState<number[]>(
    initialData.datasets?.[0]?.data as number[] || []
  );
  const [selectedPalette, setSelectedPalette] = useState(0);

  const handleAddDataPoint = () => {
    setLabels([...labels, '']);
    setValues([...values, 0]);
  };

  const handleRemoveDataPoint = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
    setValues(values.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const chartData: ChartData = {
      labels,
      datasets: [{
        label: 'Dataset 1',
        data: values,
        backgroundColor: DEFAULT_COLORS[selectedPalette].slice(0, values.length),
        borderColor: DEFAULT_COLORS[selectedPalette].slice(0, values.length),
        borderWidth: 1
      }]
    };
    onSave(chartData, chartType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chart Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <label className="w-24">Chart Type:</label>
            <select 
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
              <option value="doughnut">Doughnut</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Color Palette:</label>
            <div className="flex space-x-2">
              {DEFAULT_COLORS.map((palette, index) => (
                <button
                  key={index}
                  className={`p-1 rounded-md ${selectedPalette === index ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPalette(index)}
                >
                  <div className="flex">
                    {palette.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        style={{ backgroundColor: color }}
                        className="w-4 h-4 first:rounded-l-sm last:rounded-r-sm"
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data Points:</label>
            {labels.map((label, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Label"
                  value={label}
                  onChange={(e) => {
                    const newLabels = [...labels];
                    newLabels[index] = e.target.value;
                    setLabels(newLabels);
                  }}
                />
                <Input
                  type="number"
                  placeholder="Value"
                  value={values[index]}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[index] = Number(e.target.value);
                    setValues(newValues);
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDataPoint(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleAddDataPoint}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Data Point
            </Button>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Chart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
