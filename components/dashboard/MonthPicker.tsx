'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MONTHS } from '@/lib/utils'

interface Props {
  month: number
  year: number
}

export function MonthPicker({ month, year }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function navigate(newMonth: number, newYear: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('month', String(newMonth))
    params.set('year', String(newYear))
    router.push(`?${params.toString()}`)
  }

  function prev() {
    if (month === 1) navigate(12, year - 1)
    else navigate(month - 1, year)
  }

  function next() {
    if (month === 12) navigate(1, year + 1)
    else navigate(month + 1, year)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={prev}
        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition"
      >
        ‹
      </button>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[130px] text-center">
        {MONTHS[month - 1]} {year}
      </span>
      <button
        onClick={next}
        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition"
      >
        ›
      </button>
    </div>
  )
}
