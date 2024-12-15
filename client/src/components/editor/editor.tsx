
import { useRef, useCallback } from "react";
import { createReactEditorJS } from "react-editor-js";
import type EditorJS, { OutputData } from '@editorjs/editorjs';
import { Chart, registerables } from 'chart.js/auto';
Chart.register(...registerables);
import type { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
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


interface EditorProps {
  data: OutputData;
  setData: (data: OutputData) => void;
}

type EditorCore = EditorJS & {
  isReady: Promise<void>;
};

import TradingViewTool from './tool/TradingViewTool';
import ChartTool from './tool/ChartTool';

const EDITOR_JS_TOOLS = {
  tradingview: {
    class: TradingViewTool,
    inlineToolbar: true,
    config: {
      height: 400
    }
  },
  chart: {
    class: ChartTool,
    inlineToolbar: true,
    icon: '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">',
    config: {
      height: 400
    }
  },
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: 'Entrez un titre',
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2
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
    } as ListConfig
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
    } as QuoteConfig
  },
  code: {
    class: Code,
    config: {
      placeholder: 'Entrez du code'
    } as CodeConfig
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
    } as LinkToolConfig
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
    } as ImageToolConfig
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        codesandbox: true,
        codepen: true
      }
    } as EmbedToolConfig
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3
    } as TableConfig
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    config: {
      titlePlaceholder: 'Titre',
      messagePlaceholder: 'Message'
    } as WarningConfig
  },
  marker: {
    class: Marker,
    inlineToolbar: true
  },
  raw: {
    class: Raw,
    config: {
      placeholder: 'Entrez du HTML brut'
    } as RawConfig
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
    } as AttachesConfig
  },
  simpleImage: {
    class: SimpleImage
  }
};

export default function Editor({ data, setData }: EditorProps) {
  const editorCore = useRef<EditorCore | null>(null);
  const ReactEditorJS = createReactEditorJS();

  const handleInitialize = useCallback((instance: EditorCore) => {
    if (!instance) return;
    
    instance.isReady
      .then(() => {
        editorCore.current = instance;
      })
      .catch((err: Error) => console.error("Editor initialization error:", err));
  }, []);

  const handleSave = useCallback(async () => {
    if (!editorCore.current) {
      console.error("Editor instance not initialized");
      return;
    }
    
    try {
      const savedData = await editorCore.current.save();
      setData(savedData);
    } catch (err) {
      console.error("Failed to save editor data:", err);
    }
  }, [setData]);

  return (
    <div className="editor-container">
      <h4 className="edit-mode-alert">Mode édition activé</h4>
      <ReactEditorJS
        onInitialize={handleInitialize}
        tools={EDITOR_JS_TOOLS}
        onChange={handleSave}
        defaultValue={data}
      />
    </div>
  );
}
