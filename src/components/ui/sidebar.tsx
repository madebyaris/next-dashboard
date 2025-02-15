'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: 'icon' | 'full'
}

const SidebarContext = React.createContext<{
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}>({
  collapsed: false,
  setCollapsed: () => {},
})

export function Sidebar({
  collapsible,
  className,
  children,
  ...props
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div
        data-collapsible={collapsible}
        className={cn(
          'group/sidebar-wrapper relative flex h-full w-[270px] flex-col overflow-hidden bg-background transition-[width] duration-300 ease-in-out',
          collapsed && 'w-[70px]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex h-14 items-center border-b px-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex-1 overflow-auto', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex h-14 items-center border-t px-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarRail({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed, setCollapsed } = React.useContext(SidebarContext)

  return (
    <div
      className={cn(
        'absolute right-0 top-0 h-full w-1 cursor-col-resize bg-border opacity-0 transition-opacity hover:opacity-100',
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    />
  )
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { collapsed, setCollapsed } = React.useContext(SidebarContext)

  return (
    <button
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground',
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 3.5H14M2 8H14M2 12.5H14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
} 