// src/features/User/F20_NestedCommentReply/components/NestedReplyList.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CornerDownRight, Loader2 } from 'lucide-react';
import type { Reply } from '../types';
import { createReply } from '../api';
import VoteControl from '../../F22_VoteSystem/components/VoteControl';
import LikeButton from '../../F23_LikeSystem/components/LikeButton';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';
import { useAuthStore } from '../../../../store/useAuthStore';

interface NestedReplyListProps {
  postId: string;
  parentId: string;
  replies: Reply[];
  maxDepth?: number;
  currentDepth?: number;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} mnt lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
}

function InlineReplyForm({ postId, commentId, onCancel }: {
  postId: string;
  commentId: string;
  onCancel: () => void;
}) {
  const [body, setBody] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createReply(postId, commentId, { body }),
    onSuccess: () => {
      setBody('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      onCancel();
    },
  });

  return (
    <div className="flex gap-2 mt-2">
      <div className="flex-1">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tulis balasan..."
          rows={2}
          className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-none"
        />
        <div className="flex gap-2 mt-1.5">
          <Button
            onClick={() => mutation.mutate()}
            disabled={!body.trim() || mutation.isPending}
            size="sm"
            className="bg-[#D4AF37] text-black hover:bg-[#c29f2f] h-7 text-xs px-3"
          >
            {mutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
            Balas
          </Button>
          <button onClick={onCancel} className="text-xs text-gray-600 hover:text-gray-400">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

function ReplyItem({ reply, postId, maxDepth, currentDepth }: {
  reply: Reply;
  postId: string;
  maxDepth: number;
  currentDepth: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="flex gap-2.5 py-2.5">
      <CornerDownRight className="w-3.5 h-3.5 text-gray-700 flex-shrink-0 mt-1" />
      <Avatar className="h-6 w-6 flex-shrink-0">
        {reply.user?.avatar_url ? (
          <AvatarImage src={reply.user.avatar_url} alt={reply.user.username} />
        ) : null}
        <AvatarFallback className="bg-[#2A2A2C] text-gray-400 text-[9px] font-bold">
          {reply.user?.username?.substring(0, 2).toUpperCase() ?? '??'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-300">
            {reply.user?.username ?? 'Anonim'}
          </span>
          <span className="text-[10px] text-gray-600">{timeAgo(reply.created_at)}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{reply.body}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <VoteControl
            targetId={reply.id}
            targetType="comment"
            initialScore={reply.vote_score}
            className="flex-row gap-2"
          />
          <LikeButton 
            targetId={reply.id} 
            targetType="comment" 
            initialIsLiked={reply.is_liked}
            initialLikesCount={reply.likes_count}
          />
          {user && currentDepth < maxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-[10px] text-gray-600 hover:text-[#D4AF37] transition-colors"
            >
              Balas
            </button>
          )}
        </div>
        {showReplyForm && (
          <InlineReplyForm
            postId={postId}
            commentId={reply.id}
            onCancel={() => setShowReplyForm(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function NestedReplyList({
  postId,
  replies,
  maxDepth = 3,
  currentDepth = 0,
}: Omit<NestedReplyListProps, 'parentId'>) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className={`border-l-2 border-[#2A2A2C] pl-3 ${currentDepth > 0 ? 'ml-2' : ''}`}>
      {replies.map((reply) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          postId={postId}
          maxDepth={maxDepth}
          currentDepth={currentDepth}
        />
      ))}
    </div>
  );
}
