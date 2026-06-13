import { useEffect } from 'react';
import { useFormik } from 'formik';

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; color: string }) => void;
  initialData?: { name: string; color: string } | null;
}

export default function TagFormModal({ isOpen, onClose, onSubmit, initialData }: TagFormModalProps) {
  const formik = useFormik({
    initialValues: {
      name: '',
      color: '#D4AF37',
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
            {initialData ? 'Ubah Tag' : 'Tambah Tag Baru'}
          </h3>
          {/* <button 
            type="button"
            onClick={onClose}
            className="p-1 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all rounded-md"
          >
            <X className="h-4 w-4" />
          </button> */}
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[13px] font-semibold  text-zinc-400 block mb-1.5">
              Nama Tag
            </label>
            <input
              type="text"
              name="name"
              placeholder="Contoh: reactjs"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full bg-[#0B0B0C] border border-zinc-800 px-3 py-2 text-xs text-zinc-200 outline-none rounded-md focus:border-[#D4AF37] transition-all"
              required
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold  text-zinc-400 block mb-1.5">
              Warna Hex
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="color"
                onChange={formik.handleChange}
                value={formik.values.color}
                className="w-9.5 h-9.5 rounded-2xl cursor-pointer border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                name="color"
                placeholder="#D4AF37"
                onChange={formik.handleChange}
                value={formik.values.color}
                className="flex-1 bg-[#0B0B0C] border border-zinc-800 px-3 py-2 text-xs text-zinc-200 font-mono outline-none rounded-md focus:border-[#D4AF37] transition-all"
                required
              />
            </div>
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