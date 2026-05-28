'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MONTHS } from '@/lib/utils'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types'

interface Props {
  currentMonth: number
  currentYear: number
  currentType?: string
  currentCategory?: string
}

export function TransactionFilters({ currentMonth, currentYear, currentType, currentCategory }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    if (key === 'type') params.delete('category')
    router.push(`?${params.toString()}`)
  }

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]
  const filteredCategories = currentType === 'receita'
    ? INCOME_CATEGORIES
    : currentType === 'despesa'
    ? EXPENSE_CATEGORIES
    : allCategories

  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="flex flex-wrap gap-2">
      {/* Month */}
      <select
        value={currentMonth}
        onChange={(e) => update('month', e.target.value)}
        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>{m}</option>
        ))}
      </select>

      {/* Year */}
      <select
        value={currentYear}
        onChange={(e) => update('year', e.target.value)}
        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* Type */}
      <select
        value={currentType ?? ''}
        onChange={(e) => update('type', e.target.value)}
        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">Todos os tipos</option>
        <option value="receita">Receitas</option>
        <option value="despesa">Despesas</option>
      </select>

      {/* Category */}
      <select
        value={currentCategory ?? ''}
        onChange={(e) => update('category', e.target.value)}
        className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">Todas as categorias</option>
        {filteredCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  )
}
