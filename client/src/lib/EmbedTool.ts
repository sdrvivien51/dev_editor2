
import { API, BlockTool } from '@editorjs/editorjs';

export default class EmbedTool implements BlockTool {
  private api: API;
  private data: any;
  private element: HTMLElement;

  static get toolbox() {
    return {
      title: 'Embed',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><path d="M0.28 3.38v7.25c0 1.75 1.4 3.15 3.15 3.15h10.15c1.75 0 3.15-1.4 3.15-3.15V3.38c0-1.75-1.4-3.15-3.15-3.15H3.42C1.68 0.22 0.28 1.62 0.28 3.38zm1.85 0c0-0.75 0.6-1.35 1.35-1.35h10.15c0.75 0 1.35 0.6 1.35 1.35v7.25c0 0.75-0.6 1.35-1.35 1.35H3.42c-0.75 0-1.35-0.6-1.35-1.35V3.38z"/></svg>'
    };
  }

  static get services() {
    return {
      youtube: {
        regex: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        embedUrl: 'https://www.youtube.com/embed/<%= remote_id %>',
        html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>'
      },
      codepen: {
        regex: /https?:\/\/codepen\.io\/([^\/]+)\/pen\/([^\/]+)/,
        embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&default-tab=result',
        html: '<iframe height="300" style="width:100%;" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true"></iframe>'
      }
    };
  }

  constructor({ data, api }: { data: any; api: API }) {
    this.api = api;
    this.data = data;
    this.element = document.createElement('div');
  }

  render() {
    if (!this.data.service) {
      const input = document.createElement('input');
      input.classList.add('cdx-input');
      input.placeholder = 'Paste URL from YouTube, CodePen, etc...';
      input.type = 'url';
      
      input.addEventListener('paste', (event) => {
        const url = event.clipboardData?.getData('text');
        const service = Object.keys(EmbedTool.services).find((key) => 
          EmbedTool.services[key].regex.test(url)
        );
        
        if (service && url) {
          const matches = url.match(EmbedTool.services[service].regex);
          if (matches) {
            const remote_id = service === 'codepen' ? `${matches[1]}/embed/${matches[2]}` : matches[1];
            this.data = {
              service,
              source: url,
              embed: EmbedTool.services[service].embedUrl.replace('<%= remote_id %>', remote_id),
              width: 600,
              height: service === 'codepen' ? 300 : 320
            };
            this._createPreview();
          }
        }
      });

      this.element.appendChild(input);
      return this.element;
    }

    return this._createPreview();
  }

  private _createPreview() {
    this.element.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = this.data.embed;
    iframe.style.width = '100%';
    iframe.height = this.data.height;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
    
    this.element.appendChild(iframe);
    return this.element;
  }

  save() {
    return this.data;
  }

  validate(savedData: any) {
    return savedData.service && savedData.source;
  }
}
