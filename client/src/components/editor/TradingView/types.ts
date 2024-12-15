
import { BlockTool, BlockToolData } from '@editorjs/editorjs';

export interface TradingViewConfig {
  widgetType: keyof typeof WIDGET_TYPES;
  theme?: 'light' | 'dark';
  width?: string;
  height?: string;
  settings: Record<string, any>;
}

export interface TradingViewToolAPI {
  readonly readOnly: boolean;
  blocks: {
    update: (blockId: string, data: any) => void;
  };
}

export const WIDGET_TYPES = {
  ADVANCED_CHART: {
    title: 'Advanced Chart',
    description: 'Full-featured charting',
    configFields: ['symbol'],
    defaults: {
      symbol: 'NASDAQ:AAPL',
      interval: 'D',
      timezone: 'exchange',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: undefined,
    }
  },
  STOCK_HEATMAP: {
    title: 'Stock Market Heatmap',
    description: 'Visual representation of stock market sectors',
    configFields: [{
      name: 'dataSource',
      type: 'select',
      options: ['SPX500', 'NASDAQ100', 'DOW30', 'RUSSELL2000']
    }],
    defaults: {
      exchanges: [],
      dataSource: "SPX500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "en",
      hasTopBar: false,
      isDataSetEnabled: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true
    }
  },
  FOREX_HEATMAP: {
    title: 'Forex Heatmap',
    description: 'Currency pairs strength visualization',
    configFields: [{
      name: 'currencies',
      type: 'multiSelect',
      options: ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'NZD', 'CNY']
    }],
    defaults: {
      currencies: ["EUR", "USD", "JPY", "GBP"],
      isTransparent: false,
      locale: "en"
    }
  }
} as const;

export interface TradingViewConstructorOptions {
  data?: TradingViewConfig;
  api?: TradingViewToolAPI;
  readOnly?: boolean;
  config?: {
    readOnly?: boolean;
  };
}
