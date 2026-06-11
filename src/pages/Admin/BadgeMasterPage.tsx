import { BadgeCard } from "@/features/Admin/F11_BadgeMaster/components/BadgeFormModal";
import React from "react";


// Dummy data statis murni untuk keperluan visualisasi CSS Grid
const STYLING_MOCK_DATA = [
  {
    id: "1",
    name: "Scholar",
    description:
      "Diberikan saat user berhasil menjawab sebuah pertanyaan pertama kali secara tepat.",
    tier: "bronze" as const,
    condition_type: "accepted_answers",
    condition_value: 1,
  },
  {
    id: "2",
    name: "Civic Duty",
    description:
      "Memiliki peran aktif dalam melakukan voting up/down sebanyak lebih dari 100 kali.",
    tier: "silver" as const,
    condition_type: "vote_score",
    condition_value: 100,
  },
  {
    id: "3",
    name: "Great Question",
    description:
      "Mencapai poin reputasi tertinggi dalam sejarah ekosistem forum komunitas MTS.",
    tier: "gold" as const,
    condition_type: "reputation_points",
    condition_value: 5000,
  },
  {
    id: "4",
    name: "Ecosystem Elite",
    description:
      "Menulis kontribusi postingan terverifikasi bermutu tinggi secara masif tanpa terkena penalti.",
    tier: "platinum" as const,
    condition_type: "posts_count",
    condition_value: 500,
  },
];

export const BadgeMasterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Desain Styling Bagian Atas / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Badge Master
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Atur parameter gamifikasi, kualifikasi otomatisasi pencapaian,
              serta medali penghargaan user forum MTS.
            </p>
          </div>
          <div>
            <button className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/15 transition-all duration-200">
              + Tambah Master Badge
            </button>
          </div>
        </div>

        {/* Desain Styling Ringkasan Statistik */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Badge
            </span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              24
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="block text-xs font-bold text-amber-500 uppercase tracking-wider">
              Gold Tier
            </span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              4
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Silver Tier
            </span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              8
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="block text-xs font-bold text-orange-500 uppercase tracking-wider">
              Bronze Tier
            </span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              12
            </span>
          </div>
        </div>

        {/* Tata Letak Tata Ruang Grid (Layouting utama) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STYLING_MOCK_DATA.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
};
