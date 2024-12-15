declare module '@editorjs/header' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface HeaderConfig {
    placeholder?: string;
    levels?: number[];
    defaultLevel?: number;
  }
  export interface HeaderData {
    text: string;
    level: number;
  }
  const Header: BlockToolConstructable<HeaderData, HeaderConfig>;
  export default Header;
}

declare module '@editorjs/paragraph' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface ParagraphData {
    text: string;
  }
  export interface ParagraphConfig {
    placeholder?: string;
  }
  const Paragraph: BlockToolConstructable<ParagraphData, ParagraphConfig>;
  export default Paragraph;
}

declare module '@editorjs/list' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface ListData {
    style: 'ordered' | 'unordered';
    items: string[];
  }
  export interface ListConfig {
    defaultStyle?: 'ordered' | 'unordered';
  }
  const List: BlockToolConstructable<ListData, ListConfig>;
  export default List;
}

declare module '@editorjs/nested-list' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  const NestedList: BlockToolConstructable;
  export default NestedList;
}

declare module '@editorjs/checklist' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface ChecklistData {
    items: Array<{
      text: string;
      checked: boolean;
    }>;
  }
  const Checklist: BlockToolConstructable<ChecklistData>;
  export default Checklist;
}

declare module '@editorjs/quote' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface QuoteData {
    text: string;
    caption?: string;
    alignment?: 'left' | 'center';
  }
  export interface QuoteConfig {
    quotePlaceholder?: string;
    captionPlaceholder?: string;
  }
  const Quote: BlockToolConstructable<QuoteData, QuoteConfig>;
  export default Quote;
}

declare module '@editorjs/code' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface CodeData {
    code: string;
  }
  export interface CodeConfig {
    placeholder?: string;
  }
  const Code: BlockToolConstructable<CodeData, CodeConfig>;
  export default Code;
}

declare module '@editorjs/delimiter' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  const Delimiter: BlockToolConstructable;
  export default Delimiter;
}

declare module '@editorjs/inline-code' {
  import { InlineTool, InlineToolConstructable } from '@editorjs/editorjs';
  const InlineCode: InlineToolConstructable;
  export default InlineCode;
}

declare module '@editorjs/marker' {
  import { InlineTool, InlineToolConstructable } from '@editorjs/editorjs';
  const Marker: InlineToolConstructable;
  export default Marker;
}

declare module '@editorjs/link' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface LinkToolData {
    link: string;
    meta?: {
      title?: string;
      description?: string;
      image?: {
        url: string;
      };
    };
  }
  export interface LinkToolConfig {
    endpoint?: string;
  }
  const LinkTool: BlockToolConstructable<LinkToolData, LinkToolConfig>;
  export default LinkTool;
}

declare module '@editorjs/image' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface ImageToolData {
    url: string;
    caption?: string;
    withBorder?: boolean;
    withBackground?: boolean;
    stretched?: boolean;
  }
  export interface ImageToolConfig {
    uploader?: {
      uploadByFile(file: File): Promise<{success: number; file: {url: string}}>;
      uploadByUrl?(url: string): Promise<{success: number; file: {url: string}}>;
    };
    field?: string;
    types?: string;
  }
  const Image: BlockToolConstructable<ImageToolData, ImageToolConfig>;
  export default Image;
}

declare module '@editorjs/embed' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface EmbedToolData {
    service: string;
    source: string;
    embed: string;
    width?: number;
    height?: number;
    caption?: string;
  }
  export interface EmbedToolConfig {
    services: {
      [service: string]: {
        regex: RegExp;
        height?: number;
        width?: number;
      };
    };
  }
  const Embed: BlockToolConstructable<EmbedToolData, EmbedToolConfig>;
  export default Embed;
}

declare module '@editorjs/table' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface TableData {
    content: string[][];
  }
  export interface TableConfig {
    rows?: number;
    cols?: number;
  }
  const Table: BlockToolConstructable<TableData, TableConfig>;
  export default Table;
}

declare module '@editorjs/warning' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface WarningData {
    title: string;
    message: string;
  }
  export interface WarningConfig {
    titlePlaceholder?: string;
    messagePlaceholder?: string;
  }
  const Warning: BlockToolConstructable<WarningData, WarningConfig>;
  export default Warning;
}

declare module '@editorjs/raw' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface RawData {
    html: string;
  }
  export interface RawConfig {
    placeholder?: string;
  }
  const Raw: BlockToolConstructable<RawData, RawConfig>;
  export default Raw;
}

declare module '@editorjs/attaches' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface AttachesData {
    file: {
      url: string;
      name: string;
      size: number;
    };
    title: string;
  }
  export interface AttachesConfig {
    uploader: {
      uploadByFile(file: File): Promise<{
        success: number;
        file: { url: string; name: string; size: number };
      }>;
    };
  }
  const Attaches: BlockToolConstructable<AttachesData, AttachesConfig>;
  export default Attaches;
}

declare module '@editorjs/simple-image' {
  import { BlockTool, BlockToolConstructable } from '@editorjs/editorjs';
  export interface SimpleImageData {
    url: string;
    caption?: string;
  }
  const SimpleImage: BlockToolConstructable<SimpleImageData>;
  export default SimpleImage;
}
