// src/features/Admin/F10_CategoryMaster/components/CategoryFormModal.tsx
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Save } from 'lucide-react';
import type { Category } from '../../../../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; slug: string }) => void;
  initialData?: { name: string; slug: string } | null;
}

export default function CategoryFormModal({ isOpen, onClose, onSubmit, initialData }: CategoryFormModalProps) {
  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
    },
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  useEffect(() => {
    if (initialData) {
      formik.setValues(initialData);
    } else {
      formik.resetForm();
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-['Inter']">
      <div className="w-full max-w-md bg-[#161618] border border-zinc-800 shadow-2xl relative rounded-xl overflow-hidden">
        
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#111112]">
          <h3 className="text-sm font-semibold text-zinc-100 uppercase">
            {initialData ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
          </h3>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-zinc-400 block mb-1.5">
              Nama Kategori
            </label>
            <input
              type="text"
              name="name"
              placeholder="Contoh: Motion Graphics"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full bg-[#0B0B0C] border border-zinc-800 px-3 py-2 text-xs text-zinc-200 outline-none rounded-md focus:border-[#D4AF37] transition-all"
              required
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold text-zinc-400 block mb-1.5">
              Slug URL
            </label>
            <input
              type="text"
              name="slug"
              placeholder="contoh: motion-graphics"
              onChange={formik.handleChange}
              value={formik.values.slug}
              className="w-full bg-[#0B0B0C] border border-zinc-800 px-3 py-2 text-xs text-zinc-200 font-mono outline-none rounded-md focus:border-[#D4AF37] transition-all"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold rounded-md hover:bg-[#bfa032] transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(212,175,55,0.2)]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}