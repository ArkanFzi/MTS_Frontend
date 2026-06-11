// ─── src/pages/User/ProfileSettingsPage.tsx ───
// ─── Bagian Atas src/pages/User/ProfileSettingsPage.tsx ───
import React, { useState } from "react";
import UserLayout from "../../layouts/UserLayout"; 

// Mengubah semua komponen UI ke relative path agar lolos dari error Vite
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getProfileData, uploadAvatarFile } from "../../features/User/F28_ProfileSettings/api";
import SettingsForm from "../../features/User/F28_ProfileSettings/components/SettingsForm";
import LoadingSpinner from "../../components/shared/LoadingSpinner"; // Jika loading spinner juga di shared
import type { ApiResponse, ProfileData } from "../../features/User/F28_ProfileSettings/types";
import { UserIcon, UploadCloudIcon } from "lucide-react";

const ProfileSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    data: profileResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponse<ProfileData>, AxiosError<ApiResponse<unknown>>>({
    queryKey: ["profileData"],
    queryFn: getProfileData,
  });

  const avatarMutation = useMutation<
    ApiResponse<{ avatar_url: string }>,
    AxiosError<ApiResponse<unknown>>,
    File
  >({
    mutationFn: uploadAvatarFile,
    onSuccess: (response) => {
      if (profileResponse) {
        queryClient.setQueryData(["profileData"], {
          ...profileResponse,
          data: {
            ...profileResponse.data,
            avatar_url: response.data.avatar_url,
          },
        });
      }
      setUploadError(null);
    },
    onError: (err) => {
      const backendMessage = err.response?.data?.message;
      setUploadError(backendMessage || "Gagal mengunggah gambar.");
    },
  });

  const profileData = profileResponse?.data;

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) validateAndUpload(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) validateAndUpload(files[0]);
  };

  const validateAndUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Hanya file gambar yang diperbolehkan.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 2MB.");
      return;
    }
    avatarMutation.mutate(file);
  };

  return (
    <UserLayout title="Profile Settings">
      {/* Judul Halaman */}
      <div className="mb-10 space-y-2 border-b border-zinc-900 pb-6">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Profile Settings
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
          Kelola representasi identitas publik Anda dan konfigurasi preferensi
          sistem keamanan platform.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-72 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <div className="text-center bg-red-950/15 p-8 rounded-xl border border-red-900/40 text-white shadow-xl max-w-xl mx-auto">
          <p className="font-semibold text-lg text-red-400">
            Gagal Memuat Data
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {(error as any)?.message || "Terjadi kesalahan koneksi server."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 bg-zinc-800 hover:bg-zinc-700 text-xs px-5 py-2.5 rounded-lg text-white font-semibold transition cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      ) : !profileData ? (
        <div className="text-center text-zinc-500 p-8 rounded-xl bg-[#161618] border border-zinc-800 max-w-md mx-auto">
          Data profil kosong atau tidak ditemukan.
        </div>
      ) : (
        <Tabs
          defaultValue="edit"
          className="w-full h-full flex flex-col space-y-8"
        >
          {/* Navigasi Tab */}
          <TabsList className="bg-transparent border-b border-zinc-800 justify-start space-x-8 h-auto p-0 rounded-none w-full">
            <TabsTrigger
              value="edit"
              className="text-sm font-medium px-1 py-3 rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-[#D4AF37] data-[state=active]:font-bold data-[state=active]:border-[#D4AF37] text-zinc-400 transition-all duration-200 shadow-none pb-3"
            >
              Edit Profil
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-sm font-medium px-1 py-3 rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-[#D4AF37] data-[state=active]:font-bold data-[state=active]:border-[#D4AF37] text-zinc-400 transition-all duration-200 shadow-none pb-3"
            >
              Keamanan Akun
            </TabsTrigger>
          </TabsList>

          {/* Isi Konten Tab Edit */}
          <TabsContent
            value="edit"
            className="flex flex-col md:flex-row gap-8 m-0 outline-none"
          >
            {/* PANEL KIRI: Unggah Foto */}
            <div className="w-full md:w-[32%]">
              <Card className="p-8 bg-[#161618] border border-zinc-800/60 shadow-xl rounded-xl flex flex-col items-center justify-center space-y-6">
                <div
                  className={`relative rounded-full p-1.5 border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
                    dragActive
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.02]"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Avatar className="w-32 h-32 border-4 border-[#161618] shadow-2xl">
                    <AvatarImage
                      src={profileData.avatar_url || ""}
                      alt={`Avatar ${profileData.username}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-zinc-900 text-[#D4AF37]/70">
                      <UserIcon className="w-14 h-14" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Efek Loading saat Berlangsung Mengunggah */}
                  {avatarMutation.isPending && (
                    <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D4AF37] border-t-transparent" />
                    </div>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <h3 className="font-bold text-lg text-white tracking-wide">
                    Avatar
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-[200px] mx-auto leading-relaxed">
                    Semburkan gambar Anda di sini atau ketuk tombol bawah.
                    (Format PNG/JPG maksimal 2MB)
                  </p>
                </div>

                <input
                  type="file"
                  id="avatar-direct-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="sr-only"
                  disabled={avatarMutation.isPending}
                />
                <label htmlFor="avatar-direct-input" className="w-full">
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold text-xs tracking-wide rounded-lg transition-colors cursor-pointer"
                    disabled={avatarMutation.isPending}
                  >
                    <span>
                      <UploadCloudIcon className="mr-2 h-4 w-4 text-zinc-400" />
                      Upload Photo
                    </span>
                  </Button>
                </label>

                {uploadError && (
                  <div className="text-[11px] text-red-400 bg-red-950/20 p-2.5 rounded-lg w-full text-center border border-red-900/30 animate-shake">
                    {uploadError}
                  </div>
                )}
              </Card>
            </div>

            {/* PANEL KANAN: Formulir Data */}
            <div className="flex-1 outline-none">
              <SettingsForm profileData={profileData} />
            </div>
          </TabsContent>

          {/* Isi Konten Tab Keamanan */}
          <TabsContent value="security" className="m-0 outline-none">
            <div className="flex flex-col items-center justify-center bg-[#161618] border border-dashed border-zinc-800 rounded-xl h-72 text-zinc-500 text-sm space-y-2 shadow-inner">
              <p className="font-medium text-zinc-400">Security Dashboard</p>
              <p className="text-xs text-zinc-600">
                Formulir enkripsi pergantian kata sandi dapat diletakkan di
                bagian ini.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </UserLayout>
  );
};

export default ProfileSettingsPage;
