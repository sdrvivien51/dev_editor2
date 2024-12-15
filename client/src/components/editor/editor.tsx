import React from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import './Chart/Chart.css';
import './editor.css';

interface EditorProps {
  data: EditorJS.OutputData;
  setData: (data: EditorJS.OutputData) => void;
}

export default function Editor({ data, setData }: EditorProps) {
  const editorRef = React.useRef<EditorJS | null>(null);
  const holderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (editorRef.current || !holderRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      tools: EDITOR_JS_TOOLS,
      inlineToolbar: true,
      data,
      onReady: () => {
        MermaidTool.config({ theme: 'neutral' });
      },
      onChange: async () => {
        try {
          const savedData = await editor.save();
          setData(savedData);
        } catch (error) {
          console.error('Editor save error:', error);
        }
      },
    });

    editor.isReady
      .then(() => {
        editorRef.current = editor;
      })
      .catch(console.error);

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative min-h-[500px] w-full border rounded-md">
      <div ref={holderRef} id="editorjs-container" className="prose max-w-none" />
    </div>
  );
}