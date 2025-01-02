import { create } from 'zustand';
import { Service, SEOData } from '@/types';
import { supabase } from '@/lib/supabase';

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  createService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  updateSEO: (id: string, seoData: SEOData) => Promise<void>;
  updateOrder: (id: string, newOrder: number) => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      set({ services: data as Service[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createService: async (service) => {
    set({ isLoading: true, error: null });
    try {
      // Get max order
      const maxOrder = Math.max(...get().services.map(s => s.order), 0);
      
      const { error } = await supabase
        .from('services')
        .insert([{ ...service, order: maxOrder + 1 }]);

      if (error) throw error;
      await get().fetchServices();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateService: async (id, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id);

      if (error) throw error;
      
      const services = get().services.map(service => 
        service.id === id ? { ...service, ...serviceData } : service
      );
      set({ services });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteService: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const services = get().services.filter(service => service.id !== id);
      set({ services });
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
        .from('services')
        .update({ seo: seoData })
        .eq('id', id);

      if (error) throw error;
      
      const services = get().services.map(service => 
        service.id === id ? { ...service, seo: seoData } : service
      );
      set({ services });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrder: async (id, newOrder) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('services')
        .update({ order: newOrder })
        .eq('id', id);

      if (error) throw error;
      
      const services = get().services.map(service => 
        service.id === id ? { ...service, order: newOrder } : service
      );
      set({ services });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
