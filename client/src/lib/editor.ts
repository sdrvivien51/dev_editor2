import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import { type EditorConfig } from '@editorjs/editorjs';
import { supabase } from './supabase';
import ChartTool from './ChartTool';
import TradingViewTool from './TradingViewTool';

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
