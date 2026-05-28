import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TransactionForm } from '@/components/transactions/TransactionForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarTransacaoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: transaction } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user?.id ?? '')
    .single()

  if (!transaction) notFound()

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Editar Transação</h1>
        <p className="text-sm text-slate-500 mt-0.5">Atualize os dados desta transação</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <TransactionForm transaction={transaction} />
      </div>
    </div>
  )
}
