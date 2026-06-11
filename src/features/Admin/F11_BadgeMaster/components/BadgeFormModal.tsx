import React from "react";

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
  // Pemetaan warna teks nama badge & efek kilau dot murni sesuai gambar UI/UX Anda
  const tierStyles = {
    gold: {
      textName: "text-amber-400 font-bold",
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    },
    silver: {
      textName: "text-slate-300 font-bold",
      dot: "bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.8)]",
    },
    bronze: {
      textName: "text-orange-400 font-bold",
      dot: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]",
    },
    platinum: {
      textName: "text-indigo-400 font-bold",
      dot: "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]",
    },
  };

  const style = tierStyles[badge.tier] || tierStyles.bronze;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-2 hover:bg-zinc-900/30 transition-colors duration-150">
      {/* Kolon Kiri: Dot Indikator + Nama Badge + Deskripsi */}
      <div className="flex items-start md:items-center gap-4 flex-1">
        {/* Kontainer Nama Badge (Teks Polos + Dot sesuai Gambar) */}
        <div className="flex items-center gap-2 min-w-[150px] shrink-0">
          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
          <span className={`text-sm ${style.textName}`}>{badge.name}</span>
        </div>

        {/* Teks Deskripsi Aturan */}
        <p className="text-xs text-zinc-400 font-normal leading-relaxed max-w-2xl">
          {badge.description}
        </p>
      </div>

      {/* Kolon Kanan: Tipe Kondisi + Batas Nilai + Tombol Kontrol */}
      <div className="flex items-center justify-between md:justify-end gap-6 min-w-[300px] shrink-0">
        {/* Metadata Kriteria */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono text-zinc-500 bg-black/40 px-2 py-0.5 rounded border border-zinc-800/60">
            {badge.condition_type}
          </span>
          <span className="text-zinc-500 text-[11px]">
            Min.{" "}
            <span className="text-xs font-bold text-zinc-200">
              {badge.condition_value}
            </span>
          </span>
        </div>

        {/* Tombol Manipulasi Data */}
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1.5 text-[11px] font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            Ubah
          </button>
          <button className="px-2.5 py-1.5 text-[11px] font-semibold text-red-400 bg-red-950/10 border border-red-900/20 rounded-md hover:bg-red-950/30 transition-colors">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
