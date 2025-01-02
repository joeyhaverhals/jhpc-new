import { create } from 'zustand';
import { Post, SEOData } from '@/types';
import { supabase } from '@/lib/supabase';

interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  schedulePost: (id: string, scheduledAt: string) => Promise<void>;
  updateSEO: (id: string, seoData: SEOData) => Promise<void>;
  publishPost: (id: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      set({ posts: data as Post[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createPost: async (post) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('posts')
        .insert([{
          ...post,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);

      if (error) throw error;
      await get().fetchPosts();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePost: async (id, postData) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          ...postData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      const posts = get().posts.map(post => 
        post.id === id ? { ...post, ...postData } : post
      );
      set({ posts });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePost: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const posts = get().posts.filter(post => post.id !== id);
      set({ posts });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  schedulePost: async (id, scheduledAt) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          scheduledAt,
          status: 'scheduled',
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      const posts = get().posts.map(post => 
        post.id === id ? { ...post, scheduledAt, status: 'scheduled' } : post
      );
      set({ posts });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSEO: async (id, seoData) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          seo: seoData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      const posts = get().posts.map(post => 
        post.id === id ? { ...post, seo: seoData } : post
      );
      set({ posts });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  publishPost: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          status: 'published',
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      const posts = get().posts.map(post => 
        post.id === id ? {
          ...post,
          status: 'published',
          publishedAt: new Date().toISOString()
        } : post
      );
      set({ posts });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
