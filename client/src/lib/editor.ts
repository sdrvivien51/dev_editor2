
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import { ChartTool } from "./ChartTool";
import { TradingViewTool } from "./TradingViewTool";

export const createEditorConfig = (holder: HTMLElement) => ({
  holder,
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
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
          codepen: true,
        }
      }
    },
    image: {
      class: Image,
      inlineToolbar: true,
      config: {
        uploader: {
          uploadByFile(file: File) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({
                  success: 1,
                  file: {
                    url: reader.result
                  }
                });
              };
              reader.readAsDataURL(file);
            });
          }
        }
      }
    },
    chart: {
      class: ChartTool,
      inlineToolbar: true,
      config: {
        defaultStyle: 'bar'
      }
    },
    tradingview: {
      class: TradingViewTool,
      inlineToolbar: true,
      config: {
        defaultSymbol: 'NASDAQ:AAPL'
      }
    }
  },
  placeholder: 'Start writing your amazing post...',
  inlineToolbar: ['bold', 'italic'],
  autofocus: false,
  minHeight: 100,
  onChange: (api: any) => {
    console.log('Content changed');
  }
});
