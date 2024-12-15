import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { ChartConfig } from './ChartConfig';
import './chart.css';

Chart.register();

export interface ChartData extends BlockToolData {
  chartData?: {
    type: ChartType;
    labels: string[];
    data: number[];
    colors: string[];
    title?: string;
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
    pointStyle?: 'circle' | 'cross' | 'dash' | 'line' | 'rect' | 'star' | 'triangle';
    pointRadius?: number;
    stacked?: boolean;
  };
}

export class ChartTool implements BlockTool {
  private _api: API;
  private readOnly: boolean;
  private data: ChartData;
  private chart: Chart | null;
  private wrapper: HTMLElement | null;
  private canvas: HTMLCanvasElement | null;
  private configRoot: ReturnType<typeof createRoot> | null;

  static get toolbox() {
    return {
      title: 'Chart',
      icon: `<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 12H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM1 1.5v9h15v-9H1z"/>
        <path d="M3 8.5v2h2v-2H3zm4-3v5h2v-5H7zm4-3v8h2v-8h-2z"/>
      </svg>`
    };
  }

  constructor({ data, api, readOnly }: { data: ChartData; api: API; readOnly: boolean }) {
    this._api = api;
    this.readOnly = readOnly;
    this.data = data || {};
    this.chart = null;
    this.wrapper = null;
    this.canvas = null;
    this.configRoot = null;
  }

  get api(): API {
    return this._api;
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('ce-chart-tool');
    
    if (!this.readOnly) {
      const configWrapper = document.createElement('div');
      configWrapper.classList.add('ce-chart-config');
      this.configRoot = createRoot(configWrapper);
      this.configRoot.render(
        createElement(ChartConfig, {
          onSave: this.updateChart.bind(this),
          initialData: this.data.chartData
        })
      );
      this.wrapper.appendChild(configWrapper);
    }
    
    const canvasWrapper = document.createElement('div');
    canvasWrapper.classList.add('ce-chart-canvas-wrapper');
    canvasWrapper.style.cssText = 'position: relative; height: 400px; width: 100%; margin-top: 10px;';
    
    this.canvas = document.createElement('canvas');
    canvasWrapper.appendChild(this.canvas);
    this.wrapper.appendChild(canvasWrapper);
    
    if (this.data.chartData) {
      this.renderChart(this.data.chartData);
    } else if (!this.readOnly) {
      this.updateChart({
        type: 'bar',
        labels: ['Sample 1', 'Sample 2', 'Sample 3'],
        data: [10, 20, 30],
        colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF']
      });
    }

    return this.wrapper;
  }

  updateChart(chartData: ChartData['chartData']) {
    if (!chartData) return;
    
    this.data.chartData = chartData;
    this.renderChart(chartData);
  }

  renderChart(chartData: NonNullable<ChartData['chartData']>) {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.canvas) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: chartData.type,
      data: {
        labels: chartData.labels,
        datasets: [{
          label: chartData.title || 'Dataset',
          data: chartData.data,
          backgroundColor: chartData.colors,
          borderColor: chartData.colors,
          borderWidth: chartData.borderWidth || 1,
          tension: chartData.tension || 0.1,
          fill: chartData.fill || chartData.type !== 'line',
          pointStyle: chartData.pointStyle || 'circle',
          pointRadius: chartData.pointRadius || 3,
          stack: chartData.stacked ? 'stack1' : undefined
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: !!chartData.title,
            text: chartData.title || ''
          }
        },
        scales: chartData.type !== 'pie' && chartData.type !== 'doughnut' ? {
          y: {
            beginAtZero: true
          }
        } : undefined
      }
    };

    this.chart = new Chart(ctx, config);
  }

  save(): ChartData {
    return {
      chartData: this.data.chartData
    };
  }

  validate(data: ChartData): boolean {
    if (!data.chartData) return false;
    const { type, labels, data: chartData, colors } = data.chartData;
    
    // Basic validation
    const isValidStructure = 
      ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'].includes(type) &&
      Array.isArray(labels) &&
      Array.isArray(chartData) &&
      Array.isArray(colors);

    // Data length validation
    const isValidDataLength = 
      labels.length === chartData.length &&
      labels.length === colors.length;

    // Optional properties validation
    const { borderWidth, tension, pointRadius } = data.chartData;
    const isValidOptionalProps =
      (borderWidth === undefined || (typeof borderWidth === 'number' && borderWidth >= 0)) &&
      (tension === undefined || (typeof tension === 'number' && tension >= 0 && tension <= 1)) &&
      (pointRadius === undefined || (typeof pointRadius === 'number' && pointRadius >= 0));

    return isValidStructure && isValidDataLength && isValidOptionalProps;
  }

  destroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    if (this.configRoot) {
      this.configRoot.unmount();
      this.configRoot = null;
    }
  }
}

export default ChartTool;
