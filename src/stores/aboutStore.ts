import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AboutContent {
  id: string;
  content: string;
  images: string[];
  version: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AboutState {
  content: AboutContent | null;
  versions: AboutContent[];
  isLoading: boolean;
  error: string | null;
  fetchContent: () => Promise<void>;
  fetchVersions: () => Promise<void>;
  updateContent: (content: string, images: string[]) => Promise<void>;
  publishContent: () => Promise<void>;
  revertToVersion: (versionId: string) => Promise<void>;
}

export const useAboutStore = create<AboutState>((set, get) => ({
  content: null,
  versions: [],
  isLoading: false,
  error: null,

  fetchContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      set({ content: data as AboutContent });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchVersions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('version', { ascending: false });

      if (error) throw error;
      set({ versions: data as AboutContent[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateContent: async (content: string, images: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const currentContent = get().content;
      const newVersion = currentContent ? currentContent.version + 1 : 1;

      const { error } = await supabase
        .from('about_content')
        .insert([{
          content,
          images,
          version: newVersion,
          publishedAt: null,
        }]);

      if (error) throw error;
      await get().fetchContent();
      await get().fetchVersions();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  publishContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentContent = get().content;
      if (!currentContent) throw new Error('No content to publish');

      const { error } = await supabase
        .from('about_content')
        .update({ publishedAt: new Date().toISOString() })
        .eq('id', currentContent.id);

      if (error) throw error;
      await get().fetchContent();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  revertToVersion: async (versionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error: fetchError } = await supabase
        .from('about_content')
        .select('*')
        .eq('id', versionId)
        .single();

      if (fetchError) throw fetchError;
      const oldVersion = data as AboutContent;

      await get().updateContent(oldVersion.content, oldVersion.images);
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
