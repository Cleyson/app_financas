'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { TransactionFormData } from '@/types'

export async function getTransactions(filters?: {
  month?: number
  year?: number
  type?: string
  category?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Não autenticado' }

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters?.month && filters?.year) {
    const start = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`
    const end = new Date(filters.year, filters.month, 0)
      .toISOString()
      .split('T')[0]
    query = query.gte('date', start).lte('date', end)
  }

  if (filters?.type) {
    query = query.eq('type', filters.type)
  }

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  const { data, error } = await query
  return { data, error: error?.message ?? null }
}

export async function createTransaction(formData: TransactionFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('transactions').insert({
    user_id: user.id,
    type: formData.type,
    amount: formData.amount,
    date: formData.date,
    category: formData.category,
    description: formData.description || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/transacoes')
  return { error: null }
}

export async function updateTransaction(id: string, formData: TransactionFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('transactions')
    .update({
      type: formData.type,
      amount: formData.amount,
      date: formData.date,
      category: formData.category,
      description: formData.description || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/transacoes')
  return { error: null }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/transacoes')
  return { error: null }
}

export async function getDashboardStats(month: number, year: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Não autenticado' }

  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end = new Date(year, month, 0).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', start)
    .lte('date', end)

  if (error) return { data: null, error: error.message }

  const totalReceitas = data
    .filter((t) => t.type === 'receita')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalDespesas = data
    .filter((t) => t.type === 'despesa')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const saldo = totalReceitas - totalDespesas

  const despesasPorCategoria = data
    .filter((t) => t.type === 'despesa')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + Number(t.amount)
      return acc
    }, {})

  const chartData = Object.entries(despesasPorCategoria).map(([name, value]) => ({
    name,
    value,
  }))

  return {
    data: { totalReceitas, totalDespesas, saldo, chartData, transactions: data },
    error: null,
  }
}
