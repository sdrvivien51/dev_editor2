import { createRoot } from "react-dom/client";
import { createElement } from "react";
import TradingViewWidget from "./TradingViewWidget";

export default class TradingViewTool {
  api: any;
  readOnly: boolean;
  data: any;
  element: HTMLElement | null;

  static get toolbox() {
    return {
      title: 'TradingView',
      icon: '<svg width="17" height="15" viewBox="0 0 336 336"><path d="M168 0C75.2 0 0 75.2 0 168s75.2 168 168 168 168-75.2 168-168S260.8 0 168 0zm0 288c-66.2 0-120-53.8-120-120S101.8 48 168 48s120 53.8 120 120-53.8 120-120 120z"/></svg>'
    };
  }

  constructor({ data, api, readOnly }: { data: any, api: any, readOnly: boolean }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = data;
    this.element = null;
  }

  render() {
    const wrapper = document.createElement('div');
    this.element = wrapper;
    
    const root = createRoot(wrapper);
    root.render(createElement(TradingViewWidget));

    return wrapper;
  }

  save() {
    return this.data;
  }
}
