import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { toast } from "sonner";
import { RegisterForm } from "../../features/Auth/F1_Register/components/RegisterForm";
import { registerUser } from "../../features/Auth/F1_Register/api";

export default function RegisterPage() {
  const navigate = useNavigate(); // 2. Inisialisasi hook
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (data: any) => {
    setErrorMsg("");
    
    // Validasi checkbox setuju syarat ketentuan
    if (!data.agreeTerms) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      });
      
      // 3. Tampilkan pesan sukses
      toast.success("Registration Successful! Please login.");
      
      // 4. ARAHKAN OTOMATIS KE LOGIN
      navigate("/login"); 
      
    } catch (error: any) {
      // Menangkap error 422 atau lainnya dari backend
      const message = error.response?.data?.message || "Registration failed.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-screen place-items-center p-4 bg-[#09090B]">
      <RegisterForm 
        onSubmit={handleRegister} 
        isLoading={isLoading} 
        errorMsg={errorMsg} 
      />
    </div>
  );
}