import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import EditorJS from "@editorjs/editorjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { editorConfig } from "@/lib/editor";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Editor() {
  const editorRef = useRef<EditorJS>();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const saveMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: any }) => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: JSON.stringify(content),
          published: true
        }),
      });
      if (!res.ok) throw new Error("Failed to save post");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Post published successfully" });
      setLocation("/"); // Redirect to home after successful save
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to publish post",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        ...editorConfig,
        placeholder: 'Start writing your post...',
        onChange: () => {
          // You can add auto-save functionality here
        }
      });
    }
    return () => {
      editorRef.current?.destroy();
    };
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title is required",
        description: "Please add a title to your post",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const content = await editorRef.current?.save();
      if (!content) throw new Error("No content to save");
      
      await saveMutation.mutateAsync({ title, content });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save the post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <Input
          className="text-3xl font-bold mb-4"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div id="editorjs" className="min-h-[500px] prose max-w-none" />
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" onClick={() => setLocation("/")}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? "Publishing..." : "Publish Post"}
        </Button>
      </div>
    </Card>
  );
}
