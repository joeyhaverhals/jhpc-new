import { create } from 'zustand';
import { FAQ } from '@/types';
import { supabase } from '@/lib/supabase';

interface FAQState {
  faqs: FAQ[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchFAQs: () => Promise<void>;
  createFAQ: (faq: Omit<FAQ, 'id'>) => Promise<void>;
  updateFAQ: (id: string, faq: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  moveFAQ: (id: string, direction: 'up' | 'down', categoryId: string) => Promise<void>;
}

export const useFAQStore = create<FAQState>((set, get) => ({
  faqs: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchFAQs: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: faqData, error: faqError } = await supabase
        .from('faqs')
        .select('*')
        .order('category')
        .order('order');

      if (faqError) throw faqError;

      const { data: categoryData, error: categoryError } = await supabase
        .from('faq_categories')
        .select('name')
        .order('name');

      if (categoryError) throw categoryError;

      set({ 
        faqs: faqData as FAQ[],
        categories: categoryData.map(c => c.name)
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createFAQ: async (faq) => {
    set({ isLoading: true, error: null });
    try {
      // Get max order in the category
      const maxOrder = Math.max(
        ...get().faqs
          .filter(f => f.category === faq.category)
          .map(f => f.order),
        0
      );

      const { error } = await supabase
        .from('faqs')
        .insert([{ ...faq, order: maxOrder + 1 }]);

      if (error) throw error;
      await get().fetchFAQs();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFAQ: async (id, faqData) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('faqs')
        .update(faqData)
        .eq('id', id);

      if (error) throw error;
      
      const faqs = get().faqs.map(faq => 
        faq.id === id ? { ...faq, ...faqData } : faq
      );
      set({ faqs });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFAQ: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const faqs = get().faqs.filter(faq => faq.id !== id);
      set({ faqs });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  moveFAQ: async (id, direction, category) => {
    const faqs = [...get().faqs];
    const categoryFaqs = faqs.filter(f => f.category === category);
    const index = categoryFaqs.findIndex(f => f.id === id);
    
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categoryFaqs.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const currentFAQ = categoryFaqs[index];
    const swapFAQ = categoryFaqs[newIndex];

    try {
      const { error } = await supabase
        .from('faqs')
        .upsert([
          { id: currentFAQ.id, order: swapFAQ.order },
          { id: swapFAQ.id, order: currentFAQ.order }
        ]);

      if (error) throw error;

      // Update local state
      await get().fetchFAQs();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
