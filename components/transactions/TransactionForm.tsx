'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTransaction, updateTransaction } from '@/lib/actions/transactions'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type Transaction } from '@/types'
import { cn, parseAmount } from '@/lib/utils'

interface Props {
  transaction?: Transaction
  onSuccess?: () => void
}

function formatAmountForInput(amount: number | string): string {
  const n = Number(amount)
  if (isNaN(n)) return ''
  return n.toFixed(2).replace('.', ',')
}

export function TransactionForm({ transaction, onSuccess }: Props) {
  const router = useRouter()
  const [type, setType] = useState<'receita' | 'despesa'>(transaction?.type ?? 'despesa')
  const [category, setCategory] = useState<string>(transaction?.category ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categories = type === 'receita' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleTypeChange(newType: 'receita' | 'despesa') {
    setType(newType)
    setCategory('') // limpa categoria ao trocar tipo
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const data = new FormData(e.currentTarget)
    const amount = parseAmount(data.get('amount') as string)

    if (isNaN(amount) || amount <= 0) {
      setError('Informe um valor válido maior que zero. Ex: 1500 ou 1.500,00')
      setLoading(false)
      return
    }

    if (!category) {
      setError('Selecione uma categoria')
      setLoading(false)
      return
    }

    const formData = {
      type,
      amount,
      date: data.get('date') as string,
      category,
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
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo</label>
        <div className="grid grid-cols-2 gap-2">
          {(['despesa', 'receita'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={cn(
                'h-10 rounded-lg text-sm font-medium border transition',
                type === t
                  ? t === 'receita'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-red-500 text-white border-red-500'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              {t === 'receita' ? '↑ Receita' : '↓ Despesa'}
            </button>
          ))}
        </div>
      </div>

      {/* Valor */}
      <div className="space-y-1.5">
        <label htmlFor="amount" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Valor (R$)
        </label>
        <input
          id="amount"
          name="amount"
          type="text"
          inputMode="decimal"
          required
          defaultValue={transaction ? formatAmountForInput(transaction.amount) : ''}
          placeholder="Ex: 1500 ou 1.500,00"
          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Data */}
      <div className="space-y-1.5">
        <label htmlFor="date" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Data
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={transaction?.date ?? new Date().toISOString().split('T')[0]}
          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Categoria */}
      <div className="space-y-1.5">
        <label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Categoria
        </label>
        <select
          id="category"
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="" disabled>Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Descrição <span className="text-slate-400 font-normal">(opcional)</span>
        </label>
        <input
          id="description"
          name="description"
          type="text"
          defaultValue={transaction?.description ?? ''}
          placeholder="Ex: Supermercado, Salário..."
          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 px-3 py-2.5 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
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
