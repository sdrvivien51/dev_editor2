
import { API, BlockTool, BlockToolData } from '@editorjs/editorjs';

interface EmbedData {
  service?: string;
  url?: string;
  embed?: string;
  width?: number;
  height?: number;
  caption?: string;
}

interface Pattern {
  regex: RegExp;
  embedUrl: string;
  html: string;
  height: number;
  width?: number;
  id?: (groups: string[]) => string;
}

export default class EmbedTool implements BlockTool {
  private api: API;
  private data: EmbedData;
  private services: { [key: string]: Pattern };

  static get toolbox() {
    return {
      title: 'Embed',
      icon: '<svg width="13" height="14" viewBox="0 0 13 14"><path d="M8.567 13.629c.728.464 1.581.65 2.41.558l-.873.873A3.722 3.722 0 1 1 4.84 9.794L6.694 7.94a3.722 3.722 0 0 1 5.256-.008L10.484 9.4a5.209 5.209 0 0 1-.017.016 1.625 1.625 0 0 0-2.29.009l-1.854 1.854a1.626 1.626 0 0 0 2.244 2.35zm2.766-7.358a3.722 3.722 0 0 0-5.256.008L7.422 4.824a5.2 5.2 0 0 1 .017-.016 1.625 1.625 0 0 0 2.29-.009l1.854-1.854a1.626 1.626 0 0 0-2.244-2.35L7.783.987c-.728-.464-1.581-.65-2.41-.558l.873-.873a3.722 3.722 0 1 1 5.256 5.266L9.649 6.674z"/></svg>'
    };
  }

  constructor({ data, api }: { data: BlockToolData<EmbedData>; api: API }) {
    this.api = api;
    this.data = data;

    this.services = {
      youtube: {
        regex: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\/\?\&]*)/,
        embedUrl: 'https://www.youtube.com/embed/<%= remote_id %>',
        html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
        height: 320
      },
      twitter: {
        regex: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\/.*)?$/,
        embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=<%= remote_id %>',
        html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
        height: 320
      },
      instagram: {
        regex: /https?:\/\/www.instagram.com\/p\/([^\/\?\&]*)/,
        embedUrl: 'https://www.instagram.com/p/<%= remote_id %>/embed',
        html: '<iframe width="400" height="505" style="border: none; overflow: hidden;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
        height: 505,
        width: 400
      }
    };
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('embed-tool');

    if (!this.data.embed) {
      const input = document.createElement('input');
      input.placeholder = 'Paste your link here...';
      input.classList.add('embed-tool__input');
      
      input.addEventListener('input', (event) => {
        const text = (event.target as HTMLInputElement).value;
        if (text) {
          this.embedUrlHandle(text, wrapper);
        }
      });
      
      input.addEventListener('paste', (event) => {
        event.preventDefault();
        const text = event.clipboardData?.getData('text');
        if (text) {
          this.embedUrlHandle(text, wrapper);
        }
      });

      wrapper.appendChild(input);
    } else {
      wrapper.innerHTML = this.data.embed;
    }

    return wrapper;
  }

  private embedUrlHandle(url: string, wrapper: HTMLElement) {
    for (const service in this.services) {
      const pattern = this.services[service];
      const match = url.match(pattern.regex);

      if (match) {
        const remote_id = pattern.id ? pattern.id(match.slice(1)) : match[1];
        const embedUrl = pattern.embedUrl.replace('<%= remote_id %>', remote_id);
        
        const html = `<iframe 
          width="100%" 
          height="${pattern.height}" 
          src="${embedUrl}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>`;
        
        if (pattern.width) {
          html.replace('width="100%"', `width="${pattern.width}"`);
        }

        this.data = {
          service,
          url,
          embed: html
        };

        wrapper.innerHTML = html;
        return;
      }
    }
  }

  save(blockContent: HTMLElement) {
    return this.data;
  }

  validate(savedData: BlockToolData<EmbedData>) {
    return savedData.embed?.length > 0;
  }
}
