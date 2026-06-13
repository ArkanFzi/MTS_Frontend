// src/pages/User/BookmarksPage.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchBookmarks } from '../../features/User/F24_BookmarkPost/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import BookmarkSearchHeader from '../../features/User/F24_BookmarkPost/components/BookmarkSearchHeader';
import BookmarkCard from '../../features/User/F24_BookmarkPost/components/BookmarkCard';
import { Card } from '../../components/ui/card';
import { FolderHeart, AlertTriangle } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

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

  // 3. Logika Filter: Menyaring data berdasarkan judul postingan atau catatan user yang aman dari undefined
  const filteredBookmarks = bookmarks.filter((item) => {
    if (!item || !item.post) return false;
    
    const query = formik.values.searchQuery.toLowerCase();
    const matchTitle = item.post.title?.toLowerCase().includes(query);
    return matchTitle;
  });

  // Handle State Loading Utama (Dibungkus ResponsiveLayout dengan padding yang aman)
  if (isLoading) {
    return (
      <ResponsiveLayout>
        <div className="flex min-h-[50vh] items-center justify-center p-4 w-full">
          <LoadingSpinner />
        </div>
      </ResponsiveLayout>
    );
  }

  // Handle State Error API (Dibungkus ResponsiveLayout dengan padding yang aman)
  if (isError) {
    return (
      <ResponsiveLayout>
        <div className="w-full py-6 md:py-8 px-4 md:px-0">
          <Card className="bg-[#131315] border border-red-950/40 p-6 md:p-12 text-center rounded-xl flex flex-col items-center justify-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
            <p className="text-sm text-red-400 font-medium max-w-md">
              Gagal memuat data bookmark dari server. Coba muat ulang halaman.
            </p>
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      {/* Container utama dengan padding responsif */}
      <div className="w-full py-6 md:py-8 px-4 md:px-0 space-y-6">
        
        {/* ── Header & Form Pencarian ── */}
        <BookmarkSearchHeader formik={formik} />

        {/* ── Sektor List Bookmark Konten ── */}
        <div className="w-full">
          {filteredBookmarks.length === 0 ? (
            /* State Kosong / Hasil Filter Tidak Ditemukan */
            <Card className="bg-[#131315] border border-[#2A2A2C] rounded-xl text-center p-6 md:p-12 flex flex-col items-center justify-center space-y-3">
              <FolderHeart className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-700 stroke-[1.5] shrink-0" />
              <div className="space-y-1.5 px-2">
                <p className="text-zinc-200 text-base font-semibold">Tidak ada bookmark</p>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">
                  {formik.values.searchQuery 
                    ? `Kata kunci "${formik.values.searchQuery}" tidak cocok dengan dokumen manapun.`
                    : 'Belum ada postingan bookmark yang tersimpan di akun lu.'}
                </p>
              </div>
            </Card>
          ) : (
            /* List Card Item Responsif dengan jarak gap-4 yang konsisten */
            <div className="flex flex-col gap-4 w-full">
              {filteredBookmarks.map((item, index) => (
                <div 
                  key={item.id}
                  className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <BookmarkCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </ResponsiveLayout>
  );
}