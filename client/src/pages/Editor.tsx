
import { useState } from "react";
import { useLocation } from "wouter";
import { type OutputData } from "@editorjs/editorjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from 'react-dropzone';
import Editor from "@/components/editor/editor";

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editorData, setEditorData] = useState<OutputData>({ blocks: [] });
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
      await saveMutation.mutateAsync({ title, content: editorData });
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
      
      <Editor data={editorData} setData={setEditorData} />
    </div>
  );
}
