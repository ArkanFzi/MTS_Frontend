import { Link } from "react-router-dom";
import { User, Mail, Lock, Key, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

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

// ✅ Yup validation schema
const registerValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username minimal 3 karakter")
    .max(100, "Username maksimal 100 karakter")
    .required("Username wajib diisi"),
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password wajib diisi"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Konfirmasi password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
  terms: Yup.boolean()
    .oneOf([true], "Anda harus menyetujui syarat & ketentuan.")
    .required(),
});

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms: boolean;
}

export function RegisterForm({ onSubmit, isLoading, errorMsg }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      const payload: RegisterPayload = {
        username: values.username,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };
      onSubmit(payload);
    },
  });

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

      <form onSubmit={formik.handleSubmit}>
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
                  className={`h-10 pl-9 bg-muted border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] transition-all`}
                  {...formik.getFieldProps("username")}
                />
              </div>
              {formik.touched.username && formik.errors.username && <p className="text-red-400 text-xs mt-1">{formik.errors.username}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs text-white font-semibold">EMAIL ADDRESS</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="expert@mautanyasuhu.com"
                  className={`h-10 pl-9 bg-muted border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] transition-all`}
                  {...formik.getFieldProps("email")}
                />
              </div>
              {formik.touched.email && formik.errors.email && <p className="text-red-400 text-xs mt-1">{formik.errors.email}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs text-white font-semibold">PASSWORD</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  className={`h-10 pl-9 bg-muted border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] transition-all`}
                  {...formik.getFieldProps("password")}
                />
                <Button type="button" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4 text-[#D4AF37]" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formik.touched.password && formik.errors.password && <p className="text-red-400 text-xs mt-1">{formik.errors.password}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation" className="text-xs text-white font-semibold">CONFIRM PASSWORD</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password_confirmation" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••"
                  className={`h-10 pl-9 bg-muted border ${formik.touched.password_confirmation && formik.errors.password_confirmation ? 'border-red-500' : 'border-[#3f3f3f]'} text-foreground rounded-xl placeholder:text-muted-foreground/50 border-1 focus:bg-background focus-visible:border-[#D4AF37] focus-visible:ring-1 focus-visible:ring-[#856e23] transition-all`}
                  {...formik.getFieldProps("password_confirmation")}
                />
                <Button type="button" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-[#D4AF37]" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formik.touched.password_confirmation && formik.errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{formik.errors.password_confirmation}</p>}
            </div>

            <div className="flex items-start gap-2 pt-1 mt-1">
              <input id="terms" type="checkbox" className="h-4 w-4 mt-0.5 rounded border-zinc-700 bg-transparent text-black accent-[#D4AF37] cursor-pointer"
                checked={formik.values.terms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="terms"
              />
              <div className="flex flex-col">
                <label htmlFor="terms" className="text-xs font-medium cursor-pointer text-muted-foreground leading-tight">
                  Saya setuju dengan syarat dan ketentuan yang berlaku.
                </label>
                {formik.touched.terms && formik.errors.terms && <p className="text-red-400 text-xs mt-1">{formik.errors.terms}</p>}
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
