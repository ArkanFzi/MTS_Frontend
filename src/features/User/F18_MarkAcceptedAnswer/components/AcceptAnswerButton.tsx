// src/features/User/F18_MarkAcceptedAnswer/components/AcceptAnswerButton.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { markAcceptedAnswer } from '../api';

interface AcceptAnswerButtonProps {
  postId: string;
  commentId: string;
  isAccepted: boolean;
  isPostOwner: boolean;
}

export default function AcceptAnswerButton({
  postId,
  commentId,
  isAccepted,
  isPostOwner,
}: AcceptAnswerButtonProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => markAcceptedAnswer(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  if (isAccepted) {
    return (
      <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4 fill-green-400/20" />
        <span>Jawaban Terbaik</span>
      </div>
    );
  }

  if (!isPostOwner) return null;

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-400 transition-colors disabled:opacity-50"
      title="Tandai sebagai jawaban terbaik"
    >
      {mutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CheckCircle2 className="w-4 h-4" />
      )}
      <span>Tandai Jawaban</span>
    </button>
  );
}
