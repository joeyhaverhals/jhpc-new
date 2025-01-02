
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [mode, setMode] = React.useState<'login' | 'register'>('login');
  const { signIn, signUp } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError(null);
      await signIn(data.email, data.password);
      onClose();
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setError(null);
      await signUp(data.email, data.password);
      onClose();
    } catch (err) {
      setError('Error creating account');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md p-8 mx-4 bg-white/10 backdrop-blur-xl rounded-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-white/60">
            {mode === 'login' 
              ? 'Sign in to access your account' 
              : 'Join us and get started'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="email"
                    {...loginForm.register('email')}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-white/60 focus:outline-none focus:ring-2 
                             focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="password"
                    {...loginForm.register('password')}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-white/60 focus:outline-none focus:ring-2 
                             focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center px-8 py-4 
                         bg-gradient-to-r from-purple-600 to-blue-600 
                         rounded-lg text-white font-medium"
              >
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>

              <p className="text-center text-white/60">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Sign Up
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      type="text"
                      {...registerForm.register('firstName')}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                               text-white placeholder-white/60 focus:outline-none focus:ring-2 
                               focus:ring-purple-500"
                      placeholder="John"
                    />
                  </div>
                  {registerForm.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-red-400">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      type="text"
                      {...registerForm.register('lastName')}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                               text-white placeholder-white/60 focus:outline-none focus:ring-2 
                               focus:ring-purple-500"
                      placeholder="Doe"
                    />
                  </div>
                  {registerForm.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-red-400">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="email"
                    {...registerForm.register('email')}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-white/60 focus:outline-none focus:ring-2 
                             focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-