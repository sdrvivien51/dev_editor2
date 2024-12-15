
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function ImageUpload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className={`w-full h-48 border-2 border-dashed rounded-lg mb-8 flex items-center justify-center cursor-pointer
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      {imageUrl ? (
        <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
          </p>
        </div>
      )}
    </div>
  );
}
