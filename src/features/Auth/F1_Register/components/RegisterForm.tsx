import { Link } from "react-router-dom";
import { User, Mail, Lock, Key, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import type { RegisterFormProps, RegisterPayload } from "../types";

// ✅ Skema validasi Zod
const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter").max(100),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  password_confirmation: z.string(),
  terms: z.boolean().refine(val => val === true, { message: "Anda harus menyetujui syarat & ketentuan." })
}).refine(data => data.password === data.password_confirmation, {
  message: "Konfirmasi password tidak cocok",
  path: ["password_confirmation"],
});

type RegisterSchema = z.infer<typeof registerSchema>;



export function RegisterForm({ onSubmit, isLoading, errorMsg }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", password_confirmation: "", terms: false }
  });

  const handleFormSubmit = (data: RegisterSchema) => {
    // Panggil fungsi onSubmit bawaan dari props (dikirim dari RegisterPage)
    onSubmit({
      username: data.username,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  return (
    <Card className="w-full rounded-4xl max-w-sm h-fit bg-[#1d1d1f]/60 backdrop-blur-md border border-1 border-[#856e23] shadow-sm px-3 py-8">
      <CardHeader className="space-y-4 text-center flex flex-col items-center">
        <div className="p-3 rounded-2xl bg-[#353538] border-2 border-[#856e23] text-primary w-fit shadow-sm">
          <User className="text-[#D4AF37] h-6 w-6" />
        </div>

        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Create an Account
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Enter your details to get started
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* ALERT ERROR BACKEND DARI PROPS */}
            {errorMsg && (
              <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="username" className="text-xs text-white font-semibold">USERNAME</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="username" type="text" placeholder="johndoe"
                  className={`h-10 pl-9 bg-muted border ${errors.username ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] transition-all`}
                  {...register("username")} 
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs text-white font-semibold">EMAIL ADDRESS</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="expert@mautanyasuhu.com"
                  className={`h-10 pl-9 bg-muted border ${errors.email ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] transition-all`}
                  {...register("email")} 
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs text-white font-semibold">PASSWORD</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  className={`h-10 pl-9 bg-muted border ${errors.password ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] transition-all`}
                  {...register("password")} 
                />
                <Button type="button" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4 text-[#D4AF37]" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation" className="text-xs text-white font-semibold">CONFIRM PASSWORD</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password_confirmation" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••"
                  className={`h-10 pl-9 bg-muted border ${errors.password_confirmation ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] transition-all`}
                  {...register("password_confirmation")} 
                />
                <Button type="button" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-[#D4AF37]" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{errors.password_confirmation.message}</p>}
            </div>

            <div className="flex items-start gap-2 pt-1 mt-1">
              <input id="terms" type="checkbox" className="h-4 w-4 mt-0.5 rounded border-zinc-700 bg-transparent text-black accent-[#D4AF37] cursor-pointer"
                {...register("terms")}
              />
              <div className="flex flex-col">
                <label htmlFor="terms" className="text-xs font-medium cursor-pointer text-muted-foreground leading-tight">
                  Saya setuju dengan syarat dan ketentuan yang berlaku.
                </label>
                {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms.message}</p>}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 mt-2">
          <Button type="submit" variant="default" disabled={isLoading} className="w-full font-bold rounded-xl flex items-center bg-[#D4AF37] hover:bg-[#d6a915] text-black justify-center gap-2 py-5 shadow-md transition-colors duration-300 ease-in-out active:scale-[0.8] disabled:opacity-70 disabled:active:scale-100">
            {isLoading ? "Processing..." : "Register Account"} <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="relative w-full mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
