import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import TradingViewWidget from '@/components/editor/TradingViewWidget';

export default class TradingViewTool implements BlockTool {
  private api: API;
  private _data: any;
  private wrapper: HTMLElement;

  static get toolbox() {
    return {
      title: 'TradingView',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13.6493L7.46484 9.18457L11.9297 13.6493L16.3945 9.18457L21.75 13.6493" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
  }

  constructor({ data, api }: { data: BlockToolData; api: API }) {
    this.api = api;
    this._data = data;
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('tradingview-block');
  }

  render() {
    const root = createRoot(this.wrapper);
    root.render(createElement(TradingViewWidget));
    return this.wrapper;
  }

  save() {
    return {
      widget: 'tradingview'
    };
  }

  validate(savedData: any) {
    return savedData.widget === 'tradingview';
  }
}
