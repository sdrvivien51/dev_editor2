
import { API, BlockTool } from '@editorjs/editorjs';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import MindMap from '@/components/mindmap/MindMap';
import { ReactFlowProvider } from '@xyflow/react';

export default class ReactFlowTool implements BlockTool {
  private api: API;
  private wrapper: HTMLElement;
  private root: ReturnType<typeof createRoot> | null = null;

  static get toolbox() {
    return {
      title: 'Flow Chart',
      icon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8V5H7V8H3Z M17 8V5H21V8H17Z M10 19V16H14V19H10Z M10 12L17 8 M7 8L10 12 M10 12V16"/></svg>'
    };
  }

  constructor({ api }: { api: API }) {
    this.api = api;
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('reactflow-block');
    this.wrapper.style.width = '100%';
    this.wrapper.style.height = '400px';
  }

  render() {
    this.root = createRoot(this.wrapper);
    this.root.render(
      createElement(ReactFlowProvider, null,
        createElement(MindMap)
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
      flowchart: true
    };
  }

  validate(savedData: any) {
    return savedData.flowchart === true;
  }
}
