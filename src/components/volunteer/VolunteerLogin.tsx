'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

interface VolunteerLoginProps {
  onLoginSuccess: (token: string) => void;
}

export const VolunteerLogin: React.FC<VolunteerLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'volunteer-login', password }
      });

      if (fnError) {
        throw new Error('Authentication service unavailable');
      }

      if (data.success) {
        localStorage.setItem('volunteer_token', data.token);
        localStorage.setItem('volunteer_token_expires', data.expiresAt);
        onLoginSuccess(data.token);
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      console.error('Volunteer login error:', err);
      setError('Unable to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-stone-900 rounded-2xl p-8 shadow-2xl border border-stone-800">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Volunteer Portal</h2>
            <p className="text-stone-400 text-sm">
              Enter the volunteer password to access resources
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label htmlFor="volunteer-password" className="block text-sm font-medium text-stone-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="volunteer-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all"
                  placeholder="Enter volunteer password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Access Volunteer Portal
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-stone-500 text-xs mt-6">
            Contact the site administrator if you need access
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerLogin;
