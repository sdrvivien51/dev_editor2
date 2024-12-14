
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import ChartTool from "./ChartTool";
import TradingViewTool from "./TradingViewTool";

export const EDITOR_JS_TOOLS = {
  embed: {
    class: Embed,
    inlineToolbar: true,
    config: {
      services: {
        youtube: true,
        coub: true,
        codepen: true,
      }
    }
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      levels: [1, 2, 3, 4],
      defaultLevel: 2
    }
  },
  chart: {
    class: ChartTool,
    inlineToolbar: true,
  },
  tradingview: {
    class: TradingViewTool,
    inlineToolbar: false,
  }
};
