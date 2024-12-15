import { API, BlockTool } from '@editorjs/editorjs';
import { ChartConfig } from '@/components/editor/ChartConfig';

export class ChartTool implements BlockTool {
  private data: any;
  private wrapper: HTMLElement;
  private api: API;

  static get toolbox() {
    return {
      title: 'Chart',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-42-30-56 29-81-67-68 39v23c0 19 15 34 34 34h178c17 0 31-13 34-28z"/></svg>'
    };
  }

  constructor({ data, api }: { data: any; api: API }) {
    this.data = data;
    this.api = api;
    this.wrapper = document.createElement('div');
  }

  render() {
    this.wrapper.classList.add('chart-tool-wrapper');

    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    this.wrapper.appendChild(chartContainer);

    // Render ChartConfig component
    const config = document.createElement('div');
    config.classList.add('chart-config');
    this.wrapper.appendChild(config);

    // Initialize chart with saved data if available
    if (this.data && this.data.chartData) {
      // TODO: Initialize chart with saved data
    }

    return this.wrapper;
  }

  save() {
    return {
      chartData: this.data
    };
  }
}
