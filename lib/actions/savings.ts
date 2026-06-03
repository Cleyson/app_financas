'use server'

import { revalidatePath } from 'next/cache'
import { createClient, getAuthUser } from '@/lib/supabase/server'

export async function getSavingsTotal() {
  const [supabase, user] = await Promise.all([createClient(), getAuthUser()])
  if (!user) return { total: 0, error: 'Não autenticado' }

  const { data, error } = await supabase
    .from('savings')
    .select('amount')
    .eq('user_id', user.id)

  if (error) return { total: 0, error: error.message }

  const total = (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0)
  return { total, error: null }
}

export async function addToSavings(amount: number, description?: string) {
  const [supabase, user] = await Promise.all([createClient(), getAuthUser()])
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('savings').insert({
    user_id: user.id,
    amount,
    description: description || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { error: null }
}

export async function withdrawFromSavings(amount: number, description?: string) {
  const [supabase, user] = await Promise.all([createClient(), getAuthUser()])
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('savings').insert({
    user_id: user.id,
    amount: -amount,
    description: description || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { error: null }
}
