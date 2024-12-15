
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
    configFields: [{
      name: 'symbol',
      type: 'input',
      options: []
    }],
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
  SYMBOL_OVERVIEW: {
    title: 'Symbol Comparison',
    description: 'Compare multiple symbols',
    configFields: [
      { name: 'symbol', type: 'input', options: [] },
      { name: 'compareSymbol', type: 'input', options: [] },
      { name: 'colorTheme', type: 'select', options: ['light', 'dark'] },
      { name: 'chartType', type: 'select', options: ['line', 'area', 'candlesticks'] }
    ],
    defaults: {
      symbols: [["Apple", "AAPL|1D"]],
      chartOnly: true,
      width: 550,
      height: 400,
      locale: "en",
      colorTheme: "light",
      autosize: false,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: true,
      hideSymbolLogo: true,
      scalePosition: "right",
      scaleMode: "Percentage",
      fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-only",
      chartType: "line",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      lineWidth: 2,
      lineType: 0,
      compareSymbol: {
        symbol: "NASDAQ:NVDA",
        lineColor: "rgba(41, 98, 255, 1)",
        lineWidth: 2
      },
      dateRanges: ["1w|15", "1m|60", "3m|60", "12m|1D"],
      bottomColor: "rgba(255, 255, 255, 0)",
      dateFormat: "MMM dd, yyyy",
      timeHoursFormat: "12-hours"
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
