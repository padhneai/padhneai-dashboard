"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface AnalyticsCardProps {
  title: string
  value: number
  icon: LucideIcon
  colorFrom: string
  colorTo: string
}

 const AnalyticsCard = ({ title, value, icon: Icon, colorFrom, colorTo }: AnalyticsCardProps) => {
  return (
    <Card className={`bg-gradient-to-r ${colorFrom} ${colorTo} text-white border-0`}>
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-white text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-white/80" />
      </CardContent>
    </Card>
  )
}

export default AnalyticsCard;
