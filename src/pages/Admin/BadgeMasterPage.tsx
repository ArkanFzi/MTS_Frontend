import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Award,
  MessageSquare,
  ThumbsUp,
  Shield,
} from "lucide-react";

// SINKRONISASI: Menggunakan Interface asli dari file BadgeCard Anda
interface Badge {
  id: string;
  name: string;
  description: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  condition_type: string;
  condition_value: number;
}

// SINKRONISASI: Menggunakan Mock Data yang isinya persis dengan struktur BadgeCard
const STYLING_MOCK_DATA: Badge[] = [
  {
    id: "BDG-9A2F1",
    name: "Scholar",
    description:
      "Diberikan saat user berhasil menjawab sebuah pertanyaan pertama kali secara tepat.",
    tier: "bronze",
    condition_type: "accepted_answers",
    condition_value: 1,
  },
  {
    id: "BDG-4CBB2",
    name: "Civic Duty",
    description:
      "Memiliki peran aktif dalam melakukan voting up/down sebanyak lebih dari 100 kali.",
    tier: "silver",
    condition_type: "vote_score",
    condition_value: 100,
  },
  {
    id: "BDG-1D3F7",
    name: "Great Question",
    description:
      "Mencapai poin reputasi tertinggi dalam sejarah ekosistem forum komunitas MTS.",
    tier: "gold",
    condition_type: "reputation_points",
    condition_value: 5000,
  },
  {
    id: "BDG-X99Z0",
    name: "Ecosystem Elite",
    description:
      "Menulis kontribusi postingan terverifikasi bermutu tinggi secara masif tanpa terkena penalti.",
    tier: "platinum",
    condition_type: "posts_count",
    condition_value: 500,
  },
];

export const BadgeMasterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Helper untuk merender Icon Thumbnail secara dinamis berdasarkan Tier
  const renderThumbnail = (tier: string) => {
    const baseClass = "w-5 h-5";
    switch (tier) {
      case "gold":
        return <Award className={`${baseClass} text-amber-400`} />;
      case "silver":
        return <MessageSquare className={`${baseClass} text-slate-400`} />;
      case "bronze":
        return <ThumbsUp className={`${baseClass} text-orange-500`} />;
      case "platinum":
        return (
          <Shield className={`${baseClass} text-indigo-400 animate-pulse`} />
        );
      default:
        return <Award className={`${baseClass} text-zinc-400`} />;
    }
  };

  // Helper styling untuk bingkai Tier di dalam tabel (disesuaikan huruf kecil)
  const getTierStyle = (tier: string) => {
    switch (tier) {
      case "gold":
        return "border-amber-500/40 text-amber-400 bg-amber-500/5";
      case "silver":
        return "border-slate-500/40 text-slate-300 bg-slate-500/5";
      case "bronze":
        return "border-orange-700/40 text-orange-400 bg-orange-700/5";
      case "platinum":
        return "border-indigo-500/40 text-indigo-400 bg-indigo-950/20";
      default:
        return "border-zinc-700 text-zinc-400";
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0C] text-white p-6 sm:p-10 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER UTAMA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Badge Master
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Atur parameter gamifikasi, kualifikasi otomatisasi pencapaian,
              serta medali penghargaan user forum MTS.
            </p>
          </div>
          <button className="px-4 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black text-xs font-bold rounded tracking-wide transition-colors">
            + Tambah Master Badge
          </button>
        </div>

        {/* INDUK CARD UTAMA PANEL TABEL */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          {/* Fitur Bar Atas: Input Search & Filter Dropdown */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-xs">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-zinc-500" />
              </span>
              <input
                type="text"
                placeholder="Cari UUID atau Nama Badge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0B0B0C] border border-zinc-800 rounded-lg text-xs text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-zinc-700 transition-colors"
              />
            </div>
            <button className="p-2 bg-[#0B0B0C] border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>

          {/* AREA TABEL DATA UTAMA */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-950/20">
                  <th className="py-3 px-4 font-semibold">Badge UUID</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Thumbnail
                  </th>
                  <th className="py-3 px-4 font-semibold">Nama</th>
                  <th className="py-3 px-4 font-semibold">Tier</th>
                  <th className="py-3 px-4 font-semibold">Condition Type</th>
                  <th className="py-3 px-4 font-semibold text-right">
                    Target Val
                  </th>
                  <th className="py-3 px-4 max-w-xs">Deskripsi</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-xs">
                {STYLING_MOCK_DATA.map((badge) => (
                  <tr
                    key={badge.id}
                    className="hover:bg-zinc-900/20 transition-colors group"
                  >
                    {/* Badge UUID (Menggunakan properti id) */}
                    <td className="py-4 px-4 font-mono font-medium text-emerald-500 tracking-wide">
                      {badge.id}
                    </td>

                    {/* Thumbnail Kotak Border */}
                    <td className="py-4 px-4">
                      <div
                        className={`w-10 h-10 mx-auto bg-[#0B0B0C] border ${badge.tier === "platinum" ? "border-indigo-500/40 shadow-[0_0_8px_rgba(129,140,248,0.2)]" : "border-zinc-800"} rounded-lg flex items-center justify-center`}
                      >
                        {renderThumbnail(badge.tier)}
                      </div>
                    </td>

                    {/* Nama Badge */}
                    <td className="py-4 px-4 font-medium text-zinc-200">
                      {badge.name}
                    </td>

                    {/* Tier Berbingkai Kotak Slim (Huruf di-uppercase otomatis saat render UI) */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider border uppercase ${getTierStyle(badge.tier)}`}
                      >
                        {badge.tier}
                      </span>
                    </td>

                    {/* Condition Type (Sesuai file badgecard) */}
                    <td className="py-4 px-4 font-mono text-zinc-400">
                      {badge.condition_type}
                    </td>

                    {/* Target Val (Menggunakan condition_value dari file badgecard) */}
                    <td className="py-4 px-4 text-right font-semibold text-zinc-300 font-mono">
                      {badge.condition_value.toLocaleString()}
                    </td>

                    {/* Deskripsi */}
                    <td className="py-4 px-4 text-zinc-500 truncate max-w-[220px]">
                      {badge.description}
                    </td>

                    {/* Tombol Aksi di bagian paling ujung kanan baris tabel */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
                          Ubah
                        </button>
                        <button className="px-2.5 py-1 text-[11px] font-semibold text-red-400 bg-red-950/10 border border-red-900/20 rounded-md hover:bg-red-950/30 transition-colors">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER CARD: PANEL PAGINATION */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <div>
              Menampilkan{" "}
              <span className="text-zinc-400 font-medium">1 sampai 4</span> dari{" "}
              <span className="text-zinc-400 font-medium">48</span> data
            </div>

            {/* Tombol Angka Pagination Navigasi */}
            <div className="flex items-center gap-1">
              <button className="p-1.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg hover:bg-zinc-900 text-zinc-600 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-3 py-1 bg-[#0B0B0C] border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-md text-xs">
                1
              </button>
              <button className="px-3 py-1 bg-[#0B0B0C] border border-zinc-800 hover:border-zinc-700 text-zinc-400 rounded-md text-xs transition-colors">
                2
              </button>
              <button className="px-3 py-1 bg-[#0B0B0C] border border-zinc-800 hover:border-zinc-700 text-zinc-400 rounded-md text-xs transition-colors">
                3
              </button>
              <button className="p-1.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg hover:bg-zinc-900 text-zinc-400 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
