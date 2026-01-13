'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Mail, Lock, Eye, EyeOff, CheckCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEMO_CREDENTIALS = {
  customer: {
    email: 'demo@tansiqhub.com',
    password: 'demo123',
  },
  admin: {
    email: 'admin@tansiqhub.com',
    password: 'admin123',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, users } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoHint, setShowDemoHint] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login delay
    setTimeout(() => {
      // Find user by email
      const user = users.find((u) => u.email === email);
      
      if (user) {
        // Check password (demo passwords)
        const isValidPassword = 
          (email === DEMO_CREDENTIALS.customer.email && password === DEMO_CREDENTIALS.customer.password) ||
          (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password);
        
        if (isValidPassword) {
          setCurrentUser(user);
          setLoading(false);
          
          // Redirect based on role
          if (user.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/profile');
          }
          return;
        }
      }
      
      setError('Invalid email or password.');
      setLoading(false);
    }, 800);
  };

  const useDemoAccount = (type: 'customer' | 'admin') => {
    setEmail(DEMO_CREDENTIALS[type].email);
    setPassword(DEMO_CREDENTIALS[type].password);
    setShowDemoHint(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl mb-4">
              <span className="text-3xl font-bold text-[var(--color-primary)]">T</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">
              Welcome to Tansiq Hub
            </h1>
            <p className="text-[var(--color-text-light)] mt-1">Sign in to your account</p>
          </div>

          {/* Demo Hints */}
          {showDemoHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 space-y-3"
            >
              {/* Customer Demo */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Customer Demo Account
                    </p>
                    <p className="text-xs text-green-700 mb-2">
                      Email: demo@tansiqhub.com / Password: demo123
                    </p>
                    <button
                      type="button"
                      onClick={() => useDemoAccount('customer')}
                      className="text-xs font-semibold text-green-600 hover:text-green-700 underline"
                    >
                      Use Customer Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin Demo */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800 mb-1">
                      Admin Demo Account
                    </p>
                    <p className="text-xs text-purple-700 mb-2">
                      Email: admin@tansiqhub.com / Password: admin123
                    </p>
                    <button
                      type="button"
                      onClick={() => useDemoAccount('admin')}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700 underline"
                    >
                      Use Admin Account
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)]"
                />
                <span className="text-[var(--color-text-light)]">Remember me</span>
              </label>
              <button
                type="button"
                className="text-[var(--color-primary)] hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[var(--color-text-light)]">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="py-3 border border-gray-200 rounded-xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors text-sm font-medium text-[var(--color-text)]">
              Google
            </button>
            <button className="py-3 border border-gray-200 rounded-xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors text-sm font-medium text-[var(--color-text)]">
              Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-[var(--color-text-light)]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[var(--color-primary)] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-center text-sm text-[var(--color-text-light)]">
          <div className="p-4">
            <p className="font-semibold text-[var(--color-primary)]">🔒 Secure</p>
            <p>Your data is safe</p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-[var(--color-primary)]">⚡ Fast</p>
            <p>Quick checkout</p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-[var(--color-primary)]">✓ Reliable</p>
            <p>Trusted by thousands</p>
          </div>
        </div>
      </div>
    </div>
  );
}
