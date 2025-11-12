import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface MetricDisplayProps {
  label: string
  value: number | string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function MetricDisplay({ label, value, icon, trend }: MetricDisplayProps) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          {value}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide font-medium">
          {label}
        </div>
      </motion.div>
    </Card>
  )
}
