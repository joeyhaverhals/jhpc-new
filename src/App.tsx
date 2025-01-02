import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Website from '@/pages/Website';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import Posts from '@/pages/admin/Posts';
import Services from '@/pages/admin/Services';
import FAQs from '@/pages/admin/FAQs';
import Testimonials from '@/pages/admin/Testimonials';
import Media from '@/pages/admin/Media';
import AIChatManagement from '@/pages/admin/AIChatManagement';
import Analytics from '@/pages/admin/Analytics';
import Users from '@/pages/admin/Users';
import About from '@/pages/admin/About';

const App: React.FC = () => {
  const { isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Error: {error}</p>
          <p className="text-sm text-red-500 mt-2">
            Please check your environment variables and Supabase configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Website />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<Posts />} />
          <Route path="services" element={<Services />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="media" element={<Media />} />
          <Route path="ai-chat" element={<AIChatManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={
            <ProtectedRoute requiredRole="admin">
              <Users />
            </ProtectedRoute>
          } />
          <Route path="about" element={<About />} />
        </Route>

        {/* 404 - Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
