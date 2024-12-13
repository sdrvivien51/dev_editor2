import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { editorConfig } from "@/lib/editor";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Editor() {
  const editorRef = useRef<EditorJS>();
  const { toast } = useToast();
  
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save post");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Post saved successfully" });
    },
  });

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS(editorConfig);
    }
    return () => {
      editorRef.current?.destroy();
    };
  }, []);

  const handleSave = async () => {
    const data = await editorRef.current?.save();
    saveMutation.mutate(data);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <Input
          className="text-2xl font-bold mb-4"
          placeholder="Post Title"
        />
      </div>
      <div id="editorjs" className="min-h-[500px]" />
      <div className="mt-6">
        <Button onClick={handleSave}>
          Publish Post
        </Button>
      </div>
    </Card>
  );
}
