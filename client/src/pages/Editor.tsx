import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import EditorJS, { type OutputData, type API, type ToolConstructable, type BlockToolData } from "@editorjs/editorjs";
import Header from '@editorjs/header';
import List from '@editorjs/list';
import NestedList from '@editorjs/nested-list';
import Paragraph from '@editorjs/paragraph';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import Image from '@editorjs/image';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import Raw from '@editorjs/raw';
import Attaches from '@editorjs/attaches';
import SimpleImage from '@editorjs/simple-image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from 'react-dropzone';

interface EditorTools {
  [key: string]: {
    class: ToolConstructable;
    inlineToolbar?: boolean;
    config?: Record<string, unknown>;
  };
}

interface EditorInstance extends EditorJS {
  isReady: Promise<void>;
}

export default function Editor() {
  const editorRef = useRef<EditorInstance | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setBannerImage(file);
      const preview = URL.createObjectURL(file);
      setBannerPreview(preview);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });
  
  const saveMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: OutputData }) => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', JSON.stringify(content));
      formData.append('description', description);
      formData.append('published', 'true');
      
      if (bannerImage) {
        formData.append('banner', bannerImage);
      }
      
      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
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
    const initEditor = async () => {
      const editorElement = document.getElementById('editorjs');
      if (!editorElement) {
        console.error('Editor element not found');
        return;
      }

      if (editorRef.current) {
        try {
          await editorRef.current.destroy();
          editorRef.current = null;
        } catch (e) {
          console.error('Error destroying editor:', e);
        }
      }

      try {
        const tools: EditorTools = {
          header: {
            class: Header as unknown as ToolConstructable,
            inlineToolbar: true,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 2
            }
          },
          paragraph: {
            class: Paragraph as unknown as ToolConstructable,
            inlineToolbar: true
          },
          list: {
            class: List as unknown as ToolConstructable,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          nestedList: {
            class: NestedList as unknown as ToolConstructable,
            inlineToolbar: true
          },
          checklist: {
            class: Checklist as unknown as ToolConstructable,
            inlineToolbar: true
          },
          quote: {
            class: Quote as unknown as ToolConstructable,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author'
            }
          },
          code: {
            class: Code as unknown as ToolConstructable,
            config: {
              placeholder: 'Enter code'
            }
          },
          delimiter: {
            class: Delimiter as unknown as ToolConstructable
          },
          inlineCode: {
            class: InlineCode as unknown as ToolConstructable
          },
          linkTool: {
            class: LinkTool as unknown as ToolConstructable,
            config: {
              endpoint: '/api/fetch-link'
            }
          },
          image: {
            class: Image as unknown as ToolConstructable,
            config: {
              uploader: {
                uploadByFile(file: File): Promise<{ success: number; file: { url: string } }> {
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      resolve({
                        success: 1,
                        file: {
                          url: reader.result as string
                        }
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                }
              }
            }
          },
          embed: {
            class: Embed as unknown as ToolConstructable,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true,
                codesandbox: true,
                codepen: true
              }
            }
          },
          table: {
            class: Table as unknown as ToolConstructable,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3
            }
          },
          warning: {
            class: Warning as unknown as ToolConstructable,
            inlineToolbar: true,
            config: {
              titlePlaceholder: 'Title',
              messagePlaceholder: 'Message'
            }
          },
          marker: {
            class: Marker as unknown as ToolConstructable,
            inlineToolbar: true
          },
          raw: {
            class: Raw as unknown as ToolConstructable
          },
          attaches: {
            class: Attaches as unknown as ToolConstructable,
            config: {
              uploader: {
                uploadByFile(file: File): Promise<{ success: number; file: { url: string; name: string; size: number } }> {
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      resolve({
                        success: 1,
                        file: {
                          url: reader.result as string,
                          name: file.name,
                          size: file.size
                        }
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                }
              }
            }
          },
          simpleImage: {
            class: SimpleImage as unknown as ToolConstructable
          }
        };

        const editor = new EditorJS({
          holder: 'editorjs',
          tools,
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
        }) as EditorInstance;

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

    const timeoutId = setTimeout(initEditor, 100);

    return () => {
      clearTimeout(timeoutId);
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
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
            ${bannerPreview ? 'p-2' : 'p-6'}`}
        >
          <input {...getInputProps()} />
          {bannerPreview ? (
            <img
              src={bannerPreview}
              alt="Banner preview"
              className="w-full h-[200px] object-cover rounded-md"
            />
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {isDragActive ? 
                  "Drop your banner image here" : 
                  "Drag and drop your banner image here, or click to select"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-8" />
      
      <div id="editorjs" className="prose max-w-none min-h-[200px]" />
    </div>
  );
}
