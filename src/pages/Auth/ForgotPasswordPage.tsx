import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { ForgotPasswordForm, ResetPasswordForm } from '../../features/Auth/F31_ForgotPassword/components/ForgotPassword';
import { sendResetLink, resetPassword } from '../../features/Auth/F31_ForgotPassword/api';
import type { ForgotPasswordPayload, ResetPasswordPayload } from '../../features/Auth/F31_ForgotPassword/types';

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';
  const isResetMode = !!token && !!emailParam;

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ─── Step 1: Send reset link ───
  const forgotMutation = useMutation({
    mutationFn: (data: ForgotPasswordPayload) => sendResetLink(data),
    onSuccess: (res) => {
      setErrorMsg('');
      setSuccessMsg(res.message || 'If the email exists, a reset link has been sent.');
    },
    onError: (err: any) => {
      setSuccessMsg('');
      setErrorMsg(err?.response?.data?.message || 'Something went wrong. Please try again.');
    },
  });

  // ─── Step 2: Reset password ───
  const resetMutation = useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    onSuccess: (res) => {
      setErrorMsg('');
      setSuccessMsg(res.message || 'Password has been reset. You can now login.');
    },
    onError: (err: any) => {
      setSuccessMsg('');
      setErrorMsg(err?.response?.data?.message || 'Failed to reset password. The link may have expired.');
    },
  });

  return (
    <div className="min-h-screen w-full bg-[#0B0B0C] flex items-center justify-center font-['Inter'] px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D4AF37]/10 mb-4">
            <KeyRound className="h-7 w-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isResetMode ? 'Reset Password' : 'Forgot Password'}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {isResetMode
              ? 'Enter your new password below.'
              : 'Enter your email and we\'ll send you a reset link.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#161618] border border-[#2A2A2C] rounded-xl p-6">
          {isResetMode ? (
            <ResetPasswordForm
              onSubmit={(data: ResetPasswordPayload) => {
                setSuccessMsg('');
                setErrorMsg('');
                resetMutation.mutate(data);
              }}
              isLoading={resetMutation.isPending}
              errorMsg={errorMsg}
              successMsg={successMsg}
              email={emailParam}
              token={token}
            />
          ) : (
            <ForgotPasswordForm
              onSubmit={(data: ForgotPasswordPayload) => {
                setSuccessMsg('');
                setErrorMsg('');
                forgotMutation.mutate(data);
              }}
              isLoading={forgotMutation.isPending}
              errorMsg={errorMsg}
              successMsg={successMsg}
            />
          )}
        </div>

        {/* Back to login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
