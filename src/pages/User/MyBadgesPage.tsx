// src/pages/User/MyBadgesPage.tsx
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Lock, Unlock, Award, AlertCircle } from 'lucide-react';
import { getAllBadgesForUser } from '../../features/User/F29_BadgeAchievement/api';
import BadgeGridDisplay from '../../features/User/F29_BadgeAchievement/components/BadgeGridDisplay';
import { Skeleton } from '../../components/ui/skeleton';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

export default function MyBadgesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['myBadges'],
    queryFn: getAllBadgesForUser,
  });

  const badges = data?.data || [];

  // Hitung jumlah badge yang terkunci & terbuka
  const { unlocked, locked } = useMemo(() => {
    let u = 0;
    let l = 0;
    badges.forEach((b) => (b.earned_at ? u++ : l++));
    return { unlocked: u, locked: l };
  }, [badges]);

  return (
    <ResponsiveLayout>
      {/* w-full py-8 dengan padding responsif menyamakan standar MyPostsPage */}
      <div className="w-full py-8 px-4 md:px-0 space-y-6">
        
        {/* ── Header & Stats Box (Dibuat Flex-Col pada Mobile, Flex-Row pada Desktop) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-[#D4AF37]" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Mastery Display
              </h1>
            </div>
            <p className="text-sm text-gray-400 ml-9 max-w-xl leading-relaxed">
              Achievements unlocked through rigorous inquiry and authoritative responses. 
              Locked badges indicate thresholds not yet met.
            </p>
          </div>

          {/* Stats Box Responsif */}
          {!isLoading && !isError && badges.length > 0 && (
            <div className="flex items-center bg-[#111112] border border-zinc-900 px-4 py-2.5 gap-4 rounded-xl self-start sm:self-auto font-fira-code">
              <div className="flex items-center gap-2">
                <Unlock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-sm font-bold text-[#D4AF37]">{unlocked}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Unlocked</span>
              </div>
              <div className="w-px h-4 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-sm font-bold text-zinc-400">{locked}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Locked</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Sektor Konten Utama ── */}
        <div className="w-full">
          
          {/* ── Loading State (Grid Responsif Mengikuti Struktur Asli) ── */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-[#111112] border border-zinc-900/80 rounded-xl p-5 flex flex-col items-center gap-3">
                  <Skeleton className="w-14 h-14 rounded-full bg-zinc-800" />
                  <Skeleton className="w-3/4 h-4 bg-zinc-800" />
                  <Skeleton className="w-full h-3 bg-zinc-800" />
                  <Skeleton className="w-full h-5 mt-2 bg-zinc-800" />
                </div>
              ))}
            </div>
          )}

          {/* ── Error State (Meniru Standar Desain Halaman Lain) ── */}
          {isError && (
            <div className="text-center py-20 border border-red-900/20 bg-red-950/5 rounded-xl">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2 opacity-50" />
              <p className="text-red-400 text-sm">Gagal memuat data pencapaian badge milikmu.</p>
            </div>
          )}

          {/* ── Empty State (Jika tidak ada data sama sekali dari API) ── */}
          {!isLoading && !isError && badges.length === 0 && (
            <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
              <Award className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Sistem belum merilis badge pencapaian apa pun saat ini.</p>
            </div>
          )}

          {/* ── Success State Display ── */}
          {!isLoading && !isError && badges.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <BadgeGridDisplay badges={badges} />
            </div>
          )}
          
        </div>

      </div>
    </ResponsiveLayout>
  );
}