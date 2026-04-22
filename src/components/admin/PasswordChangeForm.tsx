'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PasswordChangeFormProps {
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ token, onClose, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password validation
  const passwordRequirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(newPassword) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (!allRequirementsMet) {
      setError('New password does not meet all requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('admin-auth', {
        body: {
          action: 'change-password',
          token,
          currentPassword,
          newPassword
        }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to change password');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to change password');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (err: any) {
      console.error('Password change error:', err);
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-stone-900 rounded-xl p-8 max-w-md w-full border border-stone-700 text-center">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-stone-100 mb-2">Password Changed!</h3>
          <p className="text-stone-400">
            Your password has been updated successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-stone-900 rounded-xl max-w-md w-full border border-stone-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center">
              <Lock className="text-red-500" size={20} />
            </div>
            <h3 className="text-lg font-bold text-stone-100">Change Password</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors text-stone-400 hover:text-stone-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 flex items-start gap-3">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 pr-12 text-stone-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Enter current password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 pr-12 text-stone-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Enter new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Requirements */}
            {newPassword.length > 0 && (
              <div className="mt-3 space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <Check className="text-green-500" size={16} />
                    ) : (
                      <X className="text-stone-500" size={16} />
                    )}
                    <span className={req.met ? 'text-green-500' : 'text-stone-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-stone-800 border rounded-lg px-4 py-3 pr-12 text-stone-200 focus:outline-none focus:ring-1 ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'border-green-600 focus:border-green-500 focus:ring-green-500'
                      : 'border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-stone-700 focus:border-red-500 focus:ring-red-500'
                }`}
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-2 text-sm text-red-400">Passwords do not match</p>
            )}
            {confirmPassword.length > 0 && passwordsMatch && (
              <p className="mt-2 text-sm text-green-500 flex items-center gap-1">
                <Check size={14} /> Passwords match
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-stone-600 hover:border-stone-500 text-stone-300 rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !allRequirementsMet || !passwordsMatch || !currentPassword}
              className="flex-1 px-4 py-3 bg-red-700 hover:bg-red-600 disabled:bg-stone-700 disabled:text-stone-500 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Updating...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
