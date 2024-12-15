import { API, BlockTool } from '@editorjs/editorjs';

export class TradingViewTool implements BlockTool {
  private data: any;
  private wrapper: HTMLElement;
  private api: API;

  static get toolbox() {
    return {
      title: 'TradingView',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2h-15zM4 4.5A.5.5 0 0 1 4.5 4h15a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5v-15z"/></svg>'
    };
  }

  constructor({ data, api }: { data: any; api: API }) {
    this.data = data;
    this.api = api;
    this.wrapper = document.createElement('div');
  }

  render() {
    this.wrapper.classList.add('tradingview-wrapper');
    
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '400px';
    
    // Initialize TradingView widget
    new TradingView.widget({
      container_id: container.id,
      symbol: this.data?.symbol || 'NASDAQ:AAPL',
      interval: 'D',
      timezone: 'exchange',
      theme: 'light',
      style: '1',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
    });

    this.wrapper.appendChild(container);
    return this.wrapper;
  }

  save() {
    return this.data;
  }
}
