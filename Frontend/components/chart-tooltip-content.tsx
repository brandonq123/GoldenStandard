import { Card, CardContent } from "@/components/ui/card"

interface ChartTooltipContentProps {
  value: string
  label: string
}

export function ChartTooltipContent({ value, label }: ChartTooltipContentProps) {
  // Ensure value and label are defined
  const safeValue = value || "N/A"
  const safeLabel = label || "N/A"

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-2">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{safeLabel}</p>
          <p className="text-sm">{safeValue}</p>
        </div>
      </CardContent>
    </Card>
  )
}
