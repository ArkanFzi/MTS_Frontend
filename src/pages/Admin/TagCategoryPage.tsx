// src/pages/Admin/TagCategoryPage.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Plus, Trash2, Edit2, Tag, FolderGit } from 'lucide-react';

// Import komponen modal yang ada di folder F10
import CategoryFormModal from '../../features/Admin/F10_CategoryMaster/components/CategoryFormModal';

// Data Mock Awal untuk Keperluan Testing UI
const INITIAL_CATEGORIES = [
  { id: 1, name: 'UI/UX Design', slug: 'ui-ux', posts_count: 12 },
  { id: 2, name: 'Motion Graphics', slug: 'motion', posts_count: 8 },
  { id: 3, name: 'Video Editing', slug: 'video', posts_count: 5 },
  { id: 4, name: 'Web Development', slug: 'web', posts_count: 19 },
];

export default function TagCategoryPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof INITIAL_CATEGORIES[0] | null>(null);

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: typeof INITIAL_CATEGORIES[0]) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (values: { name: string; slug: string }) => {
    const formattedSlug = values.slug.toLowerCase().replace(/\s+/g, '-');

    if (selectedCategory) {
      // Logika Update / Edit Data Lokal
      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, name: values.name, slug: formattedSlug } 
          : cat
      ));
    } else {
      // Logika Tambah Data Lokal Baru
      const newCat = {
        id: Date.now(),
        name: values.name,
        slug: formattedSlug,
        posts_count: 0
      };
      setCategories([...categories, newCat]);
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Apakah kamu yakin ingin menghapus kategori ini?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 font-['Inter']">
      <Card className="bg-[#161618] border border-zinc-800 shadow-xl rounded-none md:rounded-lg">
        
        {/* HEADER PANEL */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <FolderGit className="h-5 w-5 text-[#D4AF37]" /> Panel Master Kategori
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Kelola daftar utama kategori forum diskusi aplikasi.
            </CardDescription>
          </div>

          {/* TOMBOL PEMICU MODAL */}
          <button
            onClick={handleOpenAddModal}
            className="bg-[#D4AF37] text-black text-xs font-bold py-2 px-4 rounded-md hover:bg-[#bfa032] transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-[2px_2px_0px_0px_rgba(212,175,55,0.2)]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" /> Tambah Kategori
          </button>
        </CardHeader>

        {/* TABEL DATA KATEGORI */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-[#0B0B0C] text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Nama Kategori</th>
                  <th className="py-3 px-6">Slug URL</th>
                  <th className="py-3 px-6 text-center">Jumlah Topik</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-xs">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="py-4 px-6 font-medium text-zinc-200">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-zinc-600" />
                        {cat.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-400">
                      /{cat.slug}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-zinc-400">
                      {cat.posts_count} posts
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-[#D4AF37] hover:border-zinc-700 rounded transition-all"
                          title="Ubah Data"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-zinc-700 rounded transition-all"
                          title="Hapus Data"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* POP-UP COMPONENT MODAL DARI FOLDER F10 */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory ? { name: selectedCategory.name, slug: selectedCategory.slug } : null}
      />
    </div>
  );
}