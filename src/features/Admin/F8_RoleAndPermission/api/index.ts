import axios from '../../../../lib/axios';
import type { CreateRolePayload, UpdateRolePayload, RoleListResponse, RoleResponse } from '../types';

export const getRoles = async (): Promise<RoleListResponse> => {
  const response = await axios.get('/api/admin/roles');
  return response.data;
};

export const createRole = async (data: CreateRolePayload): Promise<RoleResponse> => {
  const response = await axios.post('/api/admin/roles', data);
  return response.data;
};

export const updateRole = async (id: string, data: UpdateRolePayload): Promise<RoleResponse> => {
  const response = await axios.put(`/api/admin/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`/api/admin/roles/${id}`);
  return response.data;
};
