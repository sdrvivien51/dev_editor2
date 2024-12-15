
import './Chart.css';
import Chart from 'chart.js/auto';

export default class ChartTool {
  static get toolbox() {
    return {
      title: 'Chart',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M16 12H1V1M4 9V4M8 9V6M12 9V3"/></svg>'
    };
  }

  constructor({ data, config, api }) {
    this.data = {
      chartType: data.chartType || 'bar',
      chartData: data.chartData || {
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
    this.api = api;
    this.config = config;
  }

  render() {
    const container = document.createElement('div');
    container.classList.add('chart-tool-container');

    const chartTypeSelect = document.createElement('select');
    chartTypeSelect.classList.add('chart-type-select');
    ['bar', 'line', 'pie', 'doughnut'].forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.text = type.charAt(0).toUpperCase() + type.slice(1);
      option.selected = type === this.data.chartType;
      chartTypeSelect.appendChild(option);
    });

    const dataInput = document.createElement('textarea');
    dataInput.classList.add('chart-data-input');
    dataInput.placeholder = 'Enter chart data in JSON format';
    dataInput.value = JSON.stringify(this.data.chartData, null, 2);

    const canvas = document.createElement('canvas');
    canvas.classList.add('chart-canvas');

    container.appendChild(chartTypeSelect);
    container.appendChild(dataInput);
    container.appendChild(canvas);

    let chart = this.createChart(canvas, this.data.chartType, this.data.chartData);

    chartTypeSelect.addEventListener('change', () => {
      this.data.chartType = chartTypeSelect.value;
      chart.destroy();
      chart = this.createChart(canvas, this.data.chartType, this.data.chartData);
    });

    dataInput.addEventListener('change', () => {
      try {
        const newData = JSON.parse(dataInput.value);
        this.data.chartData = newData;
        chart.destroy();
        chart = this.createChart(canvas, this.data.chartType, this.data.chartData);
      } catch (e) {
        console.error('Invalid JSON data');
      }
    });

    return container;
  }

  createChart(canvas, type, data) {
    return new Chart(canvas, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  save() {
    return this.data;
  }

  validate(data) {
    return data.chartType && data.chartData;
  }

  static get sanitize() {
    return {
      chartType: false,
      chartData: false
    };
  }
}
