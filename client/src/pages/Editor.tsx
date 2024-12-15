import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Editor() {
  const editorRef = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const saveMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: OutputData }) => {
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
    // Wait for DOM to be ready
    const initEditor = async () => {
      // Check if editor element exists
      const editorElement = document.getElementById('editorjs');
      if (!editorElement) {
        console.error('Editor element not found');
        return;
      }

      // Destroy existing instance if any
      if (editorRef.current) {
        try {
          await editorRef.current.destroy();
          editorRef.current = null;
        } catch (e) {
          console.error('Error destroying editor:', e);
        }
      }

      try {
        const editor = new EditorJS({
          holder: 'editorjs',
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [2, 3, 4],
                defaultLevel: 2
              }
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              }
            },
            embed: {
              class: Embed,
              inlineToolbar: true,
              config: {
                services: {
                  youtube: true,
                  codesandbox: true,
                  codepen: true
                }
              }
            }
          },
          placeholder: 'Start writing your post...',
          minHeight: 200,
          onChange: async () => {
            try {
              const data = await editor.save();
              console.log('Content changed:', data);
            } catch (e) {
              console.error('Error saving editor content:', e);
            }
          }
        });

        // Wait for editor to be ready
        await editor.isReady;
        editorRef.current = editor;
        setIsEditorReady(true);
        console.log('Editor initialized successfully');
      } catch (error) {
        console.error('Editor initialization error:', error);
        toast({
          title: "Editor initialization failed",
          description: "Please refresh the page and try again",
          variant: "destructive"
        });
      }
    };

    // Initialize editor with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(initEditor, 100);

    return () => {
      clearTimeout(timeoutId);
      // Cleanup
      if (editorRef.current) {
        const cleanup = async () => {
          try {
            await editorRef.current?.destroy();
            editorRef.current = null;
          } catch (e) {
            console.error('Error during cleanup:', e);
          }
        };
        cleanup();
      }
    };
  }, [toast]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title is required",
        description: "Please add a title to your post",
        variant: "destructive"
      });
      return;
    }

    if (!isEditorReady || !editorRef.current) {
      toast({
        title: "Editor not ready",
        description: "Please wait for the editor to initialize",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const content = await editorRef.current.save();
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
          disabled={isLoading || !title.trim() || !isEditorReady}
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
      </div>

      <Separator className="my-8" />
      
      <div id="editorjs" className="prose max-w-none min-h-[200px]" />
    </div>
  );
}
