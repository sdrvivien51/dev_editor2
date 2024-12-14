
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
        youtube: {
          regex: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)/,
          embedUrl: 'https://www.youtube.com/embed/{{remote_id}}',
          html: '<iframe width="560" height="315" src="{{embedUrl}}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
          height: 315,
          width: 560,
          id: (groups) => groups[1]
        },
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
