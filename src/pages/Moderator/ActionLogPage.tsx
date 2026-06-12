// src/pages/Moderator/ActionLogPage.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ShieldCheck, Search, RefreshCw } from 'lucide-react';

// Import komponen tabel langsung dari folder fiturnya (F14)
import ActionLogTable from '../../features/Moderator/F14_ModeratorActionLog/components/ActionLogTable';

// Mock data riwayat audit khusus keperluan simulasi UI
const MOCK_ACTION_LOGS = [
  {
    id: 'LOG-001',
    moderatorName: 'reisya_mod',
    actionType: 'HIDE_POST' as const,
    target: 'POST-8812',
    reason: 'Postingan terdeteksi spam link judi bola luar negeri.',
    timestamp: '10 Jun 2026 14:22'
  },
  {
    id: 'LOG-002',
    moderatorName: 'faldan_admin',
    actionType: 'BAN_USER' as const,
    target: 'user_toxic99',
    reason: 'Ujaran kebencian berulang di kolom komentar forum.',
    timestamp: '09 Jun 2026 21:05'
  },
  {
    id: 'LOG-003',
    moderatorName: 'asya_nikmah',
    actionType: 'APPROVE_REPORT' as const,
    target: 'REP-4041',
    reason: 'Laporan valid, duplikasi thread pertanyaan yang sama.',
    timestamp: '08 Jun 2026 09:40'
  },
  {
    id: 'LOG-004',
    moderatorName: 'reisya_mod',
    actionType: 'WARN_USER' as const,
    target: 'pemula_rpl',
    reason: 'Peringatan pertama akibat salah menaruh tag berulang kali.',
    timestamp: '07 Jun 2026 11:15'
  }
];

export default function ActionLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState(MOCK_ACTION_LOGS);

  // Fungsi filter pencarian sederhana berdasarkan nama moderator atau objek target
  const filteredLogs = logs.filter(log => 
    log.moderatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 font-['Inter'] text-white">
      <Card className="bg-[#161618] border border-zinc-800 shadow-2xl rounded-none md:rounded-lg">
        
        {/* HEADER AREA */}
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-lime-500" /> Log Tindakan Moderator
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Rekam jejak transparansi seluruh moderasi konten yang dilakukan tim staf.
            </CardDescription>
          </div>

          {/* UTILITY ACTION (SEARCH & REFRESH) */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Cari moderator atau target..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-zinc-800 pl-9 pr-4 py-2 text-xs rounded outline-none focus:border-zinc-600 text-zinc-300 font-mono placeholder:text-zinc-600 transition-all"
              />
            </div>
            <button 
              onClick={() => setLogs(MOCK_ACTION_LOGS)}
              className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-all"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>

        {/* TABEL AREA */}
        <CardContent className="p-0">
          <ActionLogTable logs={filteredLogs} />
        </CardContent>

      </Card>
    </div>
  );
}