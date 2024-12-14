
import React, { useRef, useCallback } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Tools";

interface EditorProps {
  data: any;
  setData: (data: any) => void;
}

export default function Editor({ data, setData }: EditorProps) {
  const editorCore = useRef(null);
  const ReactEditorJS = createReactEditorJS();

  const handleInitialize = useCallback((instance) => {
    instance._editorJS.isReady
      .then(() => {
        editorCore.current = instance;
      })
      .catch((err) => console.log("An error occurred", err));
  }, []);

  const handleSave = useCallback(async () => {
    const savedData = await editorCore.current.save();
    setData(savedData);
  }, [setData]);

  return (
    <div className="editor-container">
      <h4 className="edit-mode-alert">! Edit Mode Enabled</h4>
      <ReactEditorJS
        onInitialize={handleInitialize}
        tools={EDITOR_JS_TOOLS}
        onChange={handleSave}
        defaultValue={data}
      />
    </div>
  );
}
