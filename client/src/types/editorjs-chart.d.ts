declare module '@editorjs/editorjs' {
  interface BlockToolData {
    chartType?: string;
    chartData?: any;
  }
}

declare module 'editorjs-chart' {
  import { BlockTool, BlockToolData } from '@editorjs/editorjs';
  export default class Chart implements BlockTool {
    constructor(options: any);
    render(): HTMLElement;
    save(): BlockToolData;
    validate(data: BlockToolData): boolean;
  }
}
