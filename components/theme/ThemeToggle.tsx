'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8" />

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className={cn(
        'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full',
        'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
        className
      )}
    >
      <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
      <span>{isDark ? 'Tema claro' : 'Tema escuro'}</span>
    </button>
  )
}
