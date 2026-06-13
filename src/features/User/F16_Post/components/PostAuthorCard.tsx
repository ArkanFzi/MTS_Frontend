// src/features/User/F16_Post/components/PostAuthorCard.tsx
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';

interface PostAuthorCardProps {
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
    reputation_points: number;
  };
}

export default function PostAuthorCard({ user }: PostAuthorCardProps) {
  return (
    <Link
      to={`/profile/${user.id}`}
      className="flex items-center gap-2.5 ml-auto hover:opacity-80 transition-opacity"
    >
      <Avatar className="h-9 w-9">
        {user.avatar_url ? (
          <AvatarImage src={user.avatar_url} alt={user.username} />
        ) : null}
        <AvatarFallback className="bg-[#D4AF37] text-black text-[11px] font-bold">
          {user.username.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors">
          {user.username}
        </p>
        <p className="text-[11px] text-gray-500">
          Rep: {user.reputation_points.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
