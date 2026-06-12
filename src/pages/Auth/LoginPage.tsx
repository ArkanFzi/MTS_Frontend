import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { LoginForm } from "../../features/Auth/F2_Login/components/LoginForm";
import { loginUser } from "../../features/Auth/F2_Login/api";
import type { LoginPayload } from "../../features/Auth/F2_Login/types";
import { useAuthStore } from "../../store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
    onSuccess: (response) => {
      // Clear all cached queries to prevent stale data from previous user session
      queryClient.clear();
      login(response.data.user);
      toast.success("Login Successful!");
      navigate("/");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Invalid credentials or server error.";
      toast.error(message);
    },
  });

  const handleLoginSubmit = (email: string, password: string) => {
    mutation.mutate({ email, password });
  };

  return (
    <div className="grid min-h-screen w-screen place-items-center p-4">
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={mutation.isPending}
        errorMsg={mutation.isError ? (mutation.error as AxiosError<{ message?: string }>)?.response?.data?.message || "Login failed." : ""}
      />
    </div>
  );
}
