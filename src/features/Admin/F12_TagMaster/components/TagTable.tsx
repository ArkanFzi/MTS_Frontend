// src/features/Admin/F12_TagMaster/components/TagTable.tsx
import { Hash, Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
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
    <Card className="bg-[#161618] border border-zinc-800 shadow-xl rounded-none md:rounded-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b border-zinc-800">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <Hash className="h-5 w-5 text-[#D4AF37]" /> Tags Master Panel
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Manage tags used across discussions.
          </CardDescription>
        </div>
        <button
          onClick={onAdd}
          className="bg-[#D4AF37] text-black text-xs font-bold py-2 px-4 rounded-md hover:bg-[#bfa032] transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(212,175,55,0.2)]"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" /> Add Tag
        </button>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center p-8"><LoadingSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-[#0B0B0C] text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Tag Name</th>
                  <th className="py-3 px-6">Color</th>
                  <th className="py-3 px-6 text-center">Usage Count</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-xs">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="py-4 px-6 font-medium text-zinc-200">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ backgroundColor: `${tag.color || '#D4AF37'}20`, color: tag.color || '#D4AF37' }}
                      >
                        #{tag.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-400 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color || '#D4AF37' }}></div>
                      {tag.color || '#D4AF37'}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-zinc-400">{tag.usage_count || 0} times</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(tag)}
                          className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-[#D4AF37] hover:border-zinc-700 rounded transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(tag.id)}
                          className="p-1.5 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-zinc-700 rounded transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tags.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-500">No tags found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
