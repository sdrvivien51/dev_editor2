import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from 'lucide-react';

const WIDGET_OPTIONS = [
  { 
    label: 'Stock Market Heatmap',
    value: 'STOCK_HEATMAP',
    description: 'Visual representation of stock market sectors and their performance'
  },
  { 
    label: 'Forex Heatmap',
    value: 'FOREX_HEATMAP',
    description: 'Currency pairs strength and weakness visualization'
  },
  { 
    label: 'Market Tickers',
    value: 'TICKERS',
    description: 'Real-time price updates for stocks, forex, and cryptocurrencies'
  },
  { 
    label: 'Crypto Screener',
    value: 'CRYPTO_SCREENER',
    description: 'Advanced cryptocurrency screening and analysis tool'
  },
  { 
    label: 'Stock Screener',
    value: 'STOCK_SCREENER',
    description: 'Powerful stock screening tool with multiple indicators'
  }
];

function TradingViewConfig({ onConfigChange, defaultWidget = 'STOCK_HEATMAP' }) {
  const handleWidgetTypeChange = (value) => {
    onConfigChange?.({ widgetType: value });
  };

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Widget Type
        </label>
        <Select.Root defaultValue={defaultWidget} onValueChange={handleWidgetTypeChange}>
          <Select.Trigger 
            className="inline-flex items-center justify-between w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select widget type"
          >
            <Select.Value placeholder="Select widget type" />
            <Select.Icon>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content 
              className="overflow-hidden bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
              position="popper"
              sideOffset={5}
            >
              <Select.Viewport className="p-1">
                {WIDGET_OPTIONS.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className="relative flex flex-col px-8 py-2 text-sm text-gray-700 dark:text-gray-200 rounded hover:bg-blue-50 dark:hover:bg-gray-700 cursor-default focus:outline-none select-none"
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {option.description}
                    </span>
                    <Select.ItemIndicator className="absolute left-2 top-3 inline-flex items-center">
                      <svg className="h-4 w-4 text-blue-500" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
}

export default TradingViewConfig;
