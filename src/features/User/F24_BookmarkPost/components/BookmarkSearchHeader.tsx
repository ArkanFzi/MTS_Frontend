// src/features/User/F24_BookmarkPost/components/BookmarkSearchHeader.tsx
import { BookMarked, Search } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import type { FormikProps } from 'formik';

interface BookmarkSearchHeaderProps {
  formik: FormikProps<{ searchQuery: string }>;
}

export default function BookmarkSearchHeader({ formik }: BookmarkSearchHeaderProps) {
  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b border-zinc-800">
      <div className="space-y-1">
        <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
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
  );
}
