import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RegisterForm } from "../../features/Auth/F1_Register/components/RegisterForm";
import { registerUser } from "../../features/Auth/F1_Register/api";
import type { RegisterPayload } from "../../features/Auth/F1_Register/types";

export default function RegisterPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: RegisterPayload) => registerUser(data),
    onSuccess: () => {
      toast.success("Registration Successful! Please login.");
      navigate("/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed.";
      toast.error(message);
    },
  });

  const handleRegister = (data: RegisterPayload) => {
    mutation.mutate(data);
  };

  return (
    <div className="grid min-h-screen w-screen place-items-center p-4 bg-[#09090B]">
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={mutation.isPending}
        errorMsg={mutation.isError ? (mutation.error as any)?.response?.data?.message || "Registration failed." : ""}
      />
    </div>
  );
}
