// ─── src/features/User/F28_ProfileSettings/api/index.ts ───
// Dokumen Verifikasi: Arsitektur Frontend -> features/User/F28_ProfileSettings/api/
// Sesuai Tabel Integrasi API: F28_ProfileSettings (Get, Bio, Pass)

import apiClient from "@/lib/apiClient"; // Asumsi instansiasi Axios global Anda
import { ApiResponse } from "@/types";
import {
  ProfileData,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from "../types";

/**
 * 1. Ambil data profil sendiri untuk pre-fill form
 * API: GET /api/settings/profile
 * Guard: 🔒 Sanctum
 */
export const getProfileData = async (): Promise<ApiResponse<ProfileData>> => {
  const response =
    await apiClient.get<ApiResponse<ProfileData>>("/settings/profile");
  return response.data;
};

/**
 * 2. Update data profil utama (username/bio/avatar)
 * API: PUT /api/settings/profile
 * Guard: 🔒 Sanctum
 */
export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<ApiResponse<ProfileData>> => {
  // Hanya mengirim field yang diisi (partial update)
  const response = await apiClient.put<ApiResponse<ProfileData>>(
    "/settings/profile",
    payload,
  );
  return response.data;
};

/**
 * 3. Ganti password user (Tab Keamanan)
 * API: PUT /api/settings/password
 * Guard: 🔒 Sanctum
 */
export const updatePassword = async (
  payload: UpdatePasswordPayload,
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.put<ApiResponse<{ message: string }>>(
    "/settings/password",
    payload,
  );
  return response.data;
};

/**
 * 4. Helper (jika diperlukan) untuk mengunggah avatar mentah ke storage
 * sebelum mengirimkan URL-nya ke updateProfile.
 * Sesuai deskripsi FSD: "avatar_url?: string; // URL yang sudah di-upload ke storage"
 */
export const uploadAvatarFile = async (
  file: File,
): Promise<ApiResponse<{ avatar_url: string }>> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient.post<ApiResponse<{ avatar_url: string }>>(
    "/upload/avatar", // Asumsi endpoint storage backend
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
