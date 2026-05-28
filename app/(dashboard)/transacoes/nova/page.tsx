import { TransactionForm } from '@/components/transactions/TransactionForm'

export default function NovaTransacaoPage() {
  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Nova Transação</h1>
        <p className="text-sm text-slate-500 mt-0.5">Registre uma receita ou despesa</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <TransactionForm />
      </div>
    </div>
  )
}
