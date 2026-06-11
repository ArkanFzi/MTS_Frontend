// src/pages/User/EditPostPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getPostDetail } from '../../features/User/F16_Post/api';
import EditPostForm from '../../features/User/F16_Post/components/EditPostForm';
import { Card } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostDetail(id!),
    enabled: !!id,
  });

  const post = data?.data;

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
