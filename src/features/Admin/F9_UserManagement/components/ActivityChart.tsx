// src/features/Admin/F9_UserManagement/components/ActivityChart.tsx
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import type { ActivityChartPoint } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../../../components/ui/chart';
import { formatNumber } from '../../../../lib/utils';

const lineChartConfig = {
  posts: { label: 'Posts', color: '#D4AF37' },
  comments: { label: 'Comments', color: '#3b82f6' },
} satisfies ChartConfig;

interface ActivityChartProps {
  data: ActivityChartPoint[];
  totalPosts: number;
  totalComments: number;
}

export default function ActivityChart({ data, totalPosts, totalComments }: ActivityChartProps) {
  return (
    <Card className="border-[#2A2A2C] bg-[#161618] lg:col-span-2 flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base text-white font-semibold">Line Chart - Interactive</CardTitle>
          <CardDescription className="text-gray-500 text-xs">Showing growth of content metrics</CardDescription>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Posts</p>
            <p className="text-xl font-bold text-[#D4AF37] font-fira-code">{formatNumber(totalPosts)}</p>
          </div>
          <div className="border-l border-[#2A2A2C] pl-4">
            <p className="text-[10px] text-gray-500 uppercase">Comments</p>
            <p className="text-xl font-bold text-blue-400 font-fira-code">{formatNumber(totalComments)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={lineChartConfig} className="h-[260px] w-full">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 10 }}>
            <CartesianGrid vertical={false} stroke="#2A2A2C" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#6b7280"
              fontSize={11}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="posts"
              type="monotone"
              stroke={lineChartConfig.posts.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="comments"
              type="monotone"
              stroke={lineChartConfig.comments.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
