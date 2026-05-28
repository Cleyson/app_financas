import { formatCurrency } from '@/lib/utils'

interface Props {
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export function SummaryCards({ totalReceitas, totalDespesas, saldo }: Props) {
  const cards = [
    {
      title: 'Receitas',
      value: totalReceitas,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      icon: '↑',
    },
    {
      title: 'Despesas',
      value: totalDespesas,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
      icon: '↓',
    },
    {
      title: 'Saldo',
      value: saldo,
      color: saldo >= 0 ? 'text-blue-600' : 'text-red-600',
      bg: saldo >= 0 ? 'bg-blue-50' : 'bg-red-50',
      border: saldo >= 0 ? 'border-blue-100' : 'border-red-100',
      icon: '=',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl border p-5 bg-white ${card.border}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">{card.title}</span>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${card.bg} ${card.color}`}>
              {card.icon}
            </span>
          </div>
          <p className={`text-2xl font-semibold ${card.color}`}>
            {formatCurrency(card.value)}
          </p>
        </div>
      ))}
    </div>
  )
}
