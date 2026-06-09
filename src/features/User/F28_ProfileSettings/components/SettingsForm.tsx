// ─── src/features/User/F28_ProfileSettings/components/SettingsForm.tsx ───
// Dokumen Verifikasi: Arsitektur Frontend -> features/User/F28_ProfileSettings/components/
// Referensi UI: Panel kanan dengan formulir username, email, dan bio

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Library formulir populer
import { Input } from "@/components/ui/input"; // Sesuai tema UI
import { Button } from "@/components/ui/button"; // Sesuai tema Emas #D4AF37
import { Textarea } from "@/components/ui/textarea"; // Untuk Bio / Expertise
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card"; // Sesuai tema Obsidian Black #161618
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Sesuai rekomendasi React Query
import { updateProfile } from "../api";
import { ProfileData, UpdateProfilePayload } from "../types";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast"; // Asumsi sistem toast standar

interface SettingsFormProps {
  profileData: ProfileData;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ profileData }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Inisialisasi formulir dengan data profil saat ini
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfilePayload>({
    defaultValues: {
      username: profileData.username,
      bio: profileData.bio || "",
      // email tidak termasuk dalam payload update, karena readonly di UI
    },
  });

  // Mutasi untuk mengupdate profil
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      // Perbarui cache React Query agar data profil global diperbarui
      queryClient.setQueryData(["profileData"], response);
      // Reset state form, field yang sekarang dianggap "bersih"
      reset(
        {
          username: response.data.username,
          bio: response.data.bio || "",
          // avatar_url ditangani di komponen AvatarUploader
        },
        { keepValues: true },
      );
      setGlobalError(null);
      toast({
        title: "Profil Diperbarui",
        description: "Detail public identity Anda telah berhasil disimpan.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      // Tangani error validasi dari Laravel
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        // Tampilkan error tingkat global untuk menyederhanakan
        setGlobalError(
          error?.response?.data?.message || "Gagal menyimpan profil.",
        );
      } else {
        setGlobalError("Terjadi kesalahan yang tidak terduga.");
      }
    },
  });

  const onSubmit = (data: UpdateProfilePayload) => {
    // Hanya kirimkan data jika formulir "kotor" (diubah)
    if (isDirty) {
      setGlobalError(null);
      mutation.mutate(data);
    }
  };

  return (
    <Card className="p-8 bg-obsidian-black border-none h-full flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-grow">
        {/* Username */}
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-sm font-medium text-white">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            className="bg-obsidian-black border-zinc-700 text-white focus:ring-gold focus:border-gold"
            {...register("username", {
              required: "Username wajib diisi.",
              minLength: { value: 3, message: "Username minimal 3 karakter." },
            })}
          />
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email Address - Readonly Sesuai UI */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-white">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            readOnly
            className="bg-obsidian-black border-zinc-700 text-zinc-500 cursor-not-allowed"
            defaultValue={profileData.email} // Pre-fill dengan data readonly
          />
          <p className="text-xs text-zinc-400 mt-1">
            Email cannot be changed directly.
          </p>
        </div>

        {/* Bio / Expertise - Textarea Sesuai UI */}
        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-sm font-medium text-white">
            Bio / Expertise
          </Label>
          <Textarea
            id="bio"
            className="bg-obsidian-black border-zinc-700 text-white min-h-[120px] focus:ring-gold focus:border-gold"
            {...register("bio")}
            placeholder="A short bio about yourself..."
          />
          {errors.bio && (
            <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Error Global */}
        {globalError && (
          <p className="text-xs text-red-500 bg-red-950 p-2 rounded w-full text-center">
            {globalError}
          </p>
        )}
      </form>

      {/* Tombol Submit di Kanan Bawah Sesuai UI */}
      <div className="flex justify-end mt-8">
        <Button
          type="submit"
          form="profile-form" // Mengikat tombol ke form di luar
          disabled={!isDirty || mutation.isPending} // Hanya aktif jika diubah
          className="bg-gold hover:bg-gold-dark text-obsidian-black px-8 py-2 font-semibold"
          onClick={handleSubmit(onSubmit)}
        >
          {mutation.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </Card>
  );
};

export default SettingsForm;
