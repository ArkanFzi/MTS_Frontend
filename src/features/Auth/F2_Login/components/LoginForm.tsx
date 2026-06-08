import { Link } from "react-router-dom";
import { Lock, Mail, Key, Eye, ArrowRight } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

export function LoginForm() {
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika login di sini
  };

  return (
    <Card className="w-full max-w-sm h-fit bg-white border-zinc-300 shadow-sm">
      {/* Header: Ikon Gembok di dalam kotak putih rounded seperti Register */}
      <CardHeader className="space-y-4 text-center flex flex-col items-center">
        <div className="p-3 rounded-xl bg-white border border-zinc-200 text-lime-500 w-fit shadow-sm">
          <Lock className="h-6 w-6" />
        </div>
        
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-900">
            Access Portal
          </CardTitle>
          <CardDescription className="text-zinc-600">
            Enter your credentials to continue
          </CardDescription>
        </div>
      </CardHeader>
      
      <form onSubmit={handleLoginSubmit}>
        <CardContent>
          <div className="flex flex-col gap-4">
            
            {/* Input Email Address dengan Ikon di dalam */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-semibold text-zinc-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="expert@mautanyasuhu.com"
                  className="pl-9 bg-white/70 border-zinc-300 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Input Password dengan Ikon di dalam & Lupa Password */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="password" className="text-sm font-semibold text-zinc-700">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-lime-600 hover:text-lime-700 font-bold hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="pl-9 pr-9 bg-white/70 border-zinc-300 focus:bg-white transition-all"
                  required 
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-zinc-400 hover:bg-transparent hover:text-zinc-600"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Checkbox Ingat Saya gaya Register */}
            <div className="flex items-center gap-2 pt-1">
              <input 
                id="remember" 
                type="checkbox" 
                className="h-4 w-4 rounded border-zinc-300 bg-white accent-lime-500 cursor-pointer" 
              />
              <label htmlFor="remember" className="text-sm font-medium cursor-pointer select-none text-zinc-600">
                Ingat Saya
              </label>
            </div>

          </div>
        </CardContent>
<br />
        <CardFooter className="flex flex-col gap-4">
          {/* Tombol Login gaya Register (Tinggi & Lime) */}
          <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold flex items-center justify-center gap-2 py-6 shadow-md transition-transform active:scale-[0.98]">
            Login To Dashboard <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-300" />
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-zinc-600 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-lime-600 hover:text-lime-700 font-bold hover:underline">
              Request Access
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}