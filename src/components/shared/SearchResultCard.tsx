// src/components/shared/SearchResultCard.tsx

import { Link } from "react-router-dom";
import { MessageSquare, Eye, ArrowUp, ArrowDown } from "lucide-react";

import type { SearchResultItem } from "../../features/Common/F4_SearchPost/types";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface SearchResultCardProps {
  post: SearchResultItem;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function SearchResultCard({ post }: SearchResultCardProps) {
  return (
    <Link to={`/posts/${post.id}`}>
      <Card className="p-5 bg-[#161618] border-[#2A2A2C] hover:border-[#D4AF37]/30 transition-colors cursor-pointer">
        <div className="flex flex-col gap-3">
          {/* ── Content Top: Title & Body ── */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <Badge
                variant="outline"
                className="text-[11px] border-[#2A2A2C] text-gray-400"
              >
                {post.category.name}
              </Badge>
              <span className="text-[11px] text-gray-500">
                {timeAgo(post.created_at)}
              </span>
            </div>

            <h3 className="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
              {post.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">{post.body}</p>
          </div>

          {/* ── Content Bottom: Stats + Tags + User ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 border-t border-[#2A2A2C] pt-4">
            {/* Statistik (Vote, Comment, View) */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
<div className="flex flex-col items-center gap-0.5 ">
  <ArrowUp className="h-6 w-6 cursor-pointer hover:text-[#D4AF37] transition-colors" />
  
  {/* Angka dibuat besar (text-2xl) dan font-bold untuk menonjol */}
  <span className="text-xl font-bold leading-none text-[#D4AF37]">
    {post.vote_score}
  </span>
  
  <ArrowDown className="h-6 w-6 text-gray-500 hover:text-[#D4AF37] cursor-pointer transition-colors" />
</div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-6 w-6" />
                <span>{post.comments_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-8 w-8" />
                <span>{post.view_count}</span>
              </div>
            </div>

            {/* Tags & User */}
            <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {post.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[11px] font-fira-code"
                    style={{ color: tag.color || "#D4AF37" }}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-0 sm:ml-4 border-l border-[#2A2A2C] pl-0 sm:pl-4">
                <Avatar className="h-5 w-5 border border-[#2A2A2C]">
                  <AvatarImage src={post.user.avatar_url || ""} />
                  <AvatarFallback className="bg-[#0B0B0C] text-[10px] text-[#D4AF37]">
                    {post.user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] text-gray-500">
                  {post.user.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
