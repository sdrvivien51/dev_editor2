import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import { supabase } from './supabase';

export const editorConfig = {
  holder: 'editorjs',
  tools: {
    header: {
      class: Header,
      config: {
        levels: [1, 2, 3, 4],
        defaultLevel: 2
      }
    },
    list: List,
    image: {
      class: Image,
      config: {
        uploader: {
          async uploadByFile(file: File) {
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
          }
        }
      }
    }
  }
};
