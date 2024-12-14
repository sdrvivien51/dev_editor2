
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ChartTool from '@/components/editor/ChartTool';
import TradingViewTool from '@/components/editor/TradingViewTool';
import EmbedTool from '@/components/editor/EmbedTool';

export const editorConfig = {
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
      inlineToolbar: true
    }
  },
  placeholder: 'Start writing your amazing post...'
};
