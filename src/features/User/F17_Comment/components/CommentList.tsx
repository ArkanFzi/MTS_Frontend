// src/features/User/F17_Comment/components/CommentList.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Loader2, Reply, CornerDownRight } from 'lucide-react';

import type { Comment } from '../types';
import { createComment } from '../api';
import ReplyForm from './ReplyForm';
import VoteControl from '../../F22_VoteSystem/components/VoteControl';
import AcceptAnswerButton from '../../F18_MarkAcceptedAnswer/components/AcceptAnswerButton';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';
import { useAuthStore } from '../../../../store/useAuthStore';

interface CommentListProps {
  postId: string;
  comments: Comment[];
  postOwnerId: string;
  acceptedAnswerId: string | null;
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

// ─── Single Reply ───
function ReplyItem({ reply, postId, postOwnerId, acceptedAnswerId }: {
  reply: Comment;
  postId: string;
  postOwnerId: string;
  acceptedAnswerId: string | null;
}) {
  const { user } = useAuthStore();
  const isPostOwner = user?.id === postOwnerId;

  return (
    <div className="flex gap-3 py-3">
      <CornerDownRight className="w-4 h-4 text-gray-700 flex-shrink-0 mt-1" />
      <Avatar className="h-7 w-7 flex-shrink-0">
        {reply.user?.avatar_url ? (
          <AvatarImage src={reply.user.avatar_url} alt={reply.user.username} />
        ) : null}
        <AvatarFallback className="bg-[#2A2A2C] text-gray-400 text-[10px] font-bold">
          {reply.user?.username?.substring(0, 2).toUpperCase() ?? '??'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-300">
            {reply.user?.username ?? 'Anonim'}
          </span>
          <span className="text-[10px] text-gray-600">{timeAgo(reply.created_at)}</span>
          {reply.is_accepted && (
            <AcceptAnswerButton
              postId={postId}
              commentId={reply.id}
              isAccepted={true}
              isPostOwner={false}
            />
          )}
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{reply.body}</p>
        <div className="mt-2 flex items-center gap-3">
          <VoteControl
            targetId={reply.id}
            targetType="comment"
            initialScore={reply.vote_score}
            className="flex-row gap-2 [&_.flex-col]:flex-row"
          />
          {!reply.is_accepted && acceptedAnswerId === null && (
            <AcceptAnswerButton
              postId={postId}
              commentId={reply.id}
              isAccepted={false}
              isPostOwner={isPostOwner}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Single Comment ───
function CommentItem({ comment, postId, postOwnerId, acceptedAnswerId }: {
  comment: Comment;
  postId: string;
  postOwnerId: string;
  acceptedAnswerId: string | null;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user } = useAuthStore();
  const isPostOwner = user?.id === postOwnerId;
  const replies = comment.replies || [];

  return (
    <div className="py-4 border-b border-[#1A1A1C] last:border-b-0">
      <div className="flex gap-4">
        {/* Vote column */}
        <VoteControl
          targetId={comment.id}
          targetType="comment"
          initialScore={comment.vote_score}
          className="pt-1"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              {comment.user?.avatar_url ? (
                <AvatarImage src={comment.user.avatar_url} alt={comment.user.username} />
              ) : null}
              <AvatarFallback className="bg-[#D4AF37] text-black text-[9px] font-bold">
                {comment.user?.username?.substring(0, 2).toUpperCase() ?? '??'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-white">
              {comment.user?.username ?? 'Anonim'}
            </span>
            <span className="text-xs text-gray-600">{timeAgo(comment.created_at)}</span>
          </div>

          {/* Body */}
          <p className="text-sm text-gray-300 leading-relaxed mb-3 whitespace-pre-wrap">
            {comment.body}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                Balas
              </button>
            )}
            {comment.is_accepted ? (
              <AcceptAnswerButton
                postId={postId}
                commentId={comment.id}
                isAccepted={true}
                isPostOwner={false}
              />
            ) : acceptedAnswerId === null ? (
              <AcceptAnswerButton
                postId={postId}
                commentId={comment.id}
                isAccepted={false}
                isPostOwner={isPostOwner}
              />
            ) : null}
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3">
              <ReplyForm postId={postId} commentId={comment.id} />
              <button
                onClick={() => setShowReplyForm(false)}
                className="text-xs text-gray-600 hover:text-gray-400 mt-2"
              >
                Batal
              </button>
            </div>
          )}

          {/* Nested replies */}
          {replies.length > 0 && (
            <div className="mt-3 ml-2 border-l-2 border-[#2A2A2C] pl-4 space-y-0">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  postId={postId}
                  postOwnerId={postOwnerId}
                  acceptedAnswerId={acceptedAnswerId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main CommentList ───
export default function CommentList({ postId, comments, postOwnerId, acceptedAnswerId }: CommentListProps) {
  const [commentBody, setCommentBody] = useState('');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: () => createComment(postId, { body: commentBody }),
    onSuccess: () => {
      setCommentBody('');
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    commentMutation.mutate();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="text-lg font-semibold text-white">
          {comments.length} Komentar
        </h3>
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.username} />
              ) : null}
              <AvatarFallback className="bg-[#D4AF37] text-black text-[10px] font-bold">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Tulis komentar..."
                rows={3}
                className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-y"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!commentBody.trim() || commentMutation.isPending}
                  className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 disabled:opacity-50 h-8 px-4 text-sm"
                >
                  {commentMutation.isPending ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Komentar'
                  )}
                </Button>
              </div>
              {commentMutation.isError && (
                <p className="text-xs text-red-400">
                  {(commentMutation.error as any)?.response?.data?.message || 'Gagal mengirim komentar.'}
                </p>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 text-center py-4 border border-dashed border-[#2A2A2C] rounded-lg">
          <p className="text-sm text-gray-500">
            <a href="/login" className="text-[#D4AF37] hover:underline">Login</a> untuk menulis komentar.
          </p>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-0">
        {comments.length === 0 ? (
          <p className="text-center text-gray-600 py-8 text-sm">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              postOwnerId={postOwnerId}
              acceptedAnswerId={acceptedAnswerId}
            />
          ))
        )}
      </div>
    </div>
  );
}
