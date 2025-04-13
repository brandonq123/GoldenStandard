'use client'

import React from 'react'
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  Line
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"

// Placeholder data structure
interface StockData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

interface StockChartProps {
  data: StockData[]
  selectedPeriod: string
}

export function StockChart({ data, selectedPeriod }: StockChartProps) {
  // If no data is provided, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  const isPositive = data[data.length - 1].close >= data[0].open

  // Format date based on the time format
  const formatDate = (time: string) => {
    // If it's a time format (HH:MM)
    if (time.includes(':')) {
      return time
    }

    // If it's already in M/D format
    if (time.match(/^\d{1,2}\/\d{1,2}$/)) {
      return time
    }

    // If it's a full date string, convert to M/D format
    try {
      const date = new Date(time)
      if (isNaN(date.getTime())) {
        return time
      }
      return `${date.getMonth() + 1}/${date.getDate()}`
    } catch {
      return time
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with Price Info */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-2xl font-semibold">${data[data.length - 1].close.toFixed(2)}</span>
        <span className={`${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : '-'}${Math.abs(data[data.length - 1].close - data[0].open).toFixed(2)} 
          ({((Math.abs(data[data.length - 1].close - data[0].open) / data[0].open) * 100).toFixed(2)}%)
        </span>
        <span className="text-muted-foreground">Past {selectedPeriod}</span>
      </div>

      {/* Main Chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPeriod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid 
                horizontal={true}
                vertical={false}
                strokeDasharray="3 3"
                stroke="#27272a"
              />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888888' }}
                interval="preserveEnd"
                minTickGap={60}
                tickFormatter={formatDate}
              />
              <YAxis 
                yAxisId="price"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888888' }}
                domain={['auto', 'auto']}
                padding={{ top: 20, bottom: 20 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#ffffff'
                }}
                itemStyle={{
                  color: '#ffffff'
                }}
                labelStyle={{
                  color: '#ffffff'
                }}
                labelFormatter={formatDate}
                formatter={(value: any, name: string) => {
                  if (name === 'price') return [`$${value.toFixed(2)}`, 'Price']
                  return [value, name]
                }}
              />
              
              <Line
                type="monotone"
                yAxisId="price"
                dataKey="close"
                stroke={isPositive ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
                dot={false}
                name="price"
                isAnimationActive={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 