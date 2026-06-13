// src/pages/Admin/AdminUserDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getUser } from '../../features/Admin/F9_UserManagement/api';
import UserProfileCard from '../../features/Admin/F9_UserManagement/components/UserProfileCard';
import ResetPasswordForm from '../../features/Admin/F9_UserManagement/components/ResetPasswordForm';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Button } from '../../components/ui/button';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-user-detail', id],
    queryFn: () => getUser(id!),
    enabled: !!id,
  });

  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading user data..." />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-6 text-center">
        <p className="text-red-400 text-sm">Gagal memuat data user.</p>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/users')}
          className="mt-4 border-[#2A2A2C] text-gray-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/users')}
          className="text-gray-400 hover:text-white hover:bg-[#1A1A1C] -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          User Directory
        </Button>
        <span className="text-gray-700">/</span>
        <span className="text-sm text-gray-400 font-mono truncate">{user.username}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile */}
        <div className="lg:col-span-1">
          <UserProfileCard user={user} />
        </div>

        {/* Right: Reset Password */}
        <div className="lg:col-span-2">
          <ResetPasswordForm userId={id!} user={user} />
        </div>
      </div>
    </div>
  );
}
