// src/pages/User/PostEditHistoryPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileEdit, Clock } from 'lucide-react';
import { getPostHistory } from '../../features/User/F19_PostEditHistory/api';
import PostHistoryDiff from '../../features/User/F19_PostEditHistory/components/PostHistoryDiff';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';

export default function PostEditHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post-history', id],
    queryFn: () => getPostHistory(id!),
    enabled: !!id,
  });

  const history = data?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-6 space-y-4">
        <Skeleton className="w-32 h-5" />
        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-6 text-center py-20">
        <p className="text-red-400 text-sm">Gagal memuat riwayat edit postingan.</p>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mt-4 border-[#2A2A2C] text-gray-400 hover:bg-[#161618]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/posts/${id}`)}
          className="text-gray-400 hover:text-white hover:bg-[#1A1A1C] -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Postingan
        </Button>
        <span className="text-gray-700">/</span>
        <span className="text-sm text-gray-400 font-mono">Riwayat Edit</span>
      </div>

      <Card className="border-[#2A2A2C] bg-[#161618]">
        <CardHeader className="border-b border-[#2A2A2C]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-[#D4AF37]" />
                Riwayat Edit Postingan
              </CardTitle>
              <CardDescription className="text-gray-500 text-sm mt-1">
                {history.length > 0
                  ? `Total ${history.length} revisi tercatat`
                  : 'Belum ada revisi untuk postingan ini'}
              </CardDescription>
            </div>
            {history.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-gray-600">
                <Clock className="w-3.5 h-3.5" />
                Terbaru di atas
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <PostHistoryDiff history={history} />
        </CardContent>
      </Card>
    </div>
  );
}
