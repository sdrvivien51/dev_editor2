import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';
import Chart from 'chart.js/auto';
import { createPortal } from 'react-dom';
import { createElement } from 'react';
import { ChartConfig } from '@/components/editor/ChartConfig';

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  labels: string[];
  data: number[];
  colors: string[];
}

export default class ChartTool implements BlockTool {
  private data: ChartData;
  private api: API;
  private wrapper: HTMLElement;
  private chart: Chart | null = null;
  private configRoot: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Chart',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M16 12H1V2H16V12ZM16 0H1C0.4 0 0 0.4 0 1V13C0 13.6 0.4 14 1 14H16C16.6 14 17 13.6 17 13V1C17 0.4 16.6 0 16 0Z"/><path d="M3 10L6 7L8 9L13 4" stroke="currentColor" stroke-width="1.5"/></svg>'
    };
  }

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.api = api;
    this.data = data as ChartData || {
      type: 'bar',
      labels: ['Label 1', 'Label 2', 'Label 3'],
      data: [10, 20, 30],
      colors: ['#FF6384', '#36A2EB', '#FFCE56']
    };
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('chart-block');
  }

  render() {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '400px';
    container.style.marginBottom = '20px';

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    this.wrapper.appendChild(container);

    // Create config container
    this.configRoot = document.createElement('div');
    this.configRoot.classList.add('chart-config-root');
    this.wrapper.appendChild(this.configRoot);

    // Render the chart
    this._renderChart(canvas);

    // Render the config component
    if (this.configRoot) {
      createPortal(
        createElement(ChartConfig, {
          onSave: this._updateChart.bind(this)
        }),
        this.configRoot
      );
    }

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

  private _updateChart(config: ChartData) {
    this.data = config;
    const canvas = this.wrapper.querySelector('canvas');
    if (canvas) {
      this._renderChart(canvas);
    }
  }

  save() {
    return this.data;
  }

  validate(savedData: ChartData) {
    if (!savedData || !savedData.type || !savedData.labels || !savedData.data || !savedData.colors) {
      return false;
    }
    return true;
  }
}
