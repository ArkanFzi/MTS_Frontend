// src/features/User/F28_ProfileSettings/components/SettingsForm.tsx
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Camera, Loader2, Save, Lock, AlertCircle,
  CheckCircle2, Eye, EyeOff,
} from 'lucide-react';

import { getProfile, updateProfile, updatePassword } from '../api';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Button } from '../../../../components/ui/button';

// ─── Profile Validation ───
const profileSchema = Yup.object({
  username: Yup.string()
    .required('Username wajib diisi')
    .max(50, 'Username maksimal 50 karakter'),
  email: Yup.string()
    .required('Email wajib diisi')
    .email('Format email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  bio: Yup.string()
    .max(500, 'Bio maksimal 500 karakter')
    .nullable(),
});

// ─── Password Validation ───
const passwordSchema = Yup.object({
  old_password: Yup.string()
    .required('Password lama wajib diisi'),
  new_password: Yup.string()
    .required('Password baru wajib diisi')
    .min(8, 'Password minimal 8 karakter'),
  new_password_confirmation: Yup.string()
    .required('Konfirmasi password wajib diisi')
    .oneOf([Yup.ref('new_password')], 'Konfirmasi password tidak cocok'),
});

export default function SettingsForm() {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // ─── Fetch current profile ───
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
  const profile = profileData?.data;

  // ─── Update Profile Mutation ───
  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      login(res.data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setProfileSuccess(res.message || 'Profil berhasil diperbarui');
      setSelectedFile(null);
      setAvatarPreview(null);
      setTimeout(() => setProfileSuccess(''), 4000);
    },
  });

  // ─── Update Password Mutation ───
  const passwordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: (res) => {
      passwordFormik.resetForm();
      setPasswordSuccess(res.message || 'Password berhasil diubah');
      setTimeout(() => setPasswordSuccess(''), 4000);
    },
  });

  // ─── Profile Form ───
  const profileFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: profile?.username || '',
      email: profile?.email || '',
      bio: profile?.bio || '',
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      setProfileSuccess('');
      const payload: Record<string, any> = { ...values };
      if (selectedFile) payload.avatar = selectedFile;
      profileMutation.mutate(payload);
    },
  });

  // ─── Password Form ───
  const passwordFormik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      setPasswordSuccess('');
      passwordMutation.mutate(values);
    },
  });

  // ─── Avatar handling ───
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }
    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ─── Loading ───
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">
      {/* ═══════════════════════════════════════════
          SECTION 1: Profile Information
          ═══════════════════════════════════════════ */}
      <form onSubmit={profileFormik.handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Avatar className="h-20 w-20">
              {(avatarPreview || profile.avatar_url) ? (
                <AvatarImage
                  src={avatarPreview || profile.avatar_url || ''}
                  alt={profile.username}
                />
              ) : null}
              <AvatarFallback className="bg-[#D4AF37] text-black text-xl font-bold">
                {profile.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{profile.username}</p>
            <p className="text-xs text-gray-500">
              Rep: {profile.reputation_points.toLocaleString()} &bull; Level {profile.level}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#D4AF37] hover:underline mt-1"
            >
              {selectedFile ? 'Ganti foto' : 'Upload foto'}
            </button>
            {selectedFile && (
              <p className="text-[10px] text-gray-500 mt-0.5">{selectedFile.name}</p>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm text-gray-300">Username</Label>
          <Input
            id="username"
            name="username"
            value={profileFormik.values.username}
            onChange={profileFormik.handleChange}
            onBlur={profileFormik.handleBlur}
            className="h-11 bg-[#0B0B0C] border-[#2A2A2C] text-white text-sm"
          />
          {profileFormik.touched.username && profileFormik.errors.username && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{profileFormik.errors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-gray-300">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profileFormik.values.email}
            onChange={profileFormik.handleChange}
            onBlur={profileFormik.handleBlur}
            className="h-11 bg-[#0B0B0C] border-[#2A2A2C] text-white text-sm"
          />
          {profileFormik.touched.email && profileFormik.errors.email && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{profileFormik.errors.email}
            </p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm text-gray-300">
            Bio <span className="text-gray-600">(opsional, max 500 karakter)</span>
          </Label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={profileFormik.values.bio || ''}
            onChange={profileFormik.handleChange}
            onBlur={profileFormik.handleBlur}
            placeholder="Ceritakan sedikit tentang dirimu..."
            className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-y"
          />
          {profileFormik.touched.bio && profileFormik.errors.bio && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{profileFormik.errors.bio}
            </p>
          )}
        </div>

        {/* Success / Error */}
        {profileSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-950/30 border border-green-900 rounded-lg px-4 py-3">
            <CheckCircle2 className="w-4 h-4" />
            {profileSuccess}
          </div>
        )}
        {profileMutation.isError && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4" />
            {(profileMutation.error as any)?.response?.data?.message || 'Gagal memperbarui profil.'}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={profileMutation.isPending}
          className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold disabled:opacity-50 gap-2"
        >
          {profileMutation.isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
          ) : (
            <><Save className="w-4 h-4" /> Simpan Profil</>
          )}
        </Button>
      </form>

      {/* ═══════════════════════════════════════════
          SECTION 2: Change Password
          ═══════════════════════════════════════════ */}
      <div className="border-t border-[#2A2A2C] pt-8">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-[#D4AF37]" />
          Ubah Password
        </h3>

        <form onSubmit={passwordFormik.handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div className="space-y-2">
            <Label htmlFor="old_password" className="text-sm text-gray-300">Password Lama</Label>
            <div className="relative">
              <Input
                id="old_password"
                name="old_password"
                type={showOldPwd ? 'text' : 'password'}
                value={passwordFormik.values.old_password}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                className="h-11 bg-[#0B0B0C] border-[#2A2A2C] text-white text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOldPwd(!showOldPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showOldPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordFormik.touched.old_password && passwordFormik.errors.old_password && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{passwordFormik.errors.old_password}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-sm text-gray-300">Password Baru</Label>
            <div className="relative">
              <Input
                id="new_password"
                name="new_password"
                type={showNewPwd ? 'text' : 'password'}
                value={passwordFormik.values.new_password}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                className="h-11 bg-[#0B0B0C] border-[#2A2A2C] text-white text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPwd(!showNewPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordFormik.touched.new_password && passwordFormik.errors.new_password && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{passwordFormik.errors.new_password}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="new_password_confirmation" className="text-sm text-gray-300">Konfirmasi Password Baru</Label>
            <Input
              id="new_password_confirmation"
              name="new_password_confirmation"
              type="password"
              value={passwordFormik.values.new_password_confirmation}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              className="h-11 bg-[#0B0B0C] border-[#2A2A2C] text-white text-sm"
            />
            {passwordFormik.touched.new_password_confirmation && passwordFormik.errors.new_password_confirmation && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{passwordFormik.errors.new_password_confirmation}
              </p>
            )}
          </div>

          {/* Success / Error */}
          {passwordSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-950/30 border border-green-900 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4" />
              {passwordSuccess}
            </div>
          )}
          {passwordMutation.isError && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4" />
              {(passwordMutation.error as any)?.response?.data?.message || 'Gagal mengubah password.'}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={passwordMutation.isPending}
            className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold disabled:opacity-50 gap-2"
          >
            {passwordMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Mengubah...</>
            ) : (
              <><Lock className="w-4 h-4" /> Ubah Password</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
