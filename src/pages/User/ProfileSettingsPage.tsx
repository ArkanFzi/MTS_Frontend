// src/pages/User/ProfileSettingsPage.tsx
import { Settings } from 'lucide-react';
import SettingsForm from '../../features/User/F28_ProfileSettings/components/SettingsForm';
import { Card } from '../../components/ui/card';

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#D4AF37]" />
          Pengaturan Profil
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola informasi profil dan password kamu.
        </p>
      </div>
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <div className="p-6">
          <SettingsForm />
        </div>
      </Card>
    </div>
  );
}
