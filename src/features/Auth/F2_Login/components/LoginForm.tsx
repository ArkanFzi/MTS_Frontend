import { Link } from "react-router-dom";
import { Lock, Mail, Key, Eye, EyeOff, ArrowRight } from "lucide-react";
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
import type { LoginFormProps } from "../types";

// ✅ Validasi Zod
const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
  rememberMe: z.boolean().default(false),
});

type LoginSchema = z.infer<typeof loginSchema>;



export function LoginForm({ onSubmit, isLoading, errorMsg }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false }
  });

  const handleFormSubmit = (data: LoginSchema) => {
    onSubmit(data.email, data.password, data.rememberMe);
  };

  return (
    <Card className="w-full rounded-4xl max-w-sm h-fit bg-[#1d1d1f]/60 backdrop-blur-md border border-1 border-[#856e23] shadow-sm px-3 py-8">
      <CardHeader className="space-y-4 text-center flex flex-col items-center">
        <div className="p-3 rounded-2xl bg-[#353538] border-2 border-[#856e23] text-primary w-fit shadow-sm">
          <Lock className="text-[#D4AF37] h-6 w-6" />
        </div>

        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Access Portal
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Enter your credentials to continue
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent>
          <div className="flex flex-col gap-5">
            {/* ALERT ERROR BACKEND DARI PROPS */}
            {errorMsg && (
              <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm text-white font-semibold">
                EMAIL ADDRESS
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="expert@mautanyasuhu.com"
                  className={`h-10 pl-9 bg-muted border ${errors.email ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] transition-all`}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="password" className="text-sm text-white font-semibold">
                  PASSWORD
                </Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-semi-bold">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-10 pl-9 bg-muted border ${errors.password ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] focus-visible:ring-offset-0 transition-all`}
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-[#D4AF37]" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-700 bg-transparent text-black accent-[#D4AF37] cursor-pointer"
                {...register("rememberMe")}
              />
              <label htmlFor="remember" className="text-sm font-medium cursor-pointer select-none text-muted-foreground">
                Ingat Saya
              </label>
            </div>
          </div>
        </CardContent>
        <br />
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full font-bold rounded-xl flex items-center bg-[#D4AF37] hover:bg-[#d6a915] text-black justify-center gap-2 py-5 shadow-md transition-colors duration-300 ease-in-out active:scale-[0.8] disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? "Authenticating..." : "Login To Dashboard"} <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-bold">
              Register Now
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
