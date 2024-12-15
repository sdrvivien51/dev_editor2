
import CheckList from '@editorjs/checklist'
import Code from '@editorjs/code'
import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Image from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import LinkTool from '@editorjs/link'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import Quote from '@editorjs/quote'
import Raw from '@editorjs/raw'
import SimpleImage from '@editorjs/simple-image'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'
import Header from '@editorjs/header'
import Paragraph from '@editorjs/paragraph'
import ChartTool from './Chart/ChartTool'
import MermaidTool from 'editorjs-mermaid'
import './Chart/Chart.css'
import TradingViewTool from './TradingView/TradingViewTool'
import './TradingView/TradingView.css'
import Tooltip from 'editorjs-tooltip'

export const EDITOR_JS_TOOLS: { [key: string]: any } = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: ['bold', 'italic', 'marker', 'inlineCode', 'link' ],
  },
  tooltip: {
    class: Tooltip,
    config: {
      location: 'left',
      underline: true,
      placeholder: 'Add tooltip text',
      highlightColor: '#F8F9FA',
      backgroundColor: '#1F2937',
      textColor: '#FFFFFF',
      holder: 'editorjs-container'
    }
  },
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a header',
      levels: [2, 3, 4, 5, 6],
      defaultLevel: 2
    }
  },
  embed: Embed,
  table: Table,
  list: List,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: Image,
  raw: Raw,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  tradingview: TradingViewTool,
  chart: {
    class: ChartTool,
    inlineToolbar: true,
    config: {
      placeholder: 'Add a chart'
    }
  },
  mermaid: {
    class: MermaidTool,
    config: {
      theme: 'neutral'
    }
  },
  Marker: {
    class: Marker,
    shortcut: 'CMD+SHIFT+M',
    config: {
      shortcut: 'CMD+M',
      sanitize: {
        mark: {
          class: 'cdx-marker'
        }
      }
    }
  }
}
