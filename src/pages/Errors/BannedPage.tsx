import { useNavigate } from 'react-router-dom';
import { Ban, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '../../features/Auth/F3_Logout/api';
import { toast } from 'sonner';

export default function BannedPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      toast.success('Logged out.');
      navigate('/login');
    },
    onError: () => {
      logout();
      navigate('/login');
    },
  });

  return (
    <div className="min-h-screen w-full bg-[#0B0B0C] flex items-center justify-center font-['Inter'] px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-950/30 border-2 border-red-900 mb-6">
          <Ban className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-red-400 mb-3">Account Suspended</h1>
        <p className="text-gray-400 text-sm mb-2">
          Your account has been suspended by a moderator or administrator.
        </p>
        <p className="text-gray-500 text-xs mb-8">
          If you believe this was a mistake, please contact the support team.
        </p>
        <Button
          variant="outline"
          className="border-red-900 text-red-400 hover:bg-red-950/30 hover:text-red-300 bg-transparent"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </div>
  );
}
