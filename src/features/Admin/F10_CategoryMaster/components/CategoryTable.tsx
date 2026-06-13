// src/features/Admin/F10_CategoryMaster/components/CategoryTable.tsx
import { TagIcon, Edit2, Trash2, FolderGit, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../../components/ui/card';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import type { Category } from '../../../../types';

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({ categories, isLoading, onAdd, onEdit, onDelete }: CategoryTableProps) {
  return (
    <Card className="border-[#2A2A2C] bg-[#161618] rounded-xl overflow-hidden shadow-none">
      {/* Header */}
<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b border-zinc-800">
  <div className="space-y-1">
    {/* Konten Anda di sini */}
  </div>
  
  <button
    onClick={onAdd}
    className="bg-[#D4AF37] text-black text-xs font-bold py-2 px-4 rounded-md hover:bg-[#bfa032] transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(212,175,55,0.2)]"
  >
    <Plus className="h-4 w-4 stroke-[2.5]" /> Add Category
  </button>
</CardHeader>

      {/* Table Content */}
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center p-12"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2C] bg-[#111112]/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6">Slug URL</th>
                  <th className="py-4 px-6 text-center">Posts Count</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2C] text-xs">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#1A1A1C] transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-200">
                        <div className="flex items-center gap-3">
                          <TagIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
                          {cat.name}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-gray-400">/{cat.slug}</td>
                      <td className="py-4 px-6 text-center font-mono text-gray-400">{cat.posts_count}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(cat)}
                            className="p-2 border border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 rounded-full transition-all"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onDelete(cat.id)}
                            className="p-2 border border-[#2A2A2C] text-gray-500 hover:text-red-400 hover:border-red-900/50 rounded-full transition-all"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}