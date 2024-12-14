
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import { type EditorConfig } from '@editorjs/editorjs';
import { supabase } from './supabase';
import ChartTool from './ChartTool';
import TradingViewTool from './TradingViewTool';
import EmbedTool from './EmbedTool';

export const editorConfig: Partial<EditorConfig> = {
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
      config: {
        levels: [1, 2, 3, 4],
        defaultLevel: 2
      }
    },
    list: {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered'
      }
    },
    chart: {
      class: ChartTool,
      inlineToolbar: true,
    },
    tradingview: {
      class: TradingViewTool,
      inlineToolbar: false,
    },
    embed: {
      class: EmbedTool,
      inlineToolbar: true,
      config: {
        services: {
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
            embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=<%= remote_id %>',
            html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
            height: 320
          },
          twitch: {
            regex: /(?:www\.)?twitch\.tv\/(?:videos\/(\d+)|clips\/(\w+)|[^\/\?\&]*)/,
            embedUrl: 'https://player.twitch.tv/?<%= remote_id %>&parent=' + window.location.hostname,
            html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
            height: 320
          },
          codesandbox: {
            regex: /https?:\/\/codesandbox\.io\/(?:s|p\/devbox)\/([^\/\?\&]*)/,
            embedUrl: 'https://codesandbox.io/embed/<%= remote_id %>',
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
          }
        }
      }
    },
    image: {
      class: Image,
      config: {
        uploader: {
          async uploadByFile(file: File) {
            try {
              const { data, error } = await supabase.storage
                .from('blog-images')
                .upload(`${Date.now()}-${file.name}`, file);

              if (error) throw error;

              const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(data.path);

              return {
                success: 1,
                file: {
                  url: publicUrl,
                }
              };
            } catch (error) {
              console.error('Image upload failed:', error);
              return {
                success: 0,
                error: 'Image upload failed'
              };
            }
          }
        }
      }
    }
  },
  placeholder: 'Let\'s write an awesome story!',
  autofocus: true,
  inlineToolbar: true,
};
