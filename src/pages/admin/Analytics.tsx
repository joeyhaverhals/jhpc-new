import React, { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  MessageSquare, 
  Star,
  Briefcase,
  Activity,
  Download
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';
import ExportButton from '@/components/analytics/ExportButton';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// MetricCard component for displaying individual metrics
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  trend 
}: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  trend?: 'up' | 'down';
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-indigo-50">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`ml-2 text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

// TimeSeriesChart component for visualizing time-based data
const TimeSeriesChart = ({ 
  data, 
  title,
  type = 'line'
}: { 
  data: { date: string; value: number }[];
  title: string;
  type?: 'line' | 'area' | 'bar';
}) => {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM d'),
  }));

  const renderChart = () => {
    const commonProps = {
      data: formattedData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  const { 
    metrics,
    userActivity,
    postViews,
    serviceUsage,
    isLoading,
    error,
    fetchMetrics,
    fetchUserActivity,
    fetchPostAnalytics,
    fetchServiceAnalytics
  } = useAnalyticsStore();

  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchMetrics();
    fetchUserActivity(timeRange);
    fetchPostAnalytics(timeRange);
    fetchServiceAnalytics(timeRange);
  }, [timeRange, fetchMetrics, fetchUserActivity, fetchPostAnalytics, fetchServiceAnalytics]);

  const handleExportMetrics = (type: 'csv' | 'json') => {
    const filename = `analytics-metrics-${format(new Date(), 'yyyy-MM-dd')}`;
    const data = {
      metrics,
      exportDate: new Date().toISOString(),
      timeRange
    };
    
    if (type === 'csv') {
      const csvContent = Object.entries(metrics)
        .map(([key, value]) => `${key},${value}`)
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <ExportButton onExport={handleExportMetrics} />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          icon={Users}
          change={`${metrics.userGrowth > 0 ? '+' : ''}${metrics.userGrowth.toFixed(1)}%`}
          trend={metrics.userGrowth > 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          icon={Activity}
          change="+5.2%"
          trend="up"
        />
        <MetricCard
          title="Total Posts"
          value={metrics.totalPosts}
          icon={FileText}
        />
        <MetricCard
          title="Total Views"
          value={metrics.totalViews}
          icon={Eye}
          change="+12.3%"
          trend="up"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Post Engagement"
          value={`${metrics.postEngagement.toFixed(1)}%`}
          icon={MessageSquare}
        />
        <MetricCard
          title="Average Rating"
          value={metrics.testimonialRating.toFixed(1)}
          icon={Star}
        />
        <MetricCard
          title="Active Subscriptions"
          value={metrics.serviceSubscriptions}
          icon={Briefcase}
        />
      </div>

      {/* Time Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">User Activity</h2>
            <ExportButton 
              onExport={(type) => {
                // Implement user activity export
              }} 
              label="Export Activity"
            />
          </div>
          <TimeSeriesChart 
            data={userActivity} 
            title="Daily Active Users" 
            type="area"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Post Views</h2>
            <ExportButton 
              onExport={(type) => {
                // Implement post views export
              }} 
              label="Export Views"
            />
          </div>
          <TimeSeriesChart 
            data={postViews} 
            title="Daily Post Views"
            type="line"
          />
        </div>
      </div>

      {/* Service Usage Chart */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Service Usage</h2>
          <ExportButton 
            onExport={(type) => {
              // Implement service usage export
            }} 
            label="Export Usage"
          />
        </div>
        <TimeSeriesChart 
          data={serviceUsage} 
          title="Service Subscriptions Over Time"
          type="bar"
        />
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Content</h3>
          <div className="space-y-4">
            {/* Add top content performance metrics */}
            <div className="h-64 flex items-center justify-center text-gray-500">
              Top content metrics coming soon
            </div>
          </div>
        </div>

        {/* User Demographics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Demographics</h3>
          <div className="space-y-4">
            {/* Add demographics visualization */}
            <div className="h-64 flex items-center justify-center text-gray-500">
              Demographics visualization coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
