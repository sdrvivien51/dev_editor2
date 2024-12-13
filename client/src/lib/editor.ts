import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import { supabase } from './supabase';

export const editorConfig = {
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
      config: {
        levels: [1, 2, 3, 4],
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
    image: {
      class: Image,
      config: {
        uploader: {
          async uploadByFile(file: File) {
            try {
              const { data, error } = await supabase.storage
                .from('blog-images')
                .upload(`${Date.now()}-${file.name}`, file);

              if (error) throw error;

              const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(data.path);

              return {
                success: 1,
                file: {
                  url: publicUrl,
                }
              };
            } catch (error) {
              console.error('Image upload failed:', error);
              return {
                success: 0,
                error: 'Image upload failed'
              };
            }
          }
        }
      }
    }
  },
  placeholder: 'Let\'s write an awesome story!',
  autofocus: true,
  inlineToolbar: true,
};
