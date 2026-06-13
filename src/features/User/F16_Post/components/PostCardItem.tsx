// src/features/User/F16_Post/components/PostCardItem.tsx
import { Link } from 'react-router-dom';
import { Eye, MessageSquare, Flame, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

// Sesuaikan props ini dengan interface asli yang lu miliki jika ada tambahan fields
interface PostCardItemProps {
  post: {
    id: string;
    title: string;
    body?: string;
    category?: { name: string };
    tags?: { id: string; name: string }[];
    user?: { username: string };
    created_at?: string;
    votes_count?: number;
    views_count?: number;
    answers_count?: number;
    points?: number;
    is_hot?: boolean;
    is_solved?: boolean;
  };
  // Pertahankan props fungsi delete/edit bawaan lu jika dioper dari parent
  onDelete?: (id: string) => void;
  deleteMutation?: { isPending: boolean }; 
}

export default function PostCardItem({ post, onDelete, deleteMutation }: PostCardItemProps) {
  
  // ── Fungsi Formatter Mengubah ISO String Menjadi Tanggal Bersih (Contoh: 10 Jun 2026) ──
  const formattedDate = post.created_at
    ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short', // 'short' menghasilkan teks pendek (Jun, Jul, Ags). Gunakan 'long' jika ingin full (Juni)
        year: 'numeric'
      }).format(new Date(post.created_at))
    : 'Baru saja';

  return (
    <Card className="bg-[#131315] border border-[#2A2A2C] hover:border-zinc-700/60 p-4 transition-all duration-300 group rounded-xl relative overflow-hidden">
      {/* Efek dekorasi garis hover kiri khas premium */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-[#D4AF37] transition-colors duration-300" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-1">
        
        {/* ── SEKTOR KIRI: Konten Utama & Label Status ── */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Baris Badge Status */}
          <div className="flex flex-wrap items-center gap-1.5">
            {post.is_hot && (
              <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md gap-0.5">
                <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                Hot
              </Badge>
            )}
            
            <Badge variant="outline" className="bg-zinc-900/50 text-zinc-400 border-zinc-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
              {post.category?.name || 'Programming'}
            </Badge>

            {post.is_solved ? (
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium px-2 py-0.5 rounded-md">
                Terjawab
              </Badge>
            ) : (
              <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-medium px-2 py-0.5 rounded-full">
                Open
              </Badge>
            )}
          </div>

          {/* Judul Postingan yang Slim & Rapi */}
          <Link to={`/posts/${post.id}`} className="block">
            <h2 className="text-base font-semibold text-zinc-100 group-hover:text-[#D4AF37] tracking-tight transition-colors duration-200 line-clamp-1">
              {post.title}
            </h2>
          </Link>

          {/* Meta Data Penulis & Waktu */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span className="inline-flex items-center justify-center bg-zinc-800 text-[#D4AF37] w-5 h-5 rounded-md font-bold text-[10px] uppercase">
              {(post.user?.username || 'US').substring(0, 2)}
            </span>
            <span className="text-zinc-300 font-semibold">{post.user?.username || 'user'}</span>
            <span>•</span>
            {/* Menampilkan hasil format tanggal bersih */}
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* ── SEKTOR KANAN: Kombinasi Metrik Box & Tombol Aksi Kelola ── */}
        <div className="flex flex-row md:flex-col lg:flex-row items-center gap-4 flex-shrink-0 justify-between md:justify-end border-t border-[#2A2A2C] md:border-t-0 pt-3 md:pt-0">
          
          {/* Row Metrik Statis (Votes & Views) */}
          <div className="flex items-center gap-2">
            {/* Box Nilai Skor/Votes */}
            <div className="bg-[#1A1A1C]/60 border border-[#2A2A2C] rounded-lg px-3.5 py-1.5 min-w-[68px] text-center group-hover:bg-[#1A1A1C] transition-colors">
              <span className="block text-sm font-bold text-[#D4AF37] font-fira-code tabular-nums">
                {post.points ?? post.votes_count ?? 0}
              </span>
              <span className="block text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                Votes
              </span>
            </div>

            {/* Box Total Views */}
            <div className="bg-[#1A1A1C]/40 border border-[#2A2A2C]/60 rounded-lg px-3.5 py-1.5 min-w-[68px] text-center">
              <span className="block text-sm font-bold text-zinc-400 font-fira-code tabular-nums">
                {post.views_count ?? 0}
              </span>
              <span className="block text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                Views
              </span>
            </div>
          </div>

          {/* Sektor Tombol Manajemen Milik User (Edit & Delete Bawaan Kode Lu) */}
          <div className="flex items-center gap-1.5">
            <Link to={`/posts/${post.id}/edit`}>
              <button 
                type="button" 
                className="p-2 bg-[#161618] border border-[#2A2A2C] hover:border-zinc-600 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Edit Postingan"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </Link>

            {/* Tombol Delete Beserta Kondisi IsPending Sesuai Baris Kode Asli Lu */}
            <button
              type="button"
              disabled={deleteMutation?.isPending}
              onClick={() => onDelete && onDelete(post.id)}
              className="p-2 bg-red-950/10 border border-red-950/50 hover:border-red-900 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 cursor-pointer"
              title="Hapus Postingan"
            >
              {deleteMutation?.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

        </div>

      </div>
    </Card>
  );
}