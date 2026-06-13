// src/features/Admin/F8_RoleAndPermission/components/RoleList.tsx
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import type { Role } from '../types';
import { SYSTEM_ROLES } from '../types';

interface RoleListProps {
  roles: Role[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleList({
  roles,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: RoleListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-sm">Failed to load roles.</p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 text-sm">
        No roles found.
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#2A2A2C]">
      {roles.map((role) => {
        const isSystem = SYSTEM_ROLES.includes(role.name);
        return (
          <div
            key={role.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-[#2A2A2C]/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 ${
                  role.name === 'admin'
                    ? 'bg-red-950/40 text-red-400 border-red-900'
                    : role.name === 'moderator'
                    ? 'bg-blue-950/40 text-blue-400 border-blue-900'
                    : 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C]'
                }`}
              >
                {role.name}
              </Badge>
              {isSystem && (
                <span className="text-[10px] text-gray-600 font-mono">SYSTEM</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(role)}
                className="h-8 border-[#2A2A2C] text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 gap-1"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
              {!isSystem && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(role)}
                  className="h-8 border-[#2A2A2C] text-red-500 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/50 gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
