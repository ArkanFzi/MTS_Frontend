// src/features/User/F16_Post/components/PostCardItem.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, MessageCircle, Edit3, Trash2, Loader2 } from 'lucide-react';
import type { Post } from '../types';
import { deletePost } from '../api';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { useAuthStore } from '../../../../store/useAuthStore';
import VoteControl from '../../F22_VoteSystem/components/VoteControl';

interface PostCardItemProps {
  post: Post;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function PostCardItem({ post }: PostCardItemProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isOwner = user?.id === post.user_id;

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    },
  });

  const handleDelete = () => {
    if (window.confirm('Yakin ingin menghapus postingan ini?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <Card className="border-[#2A2A2C] bg-[#161618] hover:border-[#D4AF37]/30 transition-colors">
      <div className="p-5 space-y-3">
        {/* Top row */}
        <div className="flex items-center gap-2">
          {post.is_answered && (
            <Badge className="bg-green-950/50 text-green-400 border-green-900 text-[10px] h-5 font-bold uppercase tracking-wider">
              Terjawab
            </Badge>
          )}
          <Badge
            variant="outline"
            className={`text-[10px] h-5 ${
              post.status === 'open'
                ? 'border-blue-900 text-blue-400'
                : 'border-gray-700 text-gray-500'
            }`}
          >
            {post.status === 'open' ? 'Open' : 'Closed'}
          </Badge>
          <span className="text-xs text-gray-500 ml-auto">{timeAgo(post.created_at)}</span>
        </div>

        {/* Title */}
        <Link to={`/posts/${post.id}`}>
          <h3 className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Category + Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {post.category && (
            <Badge
              variant="outline"
              className="text-[10px] bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] px-2 py-0.5 h-auto"
            >
              {post.category.name}
            </Badge>
          )}
          {post.tags?.slice(0, 3).map((tag) => (
            <Link key={tag.id} to={`/tags/${tag.slug}`}>
              <Badge
                variant="outline"
                className="text-[10px] bg-[#1A1A1C] text-[#D4AF37] border-[#2A2A2C] px-2 py-0.5 h-auto hover:border-[#D4AF37]/50 cursor-pointer"
              >
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {post.view_count}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> {post.comments_count ?? 0}
          </span>
          
          {/* Ganti span statis dengan komponen VoteControl */}
          <VoteControl
            targetId={post.id}
            targetType="post"
            initialScore={post.vote_score}
            userVote={post.user_vote} // Pastikan properti ini tersedia dari backend
            direction="horizontal"
          />

          {/* Owner actions */}
          {isOwner && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => navigate(`/posts/${post.id}/edit`)}
                className="text-gray-500 hover:text-[#D4AF37] transition-colors"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
