import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home,
  FileText,
  Briefcase,
  HelpCircle,
  Star,
  Image,
  MessageSquare,
  BarChart2,
  Users,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { name: 'Media', href: '/admin/media', icon: Image },
  { name: 'AI Chat', href: '/admin/ai-chat', icon: MessageSquare },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 z-40' : 'opacity-0 -z-10'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <span className="text-xl font-semibold text-gray-900">
              Admin Panel
            </span>
            <button
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User info */}
          <div className="flex items-center p-4 border-t border-gray-200">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.email}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
