import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoginForm } from "../../features/Auth/F2_Login/components/LoginForm";
import { loginUser } from "../../features/Auth/F2_Login/api";
import type { LoginPayload } from "../../features/Auth/F2_Login/types";
import { useAuthStore } from "../../store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
    onSuccess: (response) => {
      login(response.data.user);
      toast.success("Login Successful!");
      navigate("/");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Invalid credentials or server error.";
      toast.error(message);
    },
  });

  const handleLoginSubmit = (email: string, password: string, _rememberMe: boolean) => {
    mutation.mutate({ email, password });
  };

  return (
    <div className="grid min-h-screen w-screen place-items-center p-4">
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={mutation.isPending}
        errorMsg={mutation.isError ? (mutation.error as any)?.response?.data?.message || "Login failed." : ""}
      />
    </div>
  );
}
