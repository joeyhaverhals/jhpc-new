import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
  folder: string;
}

interface MediaState {
  files: MediaFile[];
  folders: string[];
  isLoading: boolean;
  error: string | null;
  currentFolder: string;
  fetchMedia: () => Promise<void>;
  uploadFile: (file: File, folder?: string) => Promise<string>;
  deleteFile: (fileId: string) => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  setCurrentFolder: (folder: string) => void;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  files: [],
  folders: [],
  isLoading: false,
  error: null,
  currentFolder: '',

  fetchMedia: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: files, error: filesError } = await supabase
        .storage
        .from('media')
        .list(get().currentFolder);

      if (filesError) throw filesError;

      const { data: folders, error: foldersError } = await supabase
        .from('media_folders')
        .select('name')
        .order('name');

      if (foldersError) throw foldersError;

      const mediaFiles: MediaFile[] = await Promise.all(
        files.map(async (file) => {
          const { data } = supabase.storage
            .from('media')
            .getPublicUrl(`${get().currentFolder}/${file.name}`);

          return {
            id: file.id,
            name: file.name,
            url: data.publicUrl,
            size: file.metadata.size,
            type: file.metadata.mimetype,
            createdAt: file.created_at,
            folder: get().currentFolder,
          };
        })
      );

      set({ 
        files: mediaFiles,
        folders: folders.map(f => f.name),
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadFile: async (file: File, folder = '') => {
    set({ isLoading: true, error: null });
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      await get().fetchMedia();
      return publicUrl;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFile: async (fileId: string) => {
    set({ isLoading: true, error: null });
    try {
      const file = get().files.find(f => f.id === fileId);
      if (!file) throw new Error('File not found');

      const { error } = await supabase.storage
        .from('media')
        .remove([`${file.folder}/${file.name}`]);

      if (error) throw error;

      const files = get().files.filter(f => f.id !== fileId);
      set({ files });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createFolder: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('media_folders')
        .insert([{ name }]);

      if (error) throw error;

      const folders = [...get().folders, name];
      set({ folders });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentFolder: (folder: string) => {
    set({ currentFolder: folder });
    get().fetchMedia();
  },
}));
