// Chat Analytics and Metrics Types
export interface ChatMetrics {
  totalSessions: number;
  activeUsers: number;
  averageResponseTime: number;
  errorRate: number;
  tokenUsage: {
    total: number;
    daily: number;
    monthly: number;
  };
}

export interface ChatSettings {
  maxTokens: number;
  temperature: number;
  modelVersion: string;
  systemPrompt: string;
  maxMessagesPerSession: number;
  maxSessionDuration: number; // in minutes
}

export interface ChatConfig {
  id: string;
  status: 'active' | 'maintenance' | 'disabled';
  provider: 'gpt4' | 'local_llm';
  maintenanceMessage?: string;
  allowedRoles: string[];
  allowedUsers: string[];
  timeRestrictions: {
    enabled: boolean;
    daysOfWeek: number[]; // 0-6, 0 is Sunday
    startTime?: string; // HH:mm format
    endTime?: string; // HH:mm format
  };
  apiConfig: {
    apiKey?: string;
    endpoint?: string;
    webhookUrl?: string;
    maxTokens: number;
    temperature: number;
  };
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  messageCount: number;
  tokenUsage: number;
  status: 'active' | 'completed' | 'error';
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokenCount?: number;
  error?: string;
}
