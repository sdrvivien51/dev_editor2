import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import MindMap from '@/components/mindmap/MindMap';

export interface ReactFlowData {
  type: 'mindmap';
}

export default class ReactFlowTool implements BlockTool {
  private api: API;
  private wrapper: HTMLElement;

  static get toolbox() {
    return {
      title: 'React Flow',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17V7M3 7H21M3 7L7 3H17L21 7M21 17V7M21 17H3M21 17L17 21H7L3 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
  }

  constructor({ api }: { api: API }) {
    this.api = api;
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('reactflow-block');
    this.wrapper.style.height = '500px';
  }

  render() {
    const root = createRoot(this.wrapper);
    root.render(createElement(MindMap));
    return this.wrapper;
  }

  save() {
    return {
      type: 'mindmap'
    };
  }

  validate(savedData: any) {
    return savedData.type === 'mindmap';
  }
}
