// ─── src/features/User/F28_ProfileSettings/api/index.ts ───
// Dokumen Verifikasi: Arsitektur Frontend -> features/User/F28_ProfileSettings/api/
// Sesuai Tabel Integrasi API: F28_ProfileSettings (Get, Bio, Pass)

// 1. IMPORT AXIOS KUSTOM ANDA DISINI
// Sesuaikan path '../../' atau '@/' menuju ke lokasi file konfigurasi Axios yang baru saja Anda buat
import apiClient from "@/lib/axios";

import type {
  ApiResponse,
  ProfileData,
  UpdatePasswordPayload,
  UpdateProfilePayload,
} from "../types";

/**j
 * 1. Ambil data profil sendiri untuk pre-fill form
 * API: GET /api/settings/profile
 * Guard: 🔒 Sanctum (Otomatis menggunakan Cookie via withCredentials)
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
 * 4. Helper untuk mengunggah avatar mentah ke storage
 * Sebelum mengirimkan URL-nya ke updateProfile.
 */
export const uploadAvatarFile = async (
  file: File,
): Promise<ApiResponse<{ avatar_url: string }>> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient.post<ApiResponse<{ avatar_url: string }>>(
    "/upload/avatar",
    formData,
    {
      headers: {
        // Axios otomatis mengatur Boundary Form Data jika 'Content-Type' dihapus atau dioverride seperti ini
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
