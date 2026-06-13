// src/pages/User/BookmarksPage.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchBookmarks } from '../../features/User/F24_BookmarkPost/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import BookmarkSearchHeader from '../../features/User/F24_BookmarkPost/components/BookmarkSearchHeader';
import BookmarkCard from '../../features/User/F24_BookmarkPost/components/BookmarkCard';
import { Card, CardContent } from '../../components/ui/card';
import { FolderHeart } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function BookmarksPage() {
  // 1. Mengambil data bookmark menggunakan React Query useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
  });

  // 2. Setup Formik & Yup untuk manajemen input kolom pencarian local
  const formik = useFormik({
    initialValues: {
      searchQuery: '',
    },
    validationSchema: Yup.object({
      searchQuery: Yup.string().max(30, 'Maksimal 30 karakter bro'),
    }),
    onSubmit: () => {}
  });

  const bookmarks = data?.data || [];

  // 3. Logika Filter: Menyaring data berdasarkan judul postingan atau catatan user
  const filteredBookmarks = bookmarks.filter((item) => {
    const query = formik.values.searchQuery.toLowerCase();
    const matchTitle = item.post?.title?.toLowerCase().includes(query);
    return matchTitle;
  });

  // Handle State Loading Utama
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle State Error API
  if (isError) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card className="bg-[#161618] border border-zinc-800 shadow-xl p-12 text-center">
          <p className="text-sm text-red-400 font-mono">Gagal memuat data bookmark dari server.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <Card className="bg-[#161618] border border-zinc-800 shadow-xl">
        
        <BookmarkSearchHeader formik={formik} />

        <CardContent className="p-0">
          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 space-y-3">
              <FolderHeart className="h-12 w-12 text-zinc-700 stroke-[1.5]" />
              <p className="text-zinc-400 text-sm">Belum ada postingan bookmark yang ditemukan.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-zinc-800">
              {filteredBookmarks.map((item) => (
                <BookmarkCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}