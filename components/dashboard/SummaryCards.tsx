import { formatCurrency } from '@/lib/utils'

interface Props {
  totalReceitas: number
  totalDespesas: number
  saldo: number
  savingsTotal: number
}

export function SummaryCards({ totalReceitas, totalDespesas, saldo, savingsTotal }: Props) {
  const saldoDisponivel = saldo - savingsTotal

  const cards = [
    {
      title: 'Receitas',
      value: totalReceitas,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      icon: '↑',
    },
    {
      title: 'Despesas',
      value: totalDespesas,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-100 dark:border-red-900/50',
      icon: '↓',
    },
    {
      title: 'Cofrinho',
      value: savingsTotal,
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-50 dark:bg-pink-950/30',
      border: 'border-pink-100 dark:border-pink-900/50',
      icon: '🐷',
    },
    {
      title: 'Saldo disponível',
      value: saldoDisponivel,
      color: saldoDisponivel >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400',
      bg: saldoDisponivel >= 0 ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-red-50 dark:bg-red-950/30',
      border: saldoDisponivel >= 0 ? 'border-blue-100 dark:border-blue-900/50' : 'border-red-100 dark:border-red-900/50',
      icon: '=',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl border p-5 bg-white dark:bg-slate-900 transition-colors ${card.border}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.title}</span>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${card.bg} ${card.color}`}>
              {card.icon}
            </span>
          </div>
          <p className={`text-2xl font-semibold tabular-nums ${card.color}`}>
            {formatCurrency(card.value)}
          </p>
        </div>
      ))}
    </div>
  )
}
