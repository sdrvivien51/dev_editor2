import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';
import Chart from 'chart.js/auto';
import { ChartConfig } from '@/components/editor/tool/ChartConfig';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  labels: string[];
  data: number[];
  colors: string[];
}

export default class ChartTool implements BlockTool {
  static get toolbox() {
    return {
      title: 'Chart',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><path d="M16 12H1V2H16V12ZM16 0H1C0.4 0 0 0.4 0 1V13C0 13.6 0.4 14 1 14H16C16.6 14 17 13.6 17 13V1C17 0.4 16.6 0 16 0Z"/><path d="M3 10L6 7L8 9L13 4" stroke="currentColor" stroke-width="1.5"/></svg>'
    };
  }

  private api: API;
  private data: ChartData;
  private chart: Chart | null = null;
  private wrapper: HTMLElement;
  private configRoot: HTMLElement;

  constructor({ data, api }: { data: BlockToolData<ChartData>; api: API }) {
    this.api = api;
    this.data = data?.data || {
      type: 'bar',
      labels: ['Label 1', 'Label 2', 'Label 3'],
      data: [10, 20, 30],
      colors: ['#FF6384', '#36A2EB', '#FFCE56']
    };
    
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('chart-block');
    
    this.configRoot = document.createElement('div');
    this.configRoot.classList.add('chart-config-root');
  }

  render(): HTMLElement {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '400px';
    
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    this.wrapper.appendChild(container);
    this.wrapper.appendChild(this.configRoot);

    // Render the chart
    this._renderChart(canvas);

    // Render the config component using React
    const root = createRoot(this.configRoot);
    root.render(createElement(ChartConfig, {
      onSave: (config: ChartData) => {
        this.data = config;
        this._renderChart(canvas);
      }
    }));

    return this.wrapper;
  }

  private _renderChart(canvas: HTMLCanvasElement) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: this.data.type,
      data: {
        labels: this.data.labels,
        datasets: [{
          label: 'Dataset',
          data: this.data.data,
          backgroundColor: this.data.colors,
          borderColor: this.data.colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  save(): BlockToolData<ChartData> {
    return {
      data: this.data
    };
  }

  validate(data: BlockToolData<ChartData>): boolean {
    if (!data || !data.data) return false;
    const { type, labels, data: chartData, colors } = data.data;
    return Boolean(type && labels && chartData && colors);
  }
}