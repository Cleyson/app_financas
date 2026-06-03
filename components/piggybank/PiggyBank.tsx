'use client'

import { useState, type FormEvent } from 'react'
import { addToSavings, withdrawFromSavings } from '@/lib/actions/savings'
import { formatCurrency, parseAmount, cn } from '@/lib/utils'

type PigState = 'sleeping' | 'waking' | 'awake'
type Mode = 'deposit' | 'withdraw'

interface Props {
  initialTotal: number
}

export function PiggyBank({ initialTotal }: Props) {
  const [total, setTotal] = useState(initialTotal)
  const [pigState, setPigState] = useState<PigState>('sleeping')
  const [mode, setMode] = useState<Mode>('deposit')
  const [amountInput, setAmountInput] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  function wake() {
    if (pigState !== 'sleeping') return
    setPigState('waking')
    setTimeout(() => setPigState('awake'), 700)
  }

  function sleep() {
    setPigState('sleeping')
    setAmountInput('')
    setDescription('')
    setError(null)
    setFeedback(null)
  }

  function switchMode(m: Mode) {
    setMode(m)
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const amount = parseAmount(amountInput)

    if (isNaN(amount) || amount <= 0) {
      setError('Informe um valor válido maior que zero')
      return
    }
    if (mode === 'withdraw' && amount > total) {
      setError(`Saldo insuficiente. Cofrinho tem ${formatCurrency(total)}`)
      return
    }

    setLoading(true)
    setError(null)

    const result = mode === 'deposit'
      ? await addToSavings(amount, description || undefined)
      : await withdrawFromSavings(amount, description || undefined)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setTotal(t => t + (mode === 'deposit' ? amount : -amount))
    setFeedback(mode === 'deposit'
      ? `✅ ${formatCurrency(amount)} guardado!`
      : `✅ ${formatCurrency(amount)} retirado!`
    )
    setLoading(false)
    setAmountInput('')
    setDescription('')
    setTimeout(sleep, 1800)
  }

  const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition placeholder:text-slate-400 dark:placeholder:text-slate-500"

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-5 transition-colors flex flex-col">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Cofrinho
      </h2>

      {/* Pig area */}
      <div className="flex flex-col items-center flex-1 justify-center py-2">
        <div className="relative">
          {/* Floating Zzz — only while sleeping */}
          {pigState === 'sleeping' && (
            <div className="absolute -top-7 -right-3 flex flex-col items-start pointer-events-none select-none">
              <span className="text-[10px] text-blue-300 dark:text-blue-500 animate-zzz-1 opacity-0">z</span>
              <span className="text-xs   text-blue-300 dark:text-blue-500 animate-zzz-2 opacity-0 -mt-0.5">Z</span>
              <span className="text-sm   text-blue-300 dark:text-blue-500 animate-zzz-3 opacity-0 -mt-0.5">Z</span>
            </div>
          )}

          <button
            onClick={wake}
            disabled={pigState !== 'sleeping'}
            aria-label="Acordar o porquinho"
            className={cn(
              'text-6xl leading-none select-none focus:outline-none transition-transform',
              pigState === 'sleeping' && 'animate-pig-breathe cursor-pointer hover:scale-110',
              pigState === 'waking'   && 'animate-pig-wake cursor-default',
              pigState === 'awake'   && 'cursor-default'
            )}
          >
            🐷
          </button>
        </div>

        <p className="text-2xl font-bold text-pink-500 dark:text-pink-400 mt-3 tabular-nums">
          {formatCurrency(total)}
        </p>

        {pigState === 'sleeping' && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Clique para acordar
          </p>
        )}
        {pigState === 'waking' && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 animate-pulse">
            Acordando...
          </p>
        )}
      </div>

      {/* Form — only when awake */}
      {pigState === 'awake' && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {feedback ? (
            <p className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 py-3">
              {feedback}
            </p>
          ) : (
            <>
              {/* Mode buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => switchMode('deposit')}
                  className={cn(
                    'h-9 rounded-lg text-sm font-medium border transition',
                    mode === 'deposit'
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  )}
                >
                  🐷 Guardar
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('withdraw')}
                  className={cn(
                    'h-9 rounded-lg text-sm font-medium border transition',
                    mode === 'withdraw'
                      ? 'bg-slate-600 dark:bg-slate-500 text-white border-slate-600 dark:border-slate-500'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  )}
                >
                  💸 Retirar
                </button>
              </div>

              <input
                type="text"
                inputMode="decimal"
                required
                value={amountInput}
                onChange={e => setAmountInput(e.target.value)}
                placeholder="Ex: 50 ou 50,00"
                className={inputCls}
              />

              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descrição (opcional)"
                className={inputCls}
              />

              {error && (
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900">
                  {error}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={sleep}
                  className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-9 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium disabled:opacity-60 transition"
                >
                  {loading ? '...' : mode === 'deposit' ? 'Guardar' : 'Retirar'}
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  )
}
