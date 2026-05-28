import { TransactionForm } from '@/components/transactions/TransactionForm'

export default function NovaTransacaoPage() {
  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Nova Transação</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Registre uma receita ou despesa</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 transition-colors">
        <TransactionForm />
      </div>
    </div>
  )
}
