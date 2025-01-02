import React from 'react';
import { ChatMetrics } from '@/types/aiChat';
import { Users, MessageSquare, Clock, AlertTriangle, Cpu } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, description }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-indigo-50">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  </div>
);

interface ChatMetricsProps {
  metrics: ChatMetrics;
}

const ChatMetricsDisplay: React.FC<ChatMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers}
        icon={<Users className="h-6 w-6 text-indigo-600" />}
      />
      <MetricCard
        title="Total Sessions"
        value={metrics.totalSessions}
        icon={<MessageSquare className="h-6 w-6 text-indigo-600" />}
      />
      <MetricCard
        title="Average Response Time"
        value={`${metrics.averageResponseTime.toFixed(2)}s`}
        icon={<Clock className="h-6 w-6 text-indigo-600" />}
      />
      <MetricCard
        title="Error Rate"
        value={`${(metrics.errorRate * 100).toFixed(1)}%`}
        icon={<AlertTriangle className="h-6 w-6 text-indigo-600" />}
      />
      <MetricCard
        title="Token Usage"
        value={metrics.tokenUsage.total.toLocaleString()}
        icon={<Cpu className="h-6 w-6 text-indigo-600" />}
        description={`Daily: ${metrics.tokenUsage.daily.toLocaleString()}`}
      />
    </div>
  );
};

export default ChatMetricsDisplay;
