// src/features/User/F16_Post/components/PostCardItem.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Eye, MessageSquare, Flame, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { useAuthStore } from '../../../../store/useAuthStore';
import VoteControl from '../../F22_VoteSystem/components/VoteControl';

interface PostCardItemProps {
  post: {
    id: string;
    title: string;
    body?: string;
    category?: { name: string };
    user?: { id: string; username: string };
    created_at?: string;
    vote_score?: number;
    user_vote?: number;
    views_count?: number;
    comments_count?: number;
    is_hot?: boolean;
    is_solved?: boolean;
  };
  onDelete?: (id: string) => void;
  deleteMutation?: { isPending: boolean };
}

export default function PostCardItem({ post, onDelete, deleteMutation }: PostCardItemProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Logika pengecekan kepemilikan post
  const isOwner = user?.username === post.user?.username;

  const formattedDate = post.created_at
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(post.created_at))
    : 'Baru saja';

  return (
    <Card className="bg-[#131315] border border-[#2A2A2C] hover:border-zinc-700/60 p-4 transition-all duration-300 group rounded-xl relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-[#D4AF37] transition-colors duration-300" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-1">
        
        {/* Sektor Kiri: Konten Utama */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {post.is_hot && (
              <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md gap-0.5">
                <Flame className="w-3 h-3 text-red-500 fill-red-500" /> Hot
              </Badge>
            )}
            <Badge variant="outline" className="bg-zinc-900/50 text-zinc-400 border-zinc-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
              {post.category?.name || 'Programming'}
            </Badge>
            <Badge className={`${post.is_solved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'} text-[10px] font-medium px-2 py-0.5 rounded-full`}>
              {post.is_solved ? 'Terjawab' : 'Open'}
            </Badge>
          </div>

          <Link to={`/posts/${post.id}`} className="block">
            <h2 className="text-base font-semibold text-zinc-100 group-hover:text-[#D4AF37] tracking-tight transition-colors line-clamp-1">
              {post.title}
            </h2>
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span className="inline-flex items-center justify-center bg-zinc-800 text-[#D4AF37] w-5 h-5 rounded-md font-bold text-[10px] uppercase">
              {(post.user?.username || 'US').substring(0, 2)}
            </span>
            <span className="text-zinc-300 font-semibold">{post.user?.username || 'user'}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Sektor Kanan: Stats & Actions */}
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views_count ?? 0}</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments_count ?? 0}</span>
          
          <VoteControl
            targetId={post.id}
            targetType="post"
            initialScore={post.vote_score || 0}
            userVote={post.user_vote}
            direction="horizontal"
          />

          {isOwner && (
            <div className="flex items-center gap-1.5 ml-2">
              <button onClick={() => navigate(`/posts/${post.id}/edit`)} className="p-2 border border-[#2A2A2C] hover:border-zinc-600 rounded-lg text-zinc-400 hover:text-white transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={deleteMutation?.isPending}
                onClick={() => onDelete?.(post.id)}
                className="p-2 border border-red-900/30 hover:border-red-900 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              >
                {deleteMutation?.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}