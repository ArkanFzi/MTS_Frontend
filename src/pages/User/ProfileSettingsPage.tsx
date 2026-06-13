// src/pages/User/ProfileSettingsPage.tsx
import { Settings } from 'lucide-react';
import SettingsForm from '../../features/User/F28_ProfileSettings/components/SettingsForm';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

export default function ProfileSettingsPage() {
  return (
    <ResponsiveLayout>
      {/* Container utama los full-width tanpa max-width sesuai gaya Leaderboard */}
      <div className="w-full py-8">
        
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Pengaturan Profil
            </h1>
          </div>
          <p className="text-sm text-gray-400 ml-9">
            Kelola informasi profil dan password kamu.
          </p>
        </div>

        {/* ── Content Card (Gaya brutalist minimalis) ── */}
        <div className="border border-[#2A2A2C] rounded-lg overflow-hidden bg-[#161618]">
          <div className="p-4 md:p-6">
            <SettingsForm />
          </div>
        </div>
        
      </div>
    </ResponsiveLayout>
  );
}