import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import MindMap from '@/components/mindmap/MindMap';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default class MindMapTool implements BlockTool {
  private api: API;
  private wrapper: HTMLElement;
  private root: ReturnType<typeof createRoot> | null = null;

  static get toolbox() {
    return {
      title: 'Mind Map',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17V7M3 7H21M3 7L7 3H17L21 7M21 17V7M21 17H3M21 17L17 21H7L3 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
  }

  constructor({ api }: { api: API }) {
    this.api = api;
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('mindmap-block');
  }

  render() {
    this.root = createRoot(this.wrapper);
    this.root.render(
      createElement(ReactFlowProvider, null,
        createElement('div', { style: { width: '100%', height: '500px' } },
          createElement(MindMap)
        )
      )
    );
    return this.wrapper;
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
    }
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