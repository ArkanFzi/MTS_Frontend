import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RegisterForm } from "../../features/Auth/F1_Register/components/RegisterForm";
import { registerUser } from "../../features/Auth/F1_Register/api";
import type { RegisterPayload } from "../../features/Auth/F1_Register/types"; // ← Tipe eksplisit

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ← Hapus logika agreeTerms dari sini. Page hanya terima data bersih dari form.
  const handleRegister = async (data: RegisterPayload) => {
    setErrorMsg("");
    setIsLoading(true);

    try {
      await registerUser(data);
      toast.success("Registration Successful! Please login.");
      navigate("/login");
    } catch (error: any) {
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
