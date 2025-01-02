import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAIChatStore } from '@/stores/aiChatStore';
import { Send, X, Loader, AlertTriangle, MinusCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { config, createSession, sendMessage } = useAIChatStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(message);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!config || !user || !config.allowedRoles.includes(user.role)) {
    return null;
  }

  const isTimeAllowed = () => {
    if (!config.timeRestrictions.enabled) return true;
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
    
    return config.timeRestrictions.daysOfWeek.includes(currentDay) &&
           (!config.timeRestrictions.startTime || currentTime >= config.timeRestrictions.startTime) &&
           (!config.timeRestrictions.endTime || currentTime <= config.timeRestrictions.endTime);
  };

  if (!isTimeAllowed()) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-24 right-8 w-96 ${
            isMinimized ? 'h-14' : 'h-[600px]'
          } bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-medium text-white">AI Assistant</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <MinusCircle className="h-5 w-5 text-white/60" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white/60" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[calc(100%-8rem)]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <Loader className="h-5 w-5 text-white animate-spin" />
                    </div>
                  </div>
                )}
                {error && (
                  <div className="flex justify-center">
                    <div className="bg-red-500/20 rounded-lg px-4 py-2 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !message.trim()}
                    className="p-2 bg-indigo-600 rounded-lg text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 p-4 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <Send className="h-6 w-6" />
      </motion.button>
    </AnimatePresence>
  );
};

export default ChatInterface;
