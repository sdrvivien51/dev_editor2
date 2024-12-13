import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';
import mermaid from 'mermaid';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { MermaidConfig } from '@/components/editor/MermaidConfig';

export interface MermaidData {
  type: 'flowchart' | 'sequence' | 'mindmap';
  code: string;
  caption: string;
}

export default class MermaidTool implements BlockTool {
  private api: API;
  private data: MermaidData;
  private container: HTMLElement;
  private configRoot: HTMLElement;

  static get toolbox() {
    return {
      title: 'Mermaid',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17V7M3 7H21M3 7L7 3H17L21 7M21 17V7M21 17H3M21 17L17 21H7L3 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
  }

  constructor({ data, api }: { data: BlockToolData<MermaidData>; api: API }) {
    this.api = api;
    this.data = data;
    this.container = document.createElement('div');
    this.container.classList.add('mermaid-block');
    
    this.configRoot = document.createElement('div');
    this.configRoot.classList.add('mermaid-config-root');

    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'w-full', 'min-h-[200px]', 'p-4', 'border', 'rounded-lg');
    
    if (this.data?.code) {
      const mermaidContainer = document.createElement('div');
      mermaidContainer.classList.add('mermaid');
      mermaidContainer.textContent = this.data.code;
      wrapper.appendChild(mermaidContainer);
      
      // Render the diagram
      mermaid.run({ nodes: [mermaidContainer] });
    }

    // Add configuration interface
    wrapper.appendChild(this.configRoot);
    const root = createRoot(this.configRoot);
    root.render(createElement(MermaidConfig, {
      onSave: (config: MermaidData) => {
        this.data = config;
        
        // Clear and re-render the diagram
        wrapper.querySelector('.mermaid')?.remove();
        const newMermaidContainer = document.createElement('div');
        newMermaidContainer.classList.add('mermaid');
        newMermaidContainer.textContent = config.code;
        wrapper.insertBefore(newMermaidContainer, this.configRoot);
        
        mermaid.run({ nodes: [newMermaidContainer] });
      }
    }));

    return wrapper;
  }

  save() {
    return {
      caption: this.data?.caption || '',
      code: this.data?.code || '',
      type: this.data?.type || 'mindmap'
    };
  }

  validate(data: BlockToolData<MermaidData>) {
    return data?.code?.length > 0;
  }
}
