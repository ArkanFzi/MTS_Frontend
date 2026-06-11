// src/features/User/F17_Comment/components/ReplyForm.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Loader2 } from 'lucide-react';
import { createReply } from '../../F20_NestedCommentReply/api';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';
import { useAuthStore } from '../../../../store/useAuthStore';

interface ReplyFormProps {
  postId: string;
  commentId: string;
}

export default function ReplyForm({ postId, commentId }: ReplyFormProps) {
  const [body, setBody] = useState('');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createReply(postId, commentId, { body }),
    onSuccess: () => {
      setBody('');
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    mutation.mutate();
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start">
      <Avatar className="h-7 w-7 flex-shrink-0 mt-1">
        {user.avatar_url ? (
          <AvatarImage src={user.avatar_url} alt={user.username} />
        ) : null}
        <AvatarFallback className="bg-[#D4AF37] text-black text-[10px] font-bold">
          {user.username.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tulis balasan..."
          className="flex-1 h-9 rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors"
        />
        <Button
          type="submit"
          disabled={!body.trim() || mutation.isPending}
          className="h-9 px-3 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
