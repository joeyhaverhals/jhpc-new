import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalViews: number;
  userGrowth: number;
  postEngagement: number;
  testimonialRating: number;
  serviceSubscriptions: number;
}

interface TimeSeriesData {
  date: string;
  value: number;
}

interface AnalyticsState {
  metrics: AnalyticsMetrics;
  userActivity: TimeSeriesData[];
  postViews: TimeSeriesData[];
  serviceUsage: TimeSeriesData[];
  isLoading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  fetchUserActivity: (days: number) => Promise<void>;
  fetchPostAnalytics: (days: number) => Promise<void>;
  fetchServiceAnalytics: (days: number) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  metrics: {
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalViews: 0,
    userGrowth: 0,
    postEngagement: 0,
    testimonialRating: 0,
    serviceSubscriptions: 0,
  },
  userActivity: [],
  postViews: [],
  serviceUsage: [],
  isLoading: false,
  error: null,

  fetchMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Fetch active users (users who logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count: activeUsers } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact' })
        .gte('last_seen', thirtyDaysAgo.toISOString());

      // Fetch post metrics
      const { count: totalPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact' });

      // Fetch view metrics
      const { data: viewsData } = await supabase
        .from('post_views')
        .select('views');
      const totalViews = viewsData?.reduce((sum, item) => sum + item.views, 0) || 0;

      // Calculate user growth (compared to previous month)
      const prevMonth = new Date();
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const { count: prevMonthUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .lte('created_at', prevMonth.toISOString());
      const userGrowth = prevMonthUsers ? ((totalUsers! - prevMonthUsers) / prevMonthUsers) * 100 : 0;

      // Calculate post engagement
      const postEngagement = totalPosts ? (totalViews / totalPosts) : 0;

      // Fetch average testimonial rating
      const { data: testimonialData } = await supabase
        .from('testimonials')
        .select('rating')
        .eq('status', 'approved');
      const testimonialRating = testimonialData?.reduce((sum, item) => sum + item.rating, 0) / (testimonialData?.length || 1);

      // Fetch service subscriptions
      const { count: serviceSubscriptions } = await supabase
        .from('service_subscriptions')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      set({
        metrics: {
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          totalPosts: totalPosts || 0,
          totalViews,
          userGrowth,
          postEngagement,
          testimonialRating,
          serviceSubscriptions: serviceSubscriptions || 0,
        },
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserActivity: async (days: number) => {
    set({ isLoading: true, error: null });
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('user_activity')
        .select('date, count')
        .gte('date', startDate.toISOString())
        .order('date');

      if (error) throw error;

      set({
        userActivity: data.map(item => ({
          date: item.date,
          value: item.count,
        })),
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPostAnalytics: async (days: number) => {
    set({ isLoading: true, error: null });
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('post_views')
        .select('date, views')
        .gte('date', startDate.toISOString())
        .order('date');

      if (error) throw error;

      set({
        postViews: data.map(item => ({
          date: item.date,
          value: item.views,
        })),
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchServiceAnalytics: async (days: number) => {
    set({ isLoading: true, error: null });
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('service_usage')
        .select('date, count')
        .gte('date', startDate.toISOString())
        .order('date');

      if (error) throw error;

      set({
        serviceUsage: data.map(item => ({
          date: item.date,
          value: item.count,
        })),
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
