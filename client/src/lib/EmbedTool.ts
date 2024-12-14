
import { type OutputData } from "@editorjs/editorjs";

class EmbedTool {
  data: any;
  wrapper: HTMLElement;
  config: any;

  static get toolbox() {
    return {
      title: 'Embed',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  static get services() {
    return {
      facebook: {
        regex: /https?:\/\/www.facebook.com\/([^\/\?\&]*)\/(videos|posts)\/([^\/\?\&]*)/,
        embedUrl: 'https://www.facebook.com/plugins/post.php?href=<%= remote_id %>',
        html: '<iframe style="border: none; overflow: hidden;" width="100%" height="320" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>',
        height: 320
      },
      instagram: {
        regex: /https?:\/\/www.instagram.com\/p\/([^\/\?\&]*)/,
        embedUrl: 'https://www.instagram.com/p/<%= remote_id %>/embed',
        html: '<iframe width="400" height="505" style="border: none; overflow: hidden;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
        height: 505,
        width: 400
      },
      youtube: {
        regex: /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch))(?:(?:\?v=)?([^#&?]*))/,
        embedUrl: 'https://www.youtube.com/embed/<%= remote_id %>',
        html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
        height: 320
      },
      twitter: {
        regex: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\/.*)?$/,
        embedUrl: 'https://twitframe.com/show?url=<%= remote_id %>',
        html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
        height: 320
      },
      twitch: {
        regex: /(?:www\.)?twitch\.tv\/(?:videos\/(\d+)|clips\/(\w+)|[^\/\?\&]*)/,
        embedUrl: 'https://player.twitch.tv/?<%= remote_id %>&parent=' + window.location.hostname,
        html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
        height: 320
      },
      miro: {
        regex: /https:\/\/miro.com\/app\/board\/([^\/\?\&]*)/,
        embedUrl: 'https://miro.com/app/live-embed/<%= remote_id %>',
        html: '<iframe style="width:100%;" height="500" frameborder="0" scrolling="no" allowfullscreen></iframe>',
        height: 500
      },
      vimeo: {
        regex: /(?:http[s]?:\/\/)?(?:www.)?(?:player.)?vimeo\.com\/(?:[a-z]*\/)*([0-9]{6,11})[?]?.*/,
        embedUrl: 'https://player.vimeo.com/video/<%= remote_id %>',
        html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
        height: 320
      },
      gfycat: {
        regex: /https?:\/\/gfycat\.com\/(?:fr\/)?(?:gifs\/)?(?:detail\/)?(\w+)(?:-size_restricted)?(?:\.gif)?/,
        embedUrl: 'https://gfycat.com/ifr/<%= remote_id %>',
        html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
        height: 320
      },
      imgur: {
        regex: /https?:\/\/(?:i\.)?imgur\.com(?:\/a|\/gallery)?\/([a-zA-Z0-9]+)(?:\.gifv)?/,
        embedUrl: 'https://imgur.com/<%= remote_id %>/embed',
        html: '<iframe style="width:100%;" height="500" frameborder="0" allowfullscreen></iframe>',
        height: 500
      },
      codepen: {
        regex: /https?:\/\/codepen\.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
        embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
        html: '<iframe height="300" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width:100%;"></iframe>',
        height: 300,
        width: 600,
        id: (groups) => groups.join('/embed/')
      },
      pinterest: {
        regex: /https?:\/\/(?:www\.)?pinterest\.com\/pin\/([^\/\?\&]*)/,
        embedUrl: 'https://assets.pinterest.com/ext/embed.html?id=<%= remote_id %>',
        html: '<iframe style="width:100%;" height="500" frameborder="0" allowfullscreen></iframe>',
        height: 500
      },
      github: {
        regex: /https?:\/\/gist\.github\.com\/([^\/\?\&]*)\/([^\/\?\&]*)/,
        embedUrl: 'https://gist.github.com/<%= remote_id %>.js',
        html: '<script src="<%= remote_id %>"></script>',
        height: 'auto',
        id: (groups) => groups.join('/')
      }
    };
  }

  constructor({ data, config, api }) {
    this.data = {
      service: data.service || '',
      source: data.source || '',
      embed: data.embed || '',
      width: data.width || 600,
      height: data.height || 320,
      caption: data.caption || ''
    };
    this.wrapper = undefined;
    this.config = config;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('embed-tool');

    if (this.data.embed) {
      this._createIframe();
    }

    return this.wrapper;
  }

  _createIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = this.data.embed;
    iframe.style.width = '100%';
    iframe.height = this.data.height;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    this.wrapper.appendChild(iframe);
  }

  save() {
    return this.data;
  }
}

export default EmbedTool;
