// src/features/Admin/F9_UserManagement/components/ReputationChart.tsx
import { LabelList, RadialBar, RadialBarChart } from 'recharts';
import type { PointsSummaryEntry } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../../../components/ui/chart';
import { ArrowUpRight } from 'lucide-react';

const RADIAL_COLORS = ['#D4AF37', '#3b82f6', '#10b981', '#a855f7', '#64748b'];

interface ReputationChartProps {
  topEarners: PointsSummaryEntry[];
}

export default function ReputationChart({ topEarners }: ReputationChartProps) {
  const chartData = topEarners.slice(0, 5).map((earner, index) => ({
    username: earner.username,
    points: earner.total_points,
    fill: RADIAL_COLORS[index] || '#2A2A2C',
  }));

  const chartConfig = {
    points: { label: 'Reputation' },
    ...topEarners.slice(0, 5).reduce((acc, earner, index) => {
      acc[earner.username] = {
        label: earner.username,
        color: RADIAL_COLORS[index] || '#2A2A2C',
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>)
  } satisfies ChartConfig;

  return (
    <Card className="border-[#2A2A2C] bg-[#161618] flex flex-col justify-between">
      <CardHeader className="pb-0">
        <CardTitle className="text-base text-white font-semibold">Reputation Share</CardTitle>
        <CardDescription className="text-gray-500 text-xs">Top 5 earners distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[260px] pb-2">
        {chartData.length === 0 ? (
          <p className="text-xs text-gray-600">No data available.</p>
        ) : (
          <ChartContainer config={chartConfig} className="w-full aspect-square max-h-[230px]">
            <RadialBarChart
              data={chartData}
              startAngle={-90}
              endAngle={380}
              innerRadius={35}
              outerRadius={105}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="username" />}
              />
              <RadialBar dataKey="points" background={{ fill: '#0B0B0C' }}>
                <LabelList
                  position="insideStart"
                  dataKey="username"
                  className="fill-white capitalize font-medium tracking-wide text-[10px]"
                  clockWise={false}
                />
              </RadialBar>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <div className="p-4 border-t border-[#2A2A2C] flex items-center justify-between text-xs text-gray-500 bg-[#0B0B0C]/30 rounded-b-xl">
        <div className="flex items-center gap-1">
          Top Earner: <span className="text-[#D4AF37] font-semibold">{topEarners[0]?.username || '-'}</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400">
          Active <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
    </Card>
  );
}
