// ─── src/pages/User/ProfileSettingsPage.tsx ───
// Dokumen Verifikasi: PAGE 16 — ProfileSettingsPage (`/me/settings`)
// Layout: `UserLayout`

import React from "react";
import UserLayout from "@/layouts/UserLayout"; // Sesuai arsitektur layout
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Sesuai arsitektur UI
import { useQuery } from "@tanstack/react-query"; // Sesuai rekomendasi React Query
import { getProfileData } from "@/features/User/F28_ProfileSettings/api"; // Import dari domain fitur
import SettingsForm from "@/features/User/F28_ProfileSettings/components/SettingsForm"; // Import komponen fitur
import AvatarUploader from "@/features/User/F28_ProfileSettings/components/AvatarUploader"; // Import komponen fitur
import LoadingSpinner from "@/components/shared/LoadingSpinner"; // Komponen shared shared sesuai dokumen

const ProfileSettingsPage: React.FC = () => {
  // Ambil data profil menggunakan useQuery. Ini akan memicu hit API otomatis.
  const {
    data: profileResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profileData"],
    queryFn: getProfileData,
  });

  const profileData = profileResponse?.data;

  return (
    <UserLayout
      title="Profile Settings"
      subtitle="Manage your public identity and security preferences."
    >
      {/* Header Halaman Sesuai UI */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-sm text-zinc-400">
          Manage your public identity and security preferences.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <div className="text-center bg-red-950 p-6 rounded-lg text-white">
          <p className="font-semibold text-lg">Gagal memuat data profil.</p>
          <p className="text-sm text-zinc-300">{(error as any)?.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-zinc-700 px-4 py-2 rounded text-xs hover:bg-zinc-600"
          >
            Coba Lagi
          </button>
        </div>
      ) : !profileData ? (
        <div className="text-center text-zinc-400 p-6 rounded-lg bg-obsidian-black border border-zinc-700">
          Data profil tidak ditemukan.
        </div>
      ) : (
        /* Struktur Tab Sesuai UI */
        <Tabs defaultValue="edit" className="w-full h-full flex flex-col">
          <TabsList className="bg-obsidian-black border-none justify-start space-x-2 h-auto p-0 mb-6">
            <TabsTrigger
              value="edit"
              className="text-xs px-0 py-2 rounded-none data-[state=active]:bg-obsidian-black data-[state=active]:text-gold data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-gold text-zinc-300"
            >
              Edit Profil
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-xs px-0 py-2 rounded-none data-[state=active]:bg-obsidian-black data-[state=active]:text-gold data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-gold text-zinc-300"
            >
              Keamanan
            </TabsTrigger>
          </TabsList>

          {/* Konten Tab 'Edit Profil' - Sesuai Gambar UI */}
          <TabsContent value="edit" className="flex flex-grow space-x-6">
            {/* Bagian Kiri: Avatar */}
            <div className="w-[30%]">
              <AvatarUploader
                currentAvatarUrl={profileData.avatar_url}
                username={profileData.username}
                // Callback jika avatar berhasil diunggah di F28/api
                onAvatarUpdated={(newUrl) =>
                  queryClient.setQueryData(["profileData"], {
                    ...profileResponse,
                    data: { ...profileData, avatar_url: newUrl },
                  })
                }
              />
            </div>

            {/* Bagian Kanan: Formulir Teks */}
            <div className="flex-1">
              <SettingsForm profileData={profileData} />
            </div>
          </TabsContent>

          {/* Konten Tab 'Keamanan' - Kosong di Gambar UI tapi diperlukan untuk Ganti Password */}
          <TabsContent
            value="security"
            className="flex flex-grow items-center justify-center bg-obsidian-black border border-dashed border-zinc-700 rounded-lg h-64 text-zinc-400"
          >
            {/* TODO: Implementasikan PasswordUpdateForm di F28/components */}
            Formulir Ganti Password (keamanan) akan ditambahkan di sini.
          </TabsContent>
        </Tabs>
      )}
    </UserLayout>
  );
};

export default ProfileSettingsPage;
