// src/pages/User/EditPostPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { getPostDetail } from '../../features/User/F16_Post/api';
import EditPostForm from '../../features/User/F16_Post/components/EditPostForm';
import { Card } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostDetail(id!),
    enabled: !!id,
  });

  const post = data?.data;

  const isModOrAdmin = user?.role === 'moderator' || user?.role === 'admin';
  const postAgeMinutes = post ? (Date.now() - new Date(post.created_at).getTime()) / 60000 : 0;
  const isEditExpired = !isModOrAdmin && postAgeMinutes > 30;

  if (post && isEditExpired) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-6 text-center py-20">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Batas Waktu Edit Habis</h2>
        <p className="text-gray-400 mb-6">
          Postingan hanya dapat diedit dalam waktu 30 menit pertama setelah dibuat.
        </p>
        <Link to={`/posts/${post.id}`} className="text-[#D4AF37] hover:underline text-sm inline-block">
          Kembali ke Postingan
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-6 space-y-4">
        <Skeleton className="w-32 h-5" />
        <Skeleton className="w-full h-11" />
        <Skeleton className="w-full h-48" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-6 text-center py-20">
        <p className="text-gray-400">Postingan tidak ditemukan.</p>
        <Link to="/" className="text-[#D4AF37] hover:underline text-sm mt-2 inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <div className="mb-6">
        <Link
          to={`/posts/${id}`}
          className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1 mb-3"
        >
          <ArrowLeft className="w-3 h-3" />
          Kembali ke postingan
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Pertanyaan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Perbarui pertanyaan kamu. Perubahan akan tercatat di riwayat edit.
        </p>
      </div>
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <div className="p-6">
          <EditPostForm post={post} />
        </div>
      </Card>
    </div>
  );
}
