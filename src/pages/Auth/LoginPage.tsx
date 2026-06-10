import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginForm } from "../../features/Auth/F2_Login/components/LoginForm";
import { loginUser } from "../../features/Auth/F2_Login/api";
import { useAuthStore } from "../../store/useAuthStore"; // ← Import Zustand

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore(); // ← Ambil fungsi login dari store

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = async (email: string, password: string, rememberMe: boolean) => {
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });

      // ← Sinkronkan state Zustand + localStorage sekaligus
      login({
  ...response.data.user,
  role: response.data.user.roles?.[0] ?? 'user'
}, response.data.access_token);

      toast.success("Login Successful!");
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid credentials or server error.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-screen place-items-center p-4">
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        errorMsg={errorMsg}
      />
    </div>
  );
}
