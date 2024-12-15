import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import { ChartTool } from './ChartTool';
import { TradingViewTool } from './TradingViewTool';

export interface EditorConfig {
  holder: string;
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  readOnly?: boolean;
}

export const createEditorConfig = ({ holder, data, onChange, readOnly = false }: EditorConfig): any => {
  return {
    holder,
    readOnly,
    tools: {
      header: {
        class: Header,
        inlineToolbar: ['link'],
        config: {
          placeholder: 'Enter a header',
          levels: [1, 2, 3],
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
      embed: {
        class: Embed,
        inlineToolbar: true,
        config: {
          services: {
            youtube: true,
            codesandbox: true,
            codepen: true
          }
        }
      },
      image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile(file: File): Promise<{ success: number; file: { url: string } }> {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    success: 1,
                    file: {
                      url: reader.result as string
                    }
                  });
                };
                reader.readAsDataURL(file);
              });
            }
          },
          captionPlaceholder: 'Type caption (optional)'
        }
      },
      chart: {
        class: ChartTool,
        inlineToolbar: true,
        config: {
          placeholder: 'Add chart data'
        }
      },
      tradingview: {
        class: TradingViewTool,
        inlineToolbar: true,
        config: {
          placeholder: 'Add TradingView widget'
        }
      }
    },
    data: data || {
      time: Date.now(),
      blocks: [
        {
          type: "paragraph",
          data: {
            text: "Start writing your amazing post..."
          }
        }
      ],
      version: "2.28.2"
    },
    onReady: () => {
      console.log('Editor.js is ready to work!');
    },
    onChange: (data: OutputData) => {
      onChange?.(data);
      console.log('Content changed:', data);
    },
    autofocus: true,
    placeholder: 'Start writing your amazing post...',
    inlineToolbar: true
  };
};
