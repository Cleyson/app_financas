'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTransaction, updateTransaction } from '@/lib/actions/transactions'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type Transaction } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  transaction?: Transaction
  onSuccess?: () => void
}

export function TransactionForm({ transaction, onSuccess }: Props) {
  const router = useRouter()
  const [type, setType] = useState<'receita' | 'despesa'>(transaction?.type ?? 'despesa')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categories = type === 'receita' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const data = new FormData(e.currentTarget)
    const formData = {
      type,
      amount: Number(data.get('amount')),
      date: data.get('date') as string,
      category: data.get('category') as string,
      description: data.get('description') as string,
    }

    const result = transaction
      ? await updateTransaction(transaction.id, formData)
      : await createTransaction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    onSuccess?.()
    router.push('/transacoes')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tipo */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Tipo</label>
        <div className="grid grid-cols-2 gap-2">
          {(['despesa', 'receita'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                'h-10 rounded-lg text-sm font-medium border transition',
                type === t
                  ? t === 'receita'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              {t === 'receita' ? '↑ Receita' : '↓ Despesa'}
            </button>
          ))}
        </div>
      </div>

      {/* Valor */}
      <div className="space-y-1.5">
        <label htmlFor="amount" className="text-sm font-medium text-slate-700">
          Valor (R$)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={transaction?.amount}
          placeholder="0,00"
          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Data */}
      <div className="space-y-1.5">
        <label htmlFor="date" className="text-sm font-medium text-slate-700">
          Data
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={transaction?.date ?? new Date().toISOString().split('T')[0]}
          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Categoria */}
      <div className="space-y-1.5">
        <label htmlFor="category" className="text-sm font-medium text-slate-700">
          Categoria
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={transaction?.category ?? ''}
          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
        >
          <option value="" disabled>Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Descrição <span className="text-slate-400 font-normal">(opcional)</span>
        </label>
        <input
          id="description"
          name="description"
          type="text"
          defaultValue={transaction?.description ?? ''}
          placeholder="Ex: Supermercado, Salário..."
          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 h-10 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? 'Salvando...' : transaction ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>
    </form>
  )
}
