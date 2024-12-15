import React from 'react';
import EditorJS, { OutputData as EditorData } from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import './Chart/Chart.css';

type OutputData = EditorData;

interface EditorProps {
  data: OutputData;
  setData: (data: OutputData) => void;
}

export default function Editor({ data, setData }: EditorProps) {
  const editorRef = React.useRef<EditorJS | null>(null);

  React.useEffect(() => {
    const initEditor = async () => {
      if (!editorRef.current) {
        const editor = new EditorJS({
          holder: 'editor',
          tools: EDITOR_JS_TOOLS,
          data,
          onChange: async () => {
            const savedData = await editor.save();
            setData(savedData);
          },
        });
        
        await editor.isReady;
        editorRef.current = editor;
      }
    };

    initEditor().catch(console.error);

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative min-h-[500px] w-full border rounded-md">
      <div id="editor" className="prose max-w-none" />
    </div>
  );
}
