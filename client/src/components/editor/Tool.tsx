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
import Paragraph from '@editorjs/paragraph'
import ChartTool from './Chart/ChartTool'
import TradingViewTool from './TradingView/TradingViewTool'
import './Chart/Chart.css'
import './TradingView/TradingView.css'

// We use any here because some Editor.js tools don't have proper TypeScript definitions
export const EDITOR_JS_TOOLS: { [key: string]: any } = {
  paragraph: Paragraph,
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
  chart: {
    class: ChartTool,
    inlineToolbar: true,
    config: {
      placeholder: 'Add a chart'
    }
  },
  tradingview: {
    class: TradingViewTool,
    inlineToolbar: true,
    config: {
      placeholder: 'Add TradingView widget'
    }
  }
}