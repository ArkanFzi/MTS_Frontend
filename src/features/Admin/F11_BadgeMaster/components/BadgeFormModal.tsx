import React from "react";

// Struktur data statis untuk keperluan visual render
interface Badge {
  id: string;
  name: string;
  description: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  condition_type: string;
  condition_value: number;
}

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  // ATURAN STYLING DI SINI: Modifikasi warna tema di bawah ini untuk mengubah visual badge
  const tierStyles = {
    gold: {
      bg: "bg-amber-50 hover:bg-amber-100/70 border-amber-300",
      badgeBg: "bg-amber-500 text-white shadow-sm shadow-amber-500/20",
      text: "text-amber-800",
      dot: "bg-amber-400",
    },
    silver: {
      bg: "bg-slate-50 hover:bg-slate-100/70 border-slate-300",
      badgeBg: "bg-slate-400 text-white shadow-sm shadow-slate-400/20",
      text: "text-slate-800",
      dot: "bg-slate-300",
    },
    bronze: {
      bg: "bg-orange-50 hover:bg-orange-100/70 border-orange-200",
      badgeBg: "bg-orange-600 text-white shadow-sm shadow-orange-600/20",
      text: "text-orange-800",
      dot: "bg-orange-500",
    },
    platinum: {
      bg: "bg-indigo-50 hover:bg-indigo-100/70 border-indigo-300",
      badgeBg:
        "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20",
      text: "text-indigo-900",
      dot: "bg-indigo-400",
    },
  };

  const style = tierStyles[badge.tier] || tierStyles.bronze;

  return (
    <div
      className={`p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between h-full ${style.bg}`}
    >
      <div>
        {/* Header Kartu: Nama Badge & Animasi Dot */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 ${style.badgeBg}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`}
              />
              {badge.name}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {badge.tier}
          </span>
        </div>

        {/* Deskripsi Aturan Badge */}
        <p className="text-sm text-slate-600 font-normal leading-relaxed mb-4">
          {badge.description}
        </p>
      </div>

      {/* Bagian Bawah Kartu: Kriteria Pemicu Kondisi */}
      <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono bg-white/80 px-2 py-1 rounded border border-slate-200">
          {badge.condition_type}
        </span>
        <span className="font-semibold text-slate-700">
          Min.{" "}
          <span className="text-base font-bold text-slate-900">
            {badge.condition_value}
          </span>
        </span>
      </div>

      {/* Tombol Aksi Admin */}
      <div className="mt-4 pt-3 flex justify-end gap-2 border-t border-slate-100">
        <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          Ubah
        </button>
        <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
          Hapus
        </button>
      </div>
    </div>
  );
};
