import { Link } from "react-router-dom";
import { User, Mail, Lock, RotateCcw, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { TermsCheckbox } from "./TermsCheckbox";

// 1. DEFINISI PROPS (Ini yang memperbaiki error IntrinsicAttributes)
interface RegisterFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  errorMsg?: string;
}

export function RegisterForm({ onSubmit, isLoading, errorMsg }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // State lokal untuk menangkap input
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, agreeTerms }); // Kirim data ke Page
  };

  return (
    <Card className="w-full rounded-4xl max-w-sm h-fit bg-[#1d1d1f]/60 backdrop-blur-md border border-[#856e23] shadow-sm px-3 py-8">
      <CardHeader className="space-y-4 text-center flex flex-col items-center">
        <div className="p-3 rounded-2xl bg-[#353538] border-2 border-[#856e23] text-primary w-fit shadow-sm">
          <User className="text-[#D4AF37] h-6 w-6" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Please fill in the data below to register.</CardDescription>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-5">
            {/* 2. Tampilkan error jika ada */}
            {errorMsg && <div className="text-red-500 text-sm text-center">{errorMsg}</div>}

            <div className="grid gap-2">
              <Label htmlFor="username" className="text-sm text-white font-semibold">USERNAME</Label>
              <Input id="username" placeholder="Select your username" className="h-10 bg-muted rounded-xl" required onChange={(e) => setFormData({...formData, username: e.target.value})} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm text-white font-semibold">EMAIL ADDRESS</Label>
              <Input id="email" type="email" placeholder="expert@mautanyasuhu.com" className="h-10 bg-muted rounded-xl" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm text-white font-semibold">PASSWORD</Label>
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimum 8 characters" className="h-10 bg-muted rounded-xl" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">CONFIRM PASSWORD</Label>
              <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="Repeat password" className="h-10 bg-muted rounded-xl" required onChange={(e) => setFormData({...formData, passwordConfirmation: e.target.value})} />
            </div>

            <TermsCheckbox checked={agreeTerms} onChange={setAgreeTerms} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" disabled={isLoading} className="w-full font-bold rounded-xl bg-[#D4AF37] text-black py-5">
            {isLoading ? "Registering..." : "Register Account"} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account? <Link to="/login" className="text-[#D4AF37] font-bold hover:underline">Login Here</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}