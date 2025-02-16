import { Line } from 'react-chartjs-2'
import { cn } from '@/lib/utils'

interface ChartWidgetProps {
  title: string
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
    }[]
  }
  className?: string
}

export function ChartWidget({ title, data, className }: ChartWidgetProps) {
  return (
    <div className={cn('p-6 bg-card rounded-lg border', className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 h-[300px]">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  )
} 