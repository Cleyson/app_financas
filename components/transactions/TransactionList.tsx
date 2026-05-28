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
          className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 px-4 py-3 hover:border-slate-200 transition"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold ${
              t.type === 'receita'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-500'
            }`}
          >
            {t.type === 'receita' ? '↑' : '↓'}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {t.description || t.category}
            </p>
            <p className="text-xs text-slate-400">
              {t.category} · {formatDate(t.date)}
            </p>
          </div>

          <p
            className={`text-sm font-semibold flex-shrink-0 ${
              t.type === 'receita' ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {t.type === 'receita' ? '+' : '-'}
            {formatCurrency(Number(t.amount))}
          </p>

          <div className="flex gap-1 flex-shrink-0">
            <Link
              href={`/transacoes/${t.id}/editar`}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition text-xs"
            >
              ✏️
            </Link>
            <button
              onClick={() => handleDelete(t.id)}
              disabled={deletingId === t.id}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-200 transition text-xs disabled:opacity-50"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
