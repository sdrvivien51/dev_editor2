
import { createRoot } from 'react-dom/client';
import { Chart, ChartType } from 'chart.js/auto';
import { ChartToolConfig, ChartToolData, ChartConstructorOptions } from './types';
import { ChartConfigModal } from './ChartConfigModal';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default class ChartTool {
  private data: ChartToolData;
  private config: ChartToolConfig = {};
  private api: any;
  private chart: Chart | null = null;
  private container: HTMLDivElement | null = null;
  private modalRoot: HTMLDivElement | null = null;
  private modalContainer: any = null;

  static get toolbox() {
    return {
      title: 'Chart',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M16 12H1V1M4 9V4M8 9V6M12 9V3"/></svg>'
    };
  }

  constructor({ data }: ChartConstructorOptions) {
    this.data = {
      chartType: data?.chartType || 'bar',
      chartData: data?.chartData || {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
          label: 'My Dataset',
          data: [12, 19, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      }
    };
  }

  renderModal(isOpen: boolean) {
    if (!this.modalRoot) {
      this.modalRoot = document.createElement('div');
      document.body.appendChild(this.modalRoot);
      this.modalContainer = createRoot(this.modalRoot);
    }

    const handleClose = () => {
      this.modalContainer.render(
        <ChartConfigModal
          isOpen={false}
          onClose={handleClose}
          initialData={this.data.chartData}
          chartType={this.data.chartType}
          onSave={this.handleSave}
        />
      );
    };

    const handleSave = (chartData: ChartData, chartType: string) => {
      this.data.chartData = chartData;
      this.data.chartType = chartType as ChartType;
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = this.createChart(
        this.container?.querySelector('canvas') as HTMLCanvasElement,
        this.data.chartType,
        this.data.chartData
      );
    };

    const boundHandleSave = handleSave.bind(this);

    this.modalContainer.render(
      <ChartConfigModal
        isOpen={isOpen}
        onClose={handleClose}
        initialData={this.data.chartData}
        chartType={this.data.chartType}
        onSave={boundHandleSave}
      />
    );
  }

  render() {
    this.container = document.createElement('div');
    this.container.classList.add('chart-tool-container');

    const canvas = document.createElement('canvas');
    canvas.classList.add('chart-canvas');
    canvas.style.width = '100%';
    canvas.style.height = '300px';
    canvas.style.marginTop = '1rem';

    const configButton = document.createElement('div');
    const buttonRoot = createRoot(configButton);
    buttonRoot.render(
      <Button
        variant="outline"
        size="sm"
        onClick={() => this.renderModal(true)}
        className="w-full mt-2"
      >
        <Settings2 className="h-4 w-4 mr-2" />
        Configure Chart
      </Button>
    );

    this.container.appendChild(canvas);
    this.container.appendChild(configButton);

    this.chart = this.createChart(canvas, this.data.chartType, this.data.chartData);

    return this.container;
  }

  private createChart(canvas: HTMLCanvasElement, type: string, data: any): Chart {
    return new Chart(canvas, {
      type: type as ChartType,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  save(): ChartToolData {
    return this.data;
  }

  validate(data: ChartToolData): boolean {
    return !!(data.chartType && data.chartData);
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.modalRoot) {
      document.body.removeChild(this.modalRoot);
    }
  }

  static get sanitize() {
    return {
      chartType: false,
      chartData: false
    };
  }
}
