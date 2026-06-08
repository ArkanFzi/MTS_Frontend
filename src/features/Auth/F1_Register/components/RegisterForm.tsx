import { Link } from "react-router-dom";
import { User, Mail, Lock, RotateCcw } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

export function RegisterForm() {
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Taruh logika register/daftar API di sini
  };

  return (
    <Card className="w-full max-w-sm h-fit">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl font-bold tracking-tight">
        Login Mau Tanya Suhu
          </CardTitle>
          <Link 
            to="/login" 
            className="text-sm font-medium text-lime-500 hover:text-lime-600 hover:underline transition-colors duration-200"
          >
            Login
          </Link>
        </div>
        <CardDescription>
          Silakan isi data di bawah ini untuk membuat akun Anda
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleRegisterSubmit}>
        <CardContent>
          <div className="flex flex-col gap-4">
            
            {/* Input Username */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Pilih username Anda"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* Input Alamat Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Alamat Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* Input Kata Sandi */}
            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* Input Konfirmasi Kata Sandi */}
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <RotateCcw className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Ulangi kata sandi"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* Checkbox Syarat & Ketentuan */}
            <div className="flex items-start gap-2 pt-1">
              <input 
                id="terms" 
                type="checkbox" 
                className="mt-1 h-4 w-4 rounded border-gray-300 text-lime-500 focus:ring-lime-500 accent-lime-500" 
                required 
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight">
                Saya setuju dengan{" "}
                <a href="#" className="underline hover:text-lime-500">Syarat Ketentuan</a>{" "}
                dan{" "}
                <a href="#" className="underline hover:text-lime-500">Kebijakan Privasi</a>.
              </label>
            </div>

          </div>
        </CardContent>
        <br />
        <CardFooter className="pt-0">
          {/* Tombol Submit Utama */}
          <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600 text-black font-medium">
            Daftar Sekarang
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}