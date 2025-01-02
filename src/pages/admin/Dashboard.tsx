import React from 'react';
import { useUserStore } from '@/stores/userStore';
import { Users as UsersIcon, FileText, MessageSquare, Star } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down';
}> = ({ title, value, icon, change, trend }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { users, isLoading } = useUserStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <UsersIcon className="h-6 w-6" />,
      change: '+12%',
      trend: 'up' as const,
    },
    {
      title: 'Total Posts',
      value: '24',
      icon: <FileText className="h-6 w-6" />,
      change: '+4%',
      trend: 'up' as const,
    },
    {
      title: 'Active Comments',
      value: '123',
      icon: <MessageSquare className="h-6 w-6" />,
      change: '+8%',
      trend: 'up' as const,
    },
    {
      title: 'Testimonials',
      value: '15',
      icon: <Star className="h-6 w-6" />,
      change: '+23%',
      trend: 'up' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {users.slice(0, 5).map((user) => (
                  <li key={user.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm text-gray-500 font-medium">
                            {user.email[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <FileText className="h-4 w-4 mr-2" />
                New Post
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <UsersIcon className="h-4 w-4 mr-2" />
                Add User
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Moderate Comments
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <Star className="h-4 w-4 mr-2" />
                Review Testimonials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
