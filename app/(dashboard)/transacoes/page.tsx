import { Suspense } from 'react'
import Link from 'next/link'
import { getTransactions } from '@/lib/actions/transactions'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'

interface Props {
  searchParams: Promise<{
    month?: string
    year?: string
    type?: string
    category?: string
  }>
}

export default async function TransacoesPage({ searchParams }: Props) {
  const params = await searchParams
  const now = new Date()

  const { data: transactions } = await getTransactions({
    month: params.month ? Number(params.month) : now.getMonth() + 1,
    year: params.year ? Number(params.year) : now.getFullYear(),
    type: params.type,
    category: params.category,
  })

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Transações</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {transactions?.length ?? 0} transação(ões) encontrada(s)
          </p>
        </div>
        <Link
          href="/transacoes/nova"
          className="h-9 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1.5"
        >
          + Nova
        </Link>
      </div>

      {/* Filters */}
      <Suspense>
        <TransactionFilters
          currentMonth={params.month ? Number(params.month) : now.getMonth() + 1}
          currentYear={params.year ? Number(params.year) : now.getFullYear()}
          currentType={params.type}
          currentCategory={params.category}
        />
      </Suspense>

      {/* List */}
      <TransactionList transactions={transactions ?? []} />
    </div>
  )
}
