import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { ChatConfig, ChatSession, ChatMessage, ChatMetrics } from '@/types/aiChat';

interface AIChatState {
  config: ChatConfig | null;
  sessions: ChatSession[];
  messages: Record<string, ChatMessage[]>;
  metrics: ChatMetrics | null;
  isLoading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  updateConfig: (config: Partial<ChatConfig>) => Promise<void>;
  fetchSessions: (filters?: { 
    status?: ChatSession['status']; 
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  fetchMessages: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  getMetrics: () => Promise<ChatMetrics | null>;
  updateSettings: (settings: Partial<ChatConfig>) => Promise<void>;
}

export const useAIChatStore = create<AIChatState>((set, get) => ({
  config: null,
  sessions: [],
  messages: {},
  metrics: null,
  isLoading: false,
  error: null,

  fetchConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ai_chat_config')
        .select('*')
        .single();

      if (error) throw error;
      set({ config: data as ChatConfig });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateConfig: async (configUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('ai_chat_config')
        .update({
          ...configUpdate,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', get().config?.id);

      if (error) throw error;
      await get().fetchConfig();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSessions: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase
        .from('ai_chat_sessions')
        .select('*')
        .order('startTime', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.userId) {
        query = query.eq('userId', filters.userId);
      }
      if (filters?.startDate) {
        query = query.gte('startTime', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('startTime', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      set({ sessions: data as ChatSession[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('sessionId', sessionId)
        .order('timestamp');

      if (error) throw error;
      set(state => ({
        messages: {
          ...state.messages,
          [sessionId]: data as ChatMessage[],
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSession: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('ai_chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      set(state => ({
        sessions: state.sessions.filter(session => session.id !== sessionId),
        messages: {
          ...state.messages,
          [sessionId]: undefined,
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  getMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ai_chat_metrics')
        .select('*')
        .single();

      if (error) throw error;
      const metrics = data as ChatMetrics;
      set({ metrics });
      return metrics;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (settings) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('ai_chat_config')
        .update(settings)
        .eq('id', get().config?.id);

      if (error) throw error;
      await get().fetchConfig();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
