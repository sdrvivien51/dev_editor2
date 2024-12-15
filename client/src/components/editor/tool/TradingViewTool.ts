import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import TradingViewWidget from './TradingViewWidget';
import './chart.css';

export interface TradingViewData extends BlockToolData {
  symbol?: string;
  interval?: string;
  height?: number;
}

export default class TradingViewTool implements BlockTool {
  private _api: API;
  private _readOnly: boolean;
  private _data: TradingViewData;
  private container: HTMLElement | null;
  private root: ReturnType<typeof createRoot> | null;

  static get toolbox() {
    return {
      title: 'TradingView',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 12L11 8L15 12L19 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
  }

  constructor({ data, api, readOnly }: { data: TradingViewData; api: API; readOnly: boolean }) {
    this._api = api;
    this._readOnly = readOnly;
    this._data = {
      symbol: data.symbol || 'NASDAQ:AAPL',
      interval: data.interval || '1D',
      height: data.height || 400
    };
    this.container = null;
    this.root = null;
  }

  render(): HTMLElement {
    this.container = document.createElement('div');
    this.container.classList.add('tradingview-widget-container');
    
    this.root = createRoot(this.container);
    this.root.render(
      createElement(TradingViewWidget, {
        symbol: this._data.symbol,
        interval: this._data.interval,
        height: this._data.height
      })
    );

    return this.container;
  }

  save(): TradingViewData {
    return this._data;
  }

  validate(data: TradingViewData): boolean {
    if (!data) return false;
    // Validate symbol format (optional)
    if (data.symbol && typeof data.symbol !== 'string') return false;
    // Validate interval format (optional)
    if (data.interval && typeof data.interval !== 'string') return false;
    // Validate height (optional)
    if (data.height && (typeof data.height !== 'number' || data.height <= 0)) return false;
    return true;
  }

  destroy(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}
