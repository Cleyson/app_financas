import { Suspense } from 'react'
import { getDashboardStats } from '@/lib/actions/transactions'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { MonthPicker } from '@/components/dashboard/MonthPicker'
import { TransactionList } from '@/components/transactions/TransactionList'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams
  const now = new Date()
  const month = Number(params.month) || now.getMonth() + 1
  const year = Number(params.year) || now.getFullYear()

  const { data } = await getDashboardStats(month, year)

  const stats = data ?? {
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
    chartData: [],
    transactions: [],
  }

  const recentTransactions = stats.transactions.slice(0, 5)

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Resumo financeiro do mês</p>
        </div>
        <Suspense>
          <MonthPicker month={month} year={year} />
        </Suspense>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        totalReceitas={stats.totalReceitas}
        totalDespesas={stats.totalDespesas}
        saldo={stats.saldo}
      />

      {/* Charts + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Despesas por Categoria
          </h2>
          <CategoryChart data={stats.chartData} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">
              Transações Recentes
            </h2>
            <Link
              href="/transacoes"
              className="text-xs text-blue-600 hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          <TransactionList transactions={recentTransactions} />
        </div>
      </div>
    </div>
  )
}
