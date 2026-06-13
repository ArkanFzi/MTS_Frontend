// src/pages/User/CreatePostPage.tsx
import CreatePostForm from '../../features/User/F16_Post/components/CreatePostForm';
import { Card } from '../../components/ui/card';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';
import { PenSquare } from 'lucide-react';

export default function CreatePostPage() {
  return (
    <ResponsiveLayout>
      {/* w-full py-8 tanpa max-w-3xl dan tanpa px-4 di desktop, biar lebarnya Los sama persis dengan Trending Page */}
      <div className="w-full py-8 px-4 md:px-0">
        
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <PenSquare className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Buat Pertanyaan Baru
            </h1>
          </div>
          <p className="text-sm text-gray-400 ml-9">
            Ajukan pertanyaan kamu ke komunitas. Pastikan judul jelas dan detail cukup.
          </p>
        </div>

        {/* ── Content Form Card ── */}
        <Card className="border-[#2A2A2C] bg-[#161618] rounded-xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Padding dalem card tetap dinamis biar di HP gak kesempitan */}
          <div className="p-4 md:p-6">
            <CreatePostForm />
          </div>
        </Card>

      </div>
    </ResponsiveLayout>
  );
}