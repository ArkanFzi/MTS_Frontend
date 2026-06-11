// src/features/Admin/F8_RoleAndPermission/types/index.ts

export interface Role {
  id: string;
  name: string;
  permissions: string[] | null;
  created_at: string;
}

export interface CreateRolePayload {
  name: string;
}

export interface UpdateRolePayload {
  name: string;
}

export interface RoleListResponse {
  status: string;
  message: string;
  data: Role[];
}

export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role;
}
