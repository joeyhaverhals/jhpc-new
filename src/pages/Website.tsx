import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

// Import all website sections
import Hero from '@/components/website/Hero';
import About from '@/components/website/About';
import Features from '@/components/website/Features';
import Services from '@/components/website/Services';
import Blog from '@/components/website/Blog';
import Testimonials from '@/components/website/Testimonials';
import FAQ from '@/components/website/FAQ';
import Contact from '@/components/website/Contact';
import AuthModal from '@/components/website/AuthModal';
import ChatInterface from '@/components/chat/ChatInterface';

const Website: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Main Content */}
      <main>
        <Hero />
        <About />
        <Features />
        <Services />
        <Blog />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      {/* Chat Interface */}
      <ChatInterface />

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </AnimatePresence>

      {/* Navigation Button */}
      <button
        onClick={() => setShowAuthModal(true)}
        className="fixed top-8 right-8 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full 
                 text-white font-medium hover:bg-white/20 transition-all z-50"
      >
        {user ? 'Account' : 'Sign In'}
      </button>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-blue-500/10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>
    </div>
  );
};

export default Website;
