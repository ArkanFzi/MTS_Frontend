import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { createRole, updateRole } from '../api';
import type { Role } from '../types';
import { Button } from '../../../../components/ui/button';

const roleSchema = Yup.object({
  name: Yup.string()
    .required('Role name is required')
    .min(2, 'Min 2 characters')
    .max(50, 'Max 50 characters')
    .matches(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores'),
});

export interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  editingRole: Role | null;
}

export default function RoleFormModal({ open, onClose, editingRole }: RoleModalProps) {
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: { name: editingRole?.name ?? '' },
    validationSchema: roleSchema,
    enableReinitialize: true,
    onSubmit: () => {
      mutation.mutate(formik.values.name);
    },
  });

  const mutation = useMutation({
    mutationFn: (name: string) =>
      editingRole
        ? updateRole(editingRole.id, { name })
        : createRole({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      toast.success(editingRole ? 'Role updated.' : 'Role created.');
      formik.resetForm();
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Operation failed.');
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Di sini bg-black/70 digunakan tanpa backdrop-blur-sm */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-sm bg-[#161618] border border-[#2A2A2C] rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">
            {editingRole ? 'Edit Role' : 'Create Role'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>  

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Role Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. content_writer"
              className="w-full bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg p-2.5 text-sm text-gray-200 outline-none focus:border-[#D4AF37] transition-colors"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-red-400 mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2A2A2C] text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !formik.isValid || !formik.dirty}
              className="bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-semibold disabled:opacity-40"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingRole ? (
                'Update Role'
              ) : (
                'Create Role'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
