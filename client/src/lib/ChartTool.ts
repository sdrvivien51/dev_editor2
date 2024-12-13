import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';
import Chart from 'chart.js/auto';

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }>;
  };
}

export default class ChartTool implements BlockTool {
  private data: ChartData;
  private api: API;
  private wrapper: HTMLElement;
  private chart: Chart | null = null;

  static get toolbox() {
    return {
      title: 'Graphique',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M16 12H1V2H16V12ZM16 0H1C0.4 0 0 0.4 0 1V13C0 13.6 0.4 14 1 14H16C16.6 14 17 13.6 17 13V1C17 0.4 16.6 0 16 0Z"/><path d="M3 10L6 7L8 9L13 4" stroke="currentColor" stroke-width="1.5"/></svg>'
    };
  }

  constructor({ data, api }: { data: ChartData; api: API }) {
    this.data = data || {
      type: 'bar',
      data: {
        labels: ['Label 1', 'Label 2', 'Label 3'],
        datasets: [{
          label: 'Dataset 1',
          data: [10, 20, 30],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      }
    };
    this.api = api;
    this.wrapper = document.createElement('div');
  }

  render() {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '400px';
    container.style.marginBottom = '20px';

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const configBtn = document.createElement('button');
    configBtn.textContent = 'Configurer le graphique';
    configBtn.className = 'cdx-button';
    configBtn.onclick = this._openConfig.bind(this);

    this.wrapper.appendChild(container);
    this.wrapper.appendChild(configBtn);

    // Render chart
    this._renderChart(canvas);

    return this.wrapper;
  }

  private _renderChart(canvas: HTMLCanvasElement) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: this.data.type,
      data: this.data.data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  private _openConfig() {
    const root = document.createElement('div');
    root.className = 'chart-config-root';
    this.wrapper.appendChild(root);

    const handleSave = (config: {
      type: 'bar' | 'line' | 'pie' | 'doughnut';
      labels: string[];
      data: number[];
      colors: string[];
    }) => {
      this.data = {
        type: config.type,
        data: {
          labels: config.labels,
          datasets: [{
            label: 'Dataset',
            data: config.data,
            backgroundColor: config.colors,
          }]
        }
      };

      this._renderChart(this.wrapper.querySelector('canvas')!);
      root.remove();
    };

    // @ts-ignore
    import('@/components/editor/ChartConfig').then(({ ChartConfig }) => {
      const { createRoot } = require('react-dom/client');
      const root = createRoot(document.querySelector('.chart-config-root'));
      root.render(React.createElement(ChartConfig, { onSave: handleSave }));
    });
  }

  save() {
    return this.data;
  }
}
