// SEO Types
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  metaRobots?: string;
  structuredData?: Record<string, any>;
}

// Post Types
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  authorId: string;
  categories: string[];
  tags: string[];
  seo: SEOData;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  billingFrequency: 'per_4_weeks' | 'one_time';
  imageUrl: string;
  order: number;
  isActive: boolean;
  seo: SEOData;
  updatedAt: string;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  userId: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'editor' | 'vip' | 'user';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  updatedAt: string;
}

// Media Types
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  folder: string;
  createdAt: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

// Analytics Types
export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalViews: number;
  userGrowth: number;
  postEngagement: number;
  testimonialRating: number;
  serviceSubscriptions: number;
}

// About Page Types
export interface AboutContent {
  id: string;
  content: string;
  images: string[];
  version: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Common Types
export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}
