import React, { useEffect, useState } from 'react';
import { useAIChatStore } from '@/stores/aiChatStore';
import { ChatSession, ChatMessage } from '@/types/aiChat';
import { format } from 'date-fns';
import {
  Settings,
  Users,
  Clock,
  AlertTriangle,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Eye,
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ChatMetricsDisplay from '@/components/chat/ChatMetrics';

const AIChatManagement: React.FC = () => {
  const {
    config,
    sessions,
    messages,
    metrics,
    isLoading,
    error,
    fetchConfig,
    updateConfig,
    fetchSessions,
    fetchMessages,
    deleteSession,
    getMetrics,
  } = useAIChatStore();

  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ChatSession['status'] | 'all'>(
    'all'
  );

  useEffect(() => {
    fetchConfig();
    fetchSessions();
    getMetrics();
  }, [fetchConfig, fetchSessions, getMetrics]);

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession);
    }
  }, [selectedSession, fetchMessages]);

  const handleStatusToggle = async () => {
    if (!config) return;
    
    const newStatus = config.status === 'active' ? 'maintenance' : 'active';
    await updateConfig({ status: newStatus });
  };

  const handleProviderChange = async (provider: 'gpt4' | 'local_llm') => {
    if (!config) return;
    await updateConfig({ provider });
  };

  const handleTimeRestrictionToggle = async () => {
    if (!config) return;
    await updateConfig({
      timeRestrictions: {
        ...config.timeRestrictions,
        enabled: !config.timeRestrictions.enabled,
      },
    });
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
        <h1 className="text-2xl font-bold text-gray-900">AI Chat Management</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleStatusToggle}
            className={`inline-flex items-center px-4 py-2 rounded-md ${
              config?.status === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-yellow-600 text-white'
            }`}
          >
            {config?.status === 'active' ? (
              <ToggleRight className="h-5 w-5 mr-2" />
            ) : (
              <ToggleLeft className="h-5 w-5 mr-2" />
            )}
            {config?.status === 'active' ? 'Active' : 'Maintenance'}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Metrics Display */}
      {metrics && <ChatMetricsDisplay metrics={metrics} />}

      {/* Session Management */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Chat Sessions
          </h2>
          
          {/* Filters */}
          <div className="mb-4 flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Sessions Table */}
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions
                    .filter(
                      (session) =>
                        statusFilter === 'all' ||
                        session.status === statusFilter
                    )
                    .map((session) => (
                      <tr key={session.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {session.userId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(
                              new Date(session.startTime),
                              'MMM d, yyyy HH:mm'
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {session.messageCount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              session.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : session.status === 'error'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedSession(session.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && config && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Chat Settings
            </h3>
            
            <div className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  AI Provider
                </label>
                <div className="mt-1 flex space-x-4">
                  <button
                    onClick={() => handleProviderChange('gpt4')}
                    className={`px-4 py-2 rounded-md ${
                      config.provider === 'gpt4'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    GPT-4
                  </button>
                  <button
                    onClick={() => handleProviderChange('local_llm')}
                    className={`px-4 py-2 rounded-md ${
                      config.provider === 'local_llm'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Local LLM
                  </button>
                </div>
              </div>

              {/* API Configuration */}
              {config.provider === 'gpt4' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={config.apiConfig.apiKey || ''}
                    onChange={(e) =>
                      updateConfig({
                        apiConfig: {
                          ...config.apiConfig,
                          apiKey: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={config.apiConfig.webhookUrl || ''}
                    onChange={(e) =>
                      updateConfig({
                        apiConfig: {
                          ...config.apiConfig,
                          webhookUrl: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Time Restrictions */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Time Restrictions
                  </label>
                  <button
                    onClick={handleTimeRestrictionToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      config.timeRestrictions.enabled
                        ? 'bg-indigo-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">Enable time restrictions</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        config.timeRestrictions.enabled
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {config.timeRestrictions.enabled && (
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={config.timeRestrictions.startTime || ''}
                          onChange={(e) =>
                            updateConfig({
                              timeRestrictions: {
                                ...config.timeRestrictions,
                                startTime: e.target.value,
                              },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={config.timeRestrictions.endTime || ''}
                          onChange={(e) =>
                            updateConfig({
                              timeRestrictions: {
                                ...config.timeRestrictions,
                                endTime: e.target.value,
                              },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Days of Week
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                          (day, index) => (
                            <button
                              key={day}
                              onClick={() => {
                                const days = config.timeRestrictions.daysOfWeek;
                                const newDays = days.includes(index)
                                  ? days.filter((d) => d !== index)
                                  : [...days, index];
                                updateConfig({
                                  timeRestrictions: {
                                    ...config.timeRestrictions,
                                    daysOfWeek: newDays,
                                  },
                                });
                              }}
                              className={`px-3 py-1 rounded-md ${
                                config.timeRestrictions.daysOfWeek.includes(index)
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {day}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Role Access */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allowed Roles
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['admin', 'editor', 'vip', 'user'].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        const roles = config.allowedRoles;
                        const newRoles = roles.includes(role)
                          ? roles.filter((r) => r !== role)
                          : [...roles, role];
                        updateConfig({ allowedRoles: newRoles });
                      }}
                      className={`px-3 py-1 rounded-md ${
                        config.allowedRoles.includes(role)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Maintenance Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maintenance Message
                </label>
                <textarea
                  value={config.maintenanceMessage || ''}
                  onChange={(e) =>
                    updateConfig({ maintenanceMessage: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Session Modal */}
      {selectedSession && messages[selectedSession] && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Chat Session Details
              </h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {messages[selectedSession].map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : message.role === 'system'
                        ? 'bg-red-100 text-red-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {format(new Date(message.timestamp), 'HH:mm:ss')}
                    </p>
                    {message.tokenCount && (
                      <p className="text-xs opacity-75">
                        Tokens: {message.tokenCount}
                      </p>
                    )}
                    {message.error && (
                      <p className="text-xs text-red-500">{message.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatManagement;
