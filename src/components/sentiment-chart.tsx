"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Votes",
  },
  agree: {
    label: "Agree",
    color: "hsl(var(--vote-agree))",
  },
  mixed: {
    label: "Mixed",
    color: "hsl(var(--vote-mixed))",
  },
  disagree: {
    label: "Disagree",
    color: "hsl(var(--vote-disagree))",
  },
} satisfies ChartConfig

interface SentimentChartProps {
  data: { name: string; value: number; fill: string }[];
}

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
       <style>
        {`
          :root {
            --color-agree: ${chartConfig.agree.color};
            --color-mixed: ${chartConfig.mixed.color};
            --color-disagree: ${chartConfig.disagree.color};
          }
        `}
      </style>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
