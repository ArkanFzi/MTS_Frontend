// src/features/Admin/F9_UserManagement/components/ResetPasswordForm.tsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, Mail, Lock, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { resetUserPassword } from '../api';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { toast } from 'sonner';
import type { UserDetail } from '../types';

function getRoleBadge(roles: string[]) {
  if (roles.includes('admin')) return { label: 'Admin', color: 'bg-red-950/50 text-red-400 border-red-900' };
  if (roles.includes('moderator')) return { label: 'Moderator', color: 'bg-blue-950/50 text-blue-400 border-blue-900' };
  return { label: 'User', color: 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C]' };
}

interface ResetPasswordFormProps {
  userId: string;
  user: UserDetail;
}

export default function ResetPasswordForm({ userId, user }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetMutation = useMutation({
    mutationFn: () => resetUserPassword(userId, { password, password_confirmation: passwordConfirmation }),
    onSuccess: () => {
      toast.success(`Password untuk ${user.username} berhasil direset.`);
      setPassword('');
      setPasswordConfirmation('');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Gagal mereset password.');
    },
  });

  const passwordsMatch = password && passwordConfirmation && password === passwordConfirmation;
  const passwordTooShort = password.length > 0 && password.length < 8;
  const roleBadge = getRoleBadge(user.roles);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password harus minimal 8 karakter.'); return; }
    if (password !== passwordConfirmation) { toast.error('Password dan konfirmasi tidak cocok.'); return; }
    resetMutation.mutate();
  };

  return (
    <Card className="border-[#2A2A2C] bg-[#161618]">
      <CardHeader className="border-b border-[#2A2A2C]">
        <CardTitle className="flex items-center gap-2.5 text-white">
          <div className="p-2 rounded-lg bg-blue-950/50 border border-blue-900/50">
            <KeyRound className="w-4 h-4 text-blue-400" />
          </div>
          Reset Password
        </CardTitle>
        <CardDescription className="text-gray-500">
          Atur ulang password untuk akun <span className="text-gray-300 font-medium">{user.username}</span>.
          Perubahan ini langsung berlaku dan user tidak akan mendapat notifikasi otomatis.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/40 mb-6">
          <Lock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-400/80 leading-relaxed">
            <p className="font-semibold text-amber-400 mb-0.5">Perhatian</p>
            Password yang di-reset tidak dapat dikembalikan. Pastikan Anda memberikan password baru
            kepada user secara langsung atau melalui saluran yang aman.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-500" /> Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className={`w-full rounded-lg border bg-[#0B0B0C] px-4 pr-10 py-2.5 text-sm text-gray-200 outline-none transition-colors ${
                  passwordTooShort ? 'border-red-800 focus:border-red-500' :
                  password.length >= 8 ? 'border-emerald-800 focus:border-emerald-500' :
                  'border-[#2A2A2C] focus:border-[#D4AF37]'
                }`}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordTooShort && <p className="text-xs text-red-400">Password harus minimal 8 karakter.</p>}
            {password.length >= 8 && <p className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Password valid</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-500" /> Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Ulangi password baru"
                className={`w-full rounded-lg border bg-[#0B0B0C] px-4 pr-10 py-2.5 text-sm text-gray-200 outline-none transition-colors ${
                  passwordConfirmation && !passwordsMatch ? 'border-red-800 focus:border-red-500' :
                  passwordsMatch ? 'border-emerald-800 focus:border-emerald-500' :
                  'border-[#2A2A2C] focus:border-[#D4AF37]'
                }`}
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordConfirmation && !passwordsMatch && <p className="text-xs text-red-400">Password tidak cocok.</p>}
            {passwordsMatch && <p className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Password cocok</p>}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={resetMutation.isPending || !password || !passwordConfirmation || !passwordsMatch || passwordTooShort}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-40 transition-all"
            >
              {resetMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Mereset Password...</>
              ) : (
                <><KeyRound className="w-4 h-4 mr-2" />Reset Password {user.username}</>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#2A2A2C]">
          <h4 className="text-[11px] font-mono text-gray-600 uppercase tracking-wider mb-3">Info Akun (Read-only)</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#0B0B0C] border border-[#2A2A2C] p-3">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Username</p>
              <p className="text-sm text-gray-300 font-mono">{user.username}</p>
            </div>
            <div className="rounded-lg bg-[#0B0B0C] border border-[#2A2A2C] p-3">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm text-gray-300 font-mono truncate">{user.email}</p>
            </div>
            <div className="rounded-lg bg-[#0B0B0C] border border-[#2A2A2C] p-3">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Role</p>
              <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0 ${roleBadge.color}`}>{roleBadge.label}</Badge>
            </div>
            <div className="rounded-lg bg-[#0B0B0C] border border-[#2A2A2C] p-3">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Status</p>
              {user.is_banned
                ? <Badge className="text-[10px] bg-red-950/50 text-red-400 border border-red-900">Banned</Badge>
                : <Badge variant="outline" className="text-[10px] border-emerald-900 text-emerald-400 bg-emerald-950/30">Active</Badge>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
