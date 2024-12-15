
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import EditorJS from "@editorjs/editorjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { editorConfig } from "@/lib/editor";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "../components/editor/ImageUpload";

export default function Editor() {
  const editorRef = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      setLocation("/");
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
    let isMounted = true;
    let destroyTimer: number;

    const initEditor = async () => {
      if (!isMounted) return;
      
      const editorElement = document.getElementById('editorjs');
      if (!editorElement || editorRef.current) return;

      try {
        const editor = new EditorJS({
          ...createEditorConfig(editorElement),
          data: {
            time: Date.now(),
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: "Start writing your amazing post..."
                }
              }
            ]
          },
          onReady: () => {
            console.log('Editor.js is ready to work!');
          },
          onChange: async () => {
            if (editorRef.current) {
              try {
                const content = await editorRef.current.save();
                console.log('Content changed:', content);
              } catch (error) {
                console.error('Save error:', error);
              }
            }
          },
        });

        await editor.isReady;
        if (isMounted) {
          editorRef.current = editor;
        }
      } catch (error) {
        console.error('Editor.js initialization error:', error);
      }
    };

    // Ensure DOM is ready before initialization
    if (document.readyState === 'complete') {
      initEditor();
    } else {
      destroyTimer = window.setTimeout(initEditor, 100);
    }

    return () => {
      isMounted = false;
      if (destroyTimer) {
        clearTimeout(destroyTimer);
      }
      if (editorRef.current) {
        editorRef.current.destroy()
          .catch(e => console.error('Editor destroy error:', e));
        editorRef.current = null;
      }
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
    <div className="max-w-[600px] mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>New Post</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? "Saving..." : "Save Post"}
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          className="text-4xl font-bold border-none px-0 focus-visible:ring-0"
          placeholder="Enter your post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          className="text-lg border-none px-0 focus-visible:ring-0 resize-none"
          placeholder="Add a brief description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <ImageUpload />
      </div>

      <Separator className="my-8" />
      
      <div id="editorjs" className="prose max-w-none" />
    </div>
  );
}
