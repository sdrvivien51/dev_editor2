
import Header from "@editorjs/header";
import List from "@editorjs/list";

export const editorConfig = {
  holder: 'editorjs',
  tools: {
    header: {
      class: Header,
      inlineToolbar: ['bold', 'italic'],
      config: {
        placeholder: 'Enter a header',
        levels: [1, 2, 3],
        defaultLevel: 2
      }
    },
    list: {
      class: List,
      inlineToolbar: ['bold', 'italic'],
      config: {
        defaultStyle: 'unordered'
      }
    }
  },
  placeholder: 'Start writing your amazing post...',
  inlineToolbar: ['bold', 'italic'],
  autofocus: true,
  defaultBlock: 'paragraph'
};
