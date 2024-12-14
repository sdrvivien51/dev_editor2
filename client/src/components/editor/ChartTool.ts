import Chart from "chart.js/auto";
import { ChartConfig } from "./ChartConfig";
import { createRoot } from "react-dom/client";
import { createElement } from "react";

export default class ChartTool {
  api: any;
  readOnly: boolean;
  data: any;
  chart: Chart | null;
  wrapper: HTMLElement | null;
  canvas: HTMLCanvasElement | null;

  static get toolbox() {
    return {
      title: 'Chart',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><path d="M16 1h-3.5V0h-2v1H11V0H9v1H6.5V0h-2v1H1v14h15V1zM3 2v1h2V2h2.5v1h2V2H12v1h2V2h1v2H2V2h1zm11 12H3v-9h11v9z"/></svg>'
    };
  }

  constructor({ data, api, readOnly }: { data: any, api: any, readOnly: boolean }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = data || {};
    this.chart = null;
    this.wrapper = null;
    this.canvas = null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('ce-chart-tool');
    
    const configWrapper = document.createElement('div');
    const canvasWrapper = document.createElement('div');
    canvasWrapper.style.position = 'relative';
    canvasWrapper.style.height = '400px';
    canvasWrapper.style.width = '100%';
    
    this.canvas = document.createElement('canvas');
    canvasWrapper.appendChild(this.canvas);
    
    this.wrapper.appendChild(configWrapper);
    this.wrapper.appendChild(canvasWrapper);
    
    const root = createRoot(configWrapper);
    root.render(
      createElement(ChartConfig, {
        onSave: this.updateChart.bind(this)
      })
    );

    if (this.data.chartData) {
      this.renderChart(this.data.chartData);
    }

    return this.wrapper;
  }

  updateChart(chartData: any) {
    this.data.chartData = chartData;
    this.renderChart(chartData);
  }

  renderChart(chartData: any) {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.canvas) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: chartData.type,
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Dataset',
          data: chartData.data,
          backgroundColor: chartData.colors,
          borderColor: chartData.colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  save() {
    return this.data;
  }
}
