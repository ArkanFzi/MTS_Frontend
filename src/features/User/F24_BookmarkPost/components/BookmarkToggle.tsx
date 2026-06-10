// TODO: Dumb UI Component for F24_BookmarkPost
// src/features/User/F24_BookmarkPost/components/BookmarkToggle.tsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toggleBookmark } from '../api';
import { Bookmark, Loader2, MessageSquarePlus, X } from 'lucide-react';

interface BookmarkToggleProps {
  postId: string;
  isInitiallyBookmarked?: boolean;
}

export default function BookmarkToggle({ postId, isInitiallyBookmarked = false }: BookmarkToggleProps) {
  const queryClient = useQueryClient();
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);

  // 1. React Query Mutation untuk hit API Laravel
  const mutation = useMutation({
    mutationFn: (notes?: string) => toggleBookmark(postId, notes),
    onSuccess: () => {
      // Invalidate cache global bookmarks agar semua UI yang menampilkan list bookmark otomatis update
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      setShowNoteModal(false);
      formik.resetForm();
    },
    onError: (err) => {
      console.error("Gagal mengubah status bookmark:", err);
    }
  });

  // 2. Formik & Yup untuk Validasi Catatan Tambahan (Minimalist-Brutalist Form)
  const formik = useFormik({
    initialValues: {
      notes: '',
    },
    validationSchema: Yup.object({
      notes: Yup.string()
        .max(100, 'Catatan kepanjangan, maksimal 100 karakter bro')
        .optional(),
    }),
    onSubmit: (values) => {
      mutation.mutate(values.notes);
    },
  });

  const handleSimpleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah klik tembus ke card postingan induk
    
    if (isInitiallyBookmarked) {
      // Kalau sudah dibookmark, langsung hapus tanpa modal catatan
      mutation.mutate(undefined);
    } else {
      // Kalau belum dibookmark, buka modal brutalist untuk nanya mau pakai catatan/tidak
      setShowNoteModal(true);
    }
  };

  return (
    <div className="relative inline-block font-['Inter']">
      {/* 🟢 TOMBOL UTAMA BOOKMARK (Tailwind CSS Brutalist) */}
      <button
        onClick={handleSimpleToggle}
        disabled={mutation.isPending}
        className={`flex items-center justify-center p-2.5 border transition-all active:translate-x-p active:translate-y-px disabled:opacity-50 ${
          isInitiallyBookmarked
            ? 'bg-[#0B0B0C] border-[#2A2A2C] text-[#D4AF37] hover:bg-red-950/30 hover:text-red-400 hover:border-red-900'
            : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-[#D4AF37] hover:border-zinc-700'
        }`}
        title={isInitiallyBookmarked ? "Hapus dari simpanan" : "Simpan postingan"}
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark className={`h-4 w-4 ${isInitiallyBookmarked ? 'fill-[#D4AF37]' : ''}`} />
        )}
      </button>

      {/* 🟢 MODAL POPUP JIKA MAU TAMBAH CATATAN (Style Brutalist) */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div 
            className="w-full max-w-sm bg-[#161618] border-2 border-zinc-700 p-5 shadow-[4px_4px_0px_0px_rgba(212,175,55,0.2)] text-left"
            onClick={(e) => e.stopPropagation()} // Supaya ga ketutup pas klik area dalam modal
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <MessageSquarePlus className="h-4 w-4 text-[#D4AF37]" /> Tambah Catatan? (Opsional)
              </h3>
              <button 
                onClick={() => setShowNoteModal(false)}
                className="text-zinc-500 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Formik */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Contoh: Bacaan penting buat UTS besok dari suhu..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.notes}
                  className={`w-full bg-[#0B0B0C] border p-2.5 text-xs text-zinc-200 outline-none resize-none transition-all ${
                    formik.touched.notes && formik.errors.notes
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-zinc-800 focus:border-[#D4AF37]'
                  }`}
                />
                {formik.touched.notes && formik.errors.notes && (
                  <p className="mt-1 text-[11px] text-red-500 font-mono">{formik.errors.notes}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => mutation.mutate(undefined)} // Langsung simpan kosongan tanpa catatan
                  disabled={mutation.isPending}
                  className="px-3 py-2 border border-zinc-800 text-zinc-400 bg-transparent hover:bg-zinc-900 transition-all"
                >
                  Lewati
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-3 py-2 bg-[#D4AF37] text-black font-bold hover:bg-[#bfa032] flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {mutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  Simpan Bookmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}