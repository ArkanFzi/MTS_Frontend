// src/pages/User/BookmarksPage.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBookmarks } from '../../features/User/F24_BookmarkPost/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import BookmarkToggle from '../../features/User/F24_BookmarkPost/components/BookmarkToggle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { BookMarked, Search, FolderHeart, User } from 'lucide-react';
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
        
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              {/* 🟢 2. MENGUBAH ICON KEPALA HALAMAN DI SINI */}
              <BookMarked className="h-5 w-5 text-[#D4AF37]" /> Postingan Tersimpan
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Kumpulan materi rujukan dan diskusi penting yang kamu simpan.
            </CardDescription>
          </div>

          {/* Form Filter Pencarian (Formik Controlled) */}
          <form className="relative w-full sm:w-80" onSubmit={formik.handleSubmit}>
            <input
              type="text"
              name="searchQuery"
              placeholder="Cari judul atau catatan..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.searchQuery}
              className={`w-full bg-[#0B0B0C] border px-4 py-2 pl-10 text-xs text-zinc-200 outline-none transition-all rounded-md ${
                formik.touched.searchQuery && formik.errors.searchQuery
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-zinc-800 focus:border-[#D4AF37]'
              }`}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            
            {/* Validasi Error dari Yup */}
            {formik.touched.searchQuery && formik.errors.searchQuery && (
              <span className="absolute -bottom-5 left-0 text-[10px] text-red-400 font-mono">
                {formik.errors.searchQuery}
              </span>
            )}
          </form>
        </CardHeader>

        <CardContent className="p-0">
          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 space-y-3">
              <FolderHeart className="h-12 w-12 text-zinc-700 stroke-[1.5]" />
              <p className="text-zinc-400 text-sm">Belum ada postingan bookmark yang ditemukan.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-zinc-800">
              {filteredBookmarks.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start justify-between p-5 transition-all hover:bg-zinc-900/40"
                >
                  <div className="space-y-2 flex-1">
                    {/* Info Pembuat Postingan */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                      <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <User className="h-2.5 w-2.5 text-zinc-400" />
                      </div>
                      <span>
                        Disimpan dari <span className="text-zinc-300 font-bold hover:underline cursor-pointer">@{item.post?.user?.username || 'suhu'}</span>
                      </span>
                    </div>

                    {/* Judul Postingan Asli */}
                    <h2 className="text-base font-semibold text-zinc-200 hover:text-[#D4AF37] cursor-pointer transition-colors tracking-tight line-clamp-1">
                      {item.post?.title}
                    </h2>

                    {/* Cuplikan Konten */}
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.post?.excerpt}
                    </p>
                  </div>

                  {/* Aksi Lepas/Hapus Bookmark */}
                  <div className="ml-6 flex-shrink-0">
                    <BookmarkToggle postId={item.post_id} isInitiallyBookmarked={true} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}