import { create } from 'zustand';
import { Testimonial } from '@/types';
import { supabase } from '@/lib/supabase';

interface TestimonialState {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
  fetchTestimonials: () => Promise<void>;
  updateTestimonialStatus: (id: string, status: Testimonial['status']) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  submitTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'status'>) => Promise<void>;
}

export const useTestimonialStore = create<TestimonialState>((set, get) => ({
  testimonials: [],
  isLoading: false,
  error: null,

  fetchTestimonials: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ testimonials: data as Testimonial[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTestimonialStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      const testimonials = get().testimonials.map(testimonial =>
        testimonial.id === id ? { ...testimonial, status } : testimonial
      );
      set({ testimonials });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTestimonial: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const testimonials = get().testimonials.filter(
        testimonial => testimonial.id !== id
      );
      set({ testimonials });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  submitTestimonial: async (testimonial) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([{ ...testimonial, status: 'pending' }]);

      if (error) throw error;
      await get().fetchTestimonials();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
