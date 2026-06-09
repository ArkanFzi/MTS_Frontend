import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import type { ForgotPasswordFormProps, ResetPasswordFormProps } from '../types';

// ─── Validation schemas ───
const forgotSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const resetSchema = Yup.object({
  password: Yup.string().min(8, 'Min 8 characters').required('Password is required'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

// ─── Forgot Password Form (Step 1: Enter email) ───
export function ForgotPasswordForm({ onSubmit, isLoading, errorMsg, successMsg }: ForgotPasswordFormProps) {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotSchema,
    onSubmit: (values) => onSubmit(values),
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10 bg-[#0B0B0C] border-[#2A2A2C] text-white placeholder:text-gray-600 focus:border-[#D4AF37]"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="text-xs text-red-400">{formik.errors.email}</p>
        )}
      </div>

      {errorMsg && <p className="text-sm text-red-400 bg-red-950/30 px-3 py-2 rounded">{errorMsg}</p>}
      {successMsg && <p className="text-sm text-green-400 bg-green-950/30 px-3 py-2 rounded">{successMsg}</p>}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#D4AF37] text-black hover:bg-[#c29f2f] font-bold h-10"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
}

// ─── Reset Password Form (Step 2: Enter new password) ───
export function ResetPasswordForm({ onSubmit, isLoading, errorMsg, successMsg, email, token }: ResetPasswordFormProps) {
  const formik = useFormik({
    initialValues: {
      email,
      token,
      password: '',
      password_confirmation: '',
    },
    validationSchema: resetSchema,
    onSubmit: (values) => onSubmit(values),
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Min 8 characters"
            className="pl-10 bg-[#0B0B0C] border-[#2A2A2C] text-white placeholder:text-gray-600 focus:border-[#D4AF37]"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="text-xs text-red-400">{formik.errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation" className="text-gray-300">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            placeholder="Repeat new password"
            className="pl-10 bg-[#0B0B0C] border-[#2A2A2C] text-white placeholder:text-gray-600 focus:border-[#D4AF37]"
            value={formik.values.password_confirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {formik.touched.password_confirmation && formik.errors.password_confirmation && (
          <p className="text-xs text-red-400">{formik.errors.password_confirmation}</p>
        )}
      </div>

      {errorMsg && <p className="text-sm text-red-400 bg-red-950/30 px-3 py-2 rounded">{errorMsg}</p>}
      {successMsg && <p className="text-sm text-green-400 bg-green-950/30 px-3 py-2 rounded">{successMsg}</p>}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#D4AF37] text-black hover:bg-[#c29f2f] font-bold h-10"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  );
}
