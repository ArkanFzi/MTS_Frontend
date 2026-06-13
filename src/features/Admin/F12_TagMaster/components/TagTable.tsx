// src/features/Admin/F12_TagMaster/components/TagTable.tsx
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../../components/ui/card';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import type { Tag } from '../../../../types';

interface TagTableProps {
  tags: Tag[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
}

export default function TagTable({ tags, isLoading, onAdd, onEdit, onDelete }: TagTableProps) {
  return (
    <Card className="border-[#2A2A2C] bg-[#161618] rounded-xl overflow-hidden shadow-none">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b border-zinc-800">
        <div className="space-y-1">
          {/* Header title/description bisa ditambahkan di sini jika perlu */}
        </div>
        
        <button
          onClick={onAdd}
          className="bg-[#D4AF37] text-black text-xs font-bold py-2 px-4 rounded-md hover:bg-[#bfa032] transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(212,175,55,0.2)]"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" /> Add Tag
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
                  <th className="py-4 px-6">Tag Name</th>
                  <th className="py-4 px-6">Color</th>
                  <th className="py-4 px-6 text-center">Usage Count</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2C] text-xs">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-[#1A1A1C] transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-200">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ backgroundColor: `${tag.color || '#D4AF37'}20`, color: tag.color || '#D4AF37' }}
                        >
                          #{tag.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-gray-400 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color || '#D4AF37' }}></div>
                        {tag.color || '#D4AF37'}
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-gray-400">{tag.usage_count || 0}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(tag)}
                            className="p-2 border border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 rounded-full transition-all"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onDelete(tag.id)}
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
                    <td colSpan={4} className="py-12 text-center text-gray-500">No tags found.</td>
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