// ─── src/features/User/F28_ProfileSettings/components/SettingsForm.tsx ───
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// FIX: Mengubah semua import UI Shadcn menggunakan relative path (mundur 4 tingkat)
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import { Card } from "../../../../components/ui/card";
import { useToast } from "../../../../components/ui/use-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { updateProfile } from "../api";
import { type ProfileData, type UpdateProfilePayload, type ApiResponse } from "../types";

interface SettingsFormProps {
  profileData: ProfileData;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ profileData }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfilePayload>({
    defaultValues: {
      username: profileData.username,
      bio: profileData.bio || "",
    },
  });

  useEffect(() => {
    reset({
      username: profileData.username,
      bio: profileData.bio || "",
    });
  }, [profileData, reset]);

  const mutation = useMutation<
    ApiResponse<ProfileData>,
    AxiosError<ApiResponse<unknown>>,
    UpdateProfilePayload
  >({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      queryClient.setQueryData(["profileData"], response);
      setGlobalError(null);
      toast({
        title: "Profil Diperbarui",
        description: "Detail public identity Anda telah berhasil disimpan.",
      });
    },
    onError: (error) => {
      const backendMessage = error.response?.data?.message;
      setGlobalError(backendMessage || "Gagal menyimpan profil.");
    },
  });

  const onSubmit = (data: UpdateProfilePayload) => {
    setGlobalError(null);
    mutation.mutate(data);
  };

  return (
    <Card className="p-8 bg-[#161618] border border-zinc-800/60 shadow-xl rounded-xl h-full flex flex-col justify-between backdrop-blur-sm">
      <form
        id="profile-settings-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Username */}
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            Username
          </Label>
          <Input
            id="username"
            type="text"
            className="bg-[#121214] border-zinc-800 text-white rounded-lg px-4 py-3 h-11 focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all duration-200 placeholder-zinc-600"
            placeholder="Masukkan username baru..."
            {...register("username", {
              required: "Username wajib diisi.",
              minLength: { value: 3, message: "Username minimal 3 karakter." },
            })}
          />
          {errors.username && (
            <p className="text-xs text-red-400 font-medium mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email Address - Readonly */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            readOnly
            className="bg-[#1c1c1e] border-zinc-800/40 text-zinc-500 cursor-not-allowed rounded-lg px-4 py-3 h-11 shadow-inner select-none"
            defaultValue={profileData.email}
          />
          <p className="text-[11px] text-zinc-500 italic">
            Email terikat dengan akun keamanan Anda dan tidak dapat diubah
            langsung.
          </p>
        </div>

        {/* Bio / Expertise */}
        <div className="space-y-2">
          <Label
            htmlFor="bio"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            Bio / Expertise
          </Label>
          <Textarea
            id="bio"
            className="bg-[#121214] border-zinc-800 text-white rounded-lg p-4 min-h-[140px] focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all duration-200 placeholder-zinc-600 resize-none text-sm leading-relaxed"
            {...register("bio")}
            placeholder="Tulis sepatah kata mengenai keahlian atau latar belakang Anda..."
          />
        </div>

        {globalError && (
          <div className="text-xs text-red-400 bg-red-950/20 px-4 py-3 rounded-lg border border-red-900/40 text-center animate-fade-in">
            {globalError}
          </div>
        )}
      </form>

      <div className="flex justify-end mt-8 border-t border-zinc-800/60 pt-6">
        <Button
          type="submit"
          form="profile-settings-form"
          disabled={!isDirty || mutation.isPending}
          className="bg-[#D4AF37] hover:bg-[#bfa12d] disabled:bg-zinc-800 disabled:text-zinc-500 text-[#121214] font-bold text-xs uppercase tracking-widest px-8 h-11 rounded-lg shadow-lg shadow-[#D4AF37]/5 transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
        >
          {mutation.isPending ? "Memproses..." : "Save Profile"}
        </Button>
      </div>
    </Card>
  );
};

export default SettingsForm;
