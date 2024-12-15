import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ChartTool from '@/components/editor/tool/ChartTool';
import List from '@editorjs/list';
import NestedList from '@editorjs/nested-list';
import Paragraph from '@editorjs/paragraph';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import Image from '@editorjs/image';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import Raw from '@editorjs/raw';
import Attaches from '@editorjs/attaches';
import SimpleImage from '@editorjs/simple-image';
import ChartTool from './ChartTool'; // Assuming ChartTool is in the same directory

export interface EditorConfig {
  holder: string;
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  readOnly?: boolean;
}

export const createEditorConfig = ({ holder, data, onChange, readOnly = false }: EditorConfig) => {
  return {
    holder,
    readOnly,
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
        config: {
          placeholder: 'Enter a title',
          levels: [1, 2, 3, 4, 5, 6],
          defaultLevel: 2
        }
      },
      chart: {
        class: ChartTool,
        inlineToolbar: false,
        config: {
          placeholder: 'Add chart data...'
        }
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        config: {
          placeholder: 'Commencez à écrire...'
        }
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
          quotePlaceholder: 'Entrez une citation',
          captionPlaceholder: 'Auteur de la citation'
        }
      },
      code: {
        class: Code,
        config: {
          placeholder: 'Entrez votre code ici'
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
            uploadByFile(file: File) {
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
          }
        }
      },
      embed: {
        class: Embed,
        config: {
          services: {
            youtube: {
              regex: /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
              height: 320,
              width: 580
            },
            codesandbox: {
              regex: /https?:\/\/codesandbox\.io\/s\/([a-zA-Z0-9_-]+)/,
              height: 500,
              width: '100%'
            },
            codepen: {
              regex: /https?:\/\/codepen\.io\/([^\/]+)\/pen\/([a-zA-Z0-9_-]+)/,
              height: 300,
              width: '100%'
            }
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
          titlePlaceholder: 'Titre',
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
          placeholder: 'Entrez du HTML brut'
        }
      },
      attaches: {
        class: Attaches,
        config: {
          uploader: {
            uploadByFile(file: File) {
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
      }
    },
    data: data || {
      time: Date.now(),
      blocks: [
        {
          type: "paragraph",
          data: {
            text: "Commencez à écrire votre article..."
          }
        }
      ],
      version: "2.28.2"
    },
    onReady: () => {
      console.log('Editor.js est prêt !');
    },
    onChange: async (api: EditorJS) => {
      const savedData = await api.saver.save();
      onChange?.(savedData);
    },
    autofocus: true,
    placeholder: 'Commencez à écrire votre article...',
    inlineToolbar: true
  };
};