import type { ChartConfiguration, ChartData, ChartType } from 'chart.js';

export interface ChartToolData {
  chartType: ChartType;
  chartData: ChartData;
  chartOptions?: ChartConfiguration['options'];
}

export interface ChartToolAPI {
  readonly readOnly: boolean;
  blocks: {
    update: (blockId: string, data: any) => void;
  };
}

export interface ChartToolConfig {
  readOnly?: boolean;
}

export interface ChartConstructorOptions {
  data?: {
    chartType?: ChartType;
    chartData?: ChartData;
    chartOptions?: ChartConfiguration['options'];
  };
  config?: ChartToolConfig;
  api?: any;
  readOnly?: boolean;
}
