'use client'

import { TableConfig } from '@/builders/table'
import { cn } from '@/lib/utils'

interface DataTableProps<T extends Record<string, any>> extends TableConfig<T> {
  data?: T[]
}

export function DataTable<T extends Record<string, any>>({
  title,
  columns,
  data = [],
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="rounded-lg border bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {column.type === 'badge' ? (
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          column.color?.[String(row[column.key])] === 'gray' && 'bg-gray-100 text-gray-700',
                          column.color?.[String(row[column.key])] === 'green' && 'bg-green-100 text-green-700',
                          column.color?.[String(row[column.key])] === 'red' && 'bg-red-100 text-red-700'
                        )}
                      >
                        {column.valueLabel?.[String(row[column.key])] || String(row[column.key])}
                      </span>
                    ) : column.type === 'actions' ? (
                      <div className="flex items-center justify-end gap-2">
                        {column.actions?.map((action, actionIndex) => {
                          if (action.visible && !action.visible(row)) {
                            return null
                          }
                          const Icon = action.icon
                          return (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                              title={action.label}
                            >
                              <Icon className="h-4 w-4" />
                            </button>
                          )
                        })}
                      </div>
                    ) : column.format ? (
                      column.format(row[column.key])
                    ) : (
                      String(row[column.key])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 