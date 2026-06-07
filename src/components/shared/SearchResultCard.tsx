
import { MessageSquare, Eye} from 'lucide-react';

import type { SearchResultItem } from '../../features/Common/F4_SearchPost/types';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface SearchResultCardProps {
  post: SearchResultItem;
}

export function SearchResultCard({ post }: SearchResultCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row gap-5 p-5 bg-[#161618] border border-gray-800 hover:border-gray-700 transition-colors">
      
      {/* Bagian Statistik Kiri */}
      <div className="flex flex-col items-center sm:items-end justify-start min-w-[80px] gap-3 text-sm">
        <div className="text-center sm:text-right">
          <span className="block text-xl font-bold text-[#D4AF37]">{post.vote_score}</span>
          <span className="text-xs text-gray-400">votes</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <MessageSquare className="h-3 w-3" />
          <span>{post.comments_count}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Eye className="h-3 w-3" />
          <span>{post.view_count}</span>
        </div>
      </div>

      {/* Bagian Konten Kanan */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs border-gray-700 text-gray-300">
            {post.category.name}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-white cursor-pointer hover:text-[#D4AF37] transition-colors">
          {post.title}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2">
          {post.body}
        </p>
        
        <div className="flex flex-wrap items-center justify-between mt-3 gap-4">
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <Badge 
                key={tag.id} 
                variant="secondary" 
                className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700"
                style={{ color: tag.color }} // Menggunakan hex color dari database
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-gray-800">
              <AvatarImage src={post.user.avatar_url || ''} />
              <AvatarFallback className="bg-gray-800 text-xs text-[#D4AF37]">
                {post.user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs text-gray-500 flex flex-col">
              <span>Asked by <span className="text-gray-300 font-medium">{post.user.username}</span></span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}