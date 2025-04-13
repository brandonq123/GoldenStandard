'use client'

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

// Placeholder data for the chart
const data = [
  { time: "9:30", price: 180 },
  { time: "10:00", price: 181.2 },
  { time: "10:30", price: 182.5 },
  { time: "11:00", price: 181.8 },
  { time: "11:30", price: 182.3 },
  { time: "12:00", price: 182.7 },
  { time: "12:30", price: 183.1 },
  { time: "13:00", price: 182.9 },
  { time: "13:30", price: 182.6 },
  { time: "14:00", price: 182.8 },
  { time: "14:30", price: 183.2 },
  { time: "15:00", price: 182.63 },
]

interface StockChartProps {
  data: any // Replace with proper type when real data structure is known
}

export function StockChart({ data: stockData }: StockChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 