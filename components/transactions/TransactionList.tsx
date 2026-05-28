'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteTransaction } from '@/lib/actions/transactions'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Transaction } from '@/types'

interface Props {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esta transação?')) return
    setDeletingId(id)
    await deleteTransaction(id)
    setDeletingId(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-3xl mb-3">💳</p>
        <p className="text-sm">Nenhuma transação encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 px-4 py-3 hover:border-slate-200 dark:hover:border-slate-700 transition"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold ${
              t.type === 'receita'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400'
            }`}
          >
            {t.type === 'receita' ? '↑' : '↓'}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
              {t.description || t.category}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t.category} · {formatDate(t.date)}
            </p>
          </div>

          <p
            className={`text-sm font-semibold flex-shrink-0 ${
              t.type === 'receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
            }`}
          >
            {t.type === 'receita' ? '+' : '-'}
            {formatCurrency(Number(t.amount))}
          </p>

          <div className="flex gap-1 flex-shrink-0">
            <Link
              href={`/transacoes/${t.id}/editar`}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-700 transition text-xs"
            >
              ✏️
            </Link>
            <button
              onClick={() => handleDelete(t.id)}
              disabled={deletingId === t.id}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-700 transition text-xs disabled:opacity-50"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
