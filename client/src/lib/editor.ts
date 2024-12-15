import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from "@editorjs/header";
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import Paragraph from "@editorjs/paragraph";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import Raw from "@editorjs/raw";
import Attaches from "@editorjs/attaches";
import SimpleImage from "@editorjs/simple-image";
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
      paragraph: {
        class: Paragraph,
        inlineToolbar: true
      },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered'
        }
      },
      nestedList: {
        class: NestedList,
        inlineToolbar: true
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author'
        }
      },
      code: {
        class: Code,
        config: {
          placeholder: 'Enter code'
        }
      },
      delimiter: {
        class: Delimiter
      },
      inlineCode: {
        class: InlineCode
      },
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: '/api/fetch-link'
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
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3
        }
      },
      warning: {
        class: Warning,
        inlineToolbar: true,
        config: {
          titlePlaceholder: 'Title',
          messagePlaceholder: 'Message'
        }
      },
      marker: {
        class: Marker,
        inlineToolbar: true
      },
      raw: {
        class: Raw,
        config: {
          placeholder: 'Enter raw HTML'
        }
      },
      attaches: {
        class: Attaches,
        config: {
          uploader: {
            uploadByFile(file: File): Promise<{ success: number; file: { url: string, name: string, size: number } }> {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    success: 1,
                    file: {
                      url: reader.result as string,
                      name: file.name,
                      size: file.size
                    }
                  });
                };
                reader.readAsDataURL(file);
              });
            }
          }
        }
      },
      simpleImage: {
        class: SimpleImage
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
