import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginForm } from "../../features/Auth/F2_Login/components/LoginForm";
import { loginUser } from "../../features/Auth/F2_Login/api";

export default function LoginPage() {
  const navigate = useNavigate();
  
  // Pindahkan state logika ke sini
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fungsi handle API
  const handleLoginSubmit = async (email: string, password: string, rememberMe: boolean) => {
    setErrorMsg("");
    setIsLoading(true);

    try {
      const payload = {
        email,
        password,
        // remember_me: rememberMe
      };
      
      await loginUser(payload);
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
      {/* Panggil Presentational Component, lempar props-nya */}
      <LoginForm 
        onSubmit={handleLoginSubmit} 
        isLoading={isLoading} 
        errorMsg={errorMsg} 
      />
    </div>
  );
}