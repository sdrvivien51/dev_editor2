
import { API, BlockTool } from '@editorjs/editorjs';

export default class EmbedTool implements BlockTool {
  private api: API;
  private data: any;
  private wrapper: HTMLElement;
  private embedPreview: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Embed',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><path d="M0.28 3.38v7.25c0 1.75 1.4 3.15 3.15 3.15h10.15c1.75 0 3.15-1.4 3.15-3.15V3.38c0-1.75-1.4-3.15-3.15-3.15H3.42C1.68 0.22 0.28 1.62 0.28 3.38zm1.85 0c0-0.75 0.6-1.35 1.35-1.35h10.15c0.75 0 1.35 0.6 1.35 1.35v7.25c0 0.75-0.6 1.35-1.35 1.35H3.42c-0.75 0-1.35-0.6-1.35-1.35V3.38z"/></svg>'
    };
  }

  constructor({ data, api }: { data: any; api: API }) {
    this.api = api;
    this.data = data;
    this.wrapper = document.createElement('div');
  }

  render() {
    this.wrapper.innerHTML = '';
    const input = document.createElement('input');
    input.className = 'embed-tool__input';
    input.placeholder = 'Paste an embed URL...';
    input.value = this.data?.url || '';
    
    input.addEventListener('paste', () => {
      setTimeout(() => this._createPreview(input.value), 100);
    });

    input.addEventListener('change', () => {
      this._createPreview(input.value);
    });

    this.wrapper.appendChild(input);
    
    if (this.data?.url) {
      this._createPreview(this.data.url);
    }

    return this.wrapper;
  }

  _createPreview(url: string) {
    if (this.embedPreview) {
      this.embedPreview.remove();
      this.embedPreview = null;
    }

    if (!url) return;

    this.embedPreview = document.createElement('div');
    this.embedPreview.className = 'embed-tool__content';
    this.embedPreview.style.position = 'relative';
    this.embedPreview.style.paddingTop = '56.25%';
    
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.setAttribute('allowfullscreen', 'true');
    
    this.embedPreview.appendChild(iframe);
    this.wrapper.appendChild(this.embedPreview);
  }

  save() {
    const input = this.wrapper.querySelector('input');
    return {
      url: input?.value || ''
    };
  }

  validate(savedData: any) {
    return Boolean(savedData.url && savedData.url.trim());
  }
}
