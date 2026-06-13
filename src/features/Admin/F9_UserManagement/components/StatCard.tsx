// src/features/Admin/F9_UserManagement/components/StatCard.tsx
import { Card, CardContent } from '../../../../components/ui/card';
import { formatNumber } from '../../../../lib/utils';

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  subtitle?: string;
}

export default function StatCard({ icon, label, value, color, subtitle }: StatCardProps) {
  return (
    <Card className="border-[#2A2A2C] bg-[#161618] hover:border-[#D4AF37]/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold font-fira-code ${color}`}>{formatNumber(value)}</p>
            {subtitle && <p className="text-[10px] text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#0B0B0C] border border-[#2A2A2C] flex items-center justify-center text-gray-400">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
