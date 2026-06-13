// src/pages/Admin/RoleManagementPage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus } from 'lucide-react';
import { getRoles, deleteRole } from '../../features/Admin/F8_RoleAndPermission/api';
import type { Role } from '../../features/Admin/F8_RoleAndPermission/types';
import RoleFormModal from '../../features/Admin/F8_RoleAndPermission/components/RoleFormModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

import RoleList from '../../features/Admin/F8_RoleAndPermission/components/RoleList';
import DeleteRoleModal from '../../features/Admin/F8_RoleAndPermission/components/DeleteRoleModal';

export default function RoleManagementPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: getRoles,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRole(deletingRole!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      toast.success('Role deleted.');
      setDeletingRole(null);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to delete role.');
    },
  });

  const roles = data?.data || [];

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingRole(null);
  };

  return (
    <ResponsiveLayout>
      <div className="w-full py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Role Management</h1>
              <p className="text-sm text-gray-500">Manage system roles and permissions.</p>
            </div>
          </div>
          <Button
            onClick={() => { setEditingRole(null); setIsFormOpen(true); }}
            className="bg-[#D4AF37] hover:bg-[#c29f2f] px-4  py-4.5 text-black font-bold text-sm rounded-md transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Role
          </Button>
        </div>

        {/* Content Card */}
        <Card className="border-[#2A2A2C] bg-[#161618] rounded-xl overflow-hidden shadow-none">
          <CardHeader className="pb-4 border-b border-[#2A2A2C] bg-[#111112]/50">
            <CardTitle className="text-sm font-bold text-gray-300 uppercase tracking-widest">
              Roles ({roles.length})
            </CardTitle>
            <CardDescription className="text-xs text-gray-600">
              System roles cannot be deleted.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <RoleList
              roles={roles}
              isLoading={isLoading}
              isError={isError}
              onEdit={handleEdit}
              onDelete={setDeletingRole}
            />
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <RoleFormModal open={isFormOpen} onClose={handleClose} editingRole={editingRole} />

        {/* Delete Confirmation Modal */}
        <DeleteRoleModal
          role={deletingRole}
          onClose={() => setDeletingRole(null)}
          onConfirm={() => deleteMutation.mutate()}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </ResponsiveLayout>
  );
}