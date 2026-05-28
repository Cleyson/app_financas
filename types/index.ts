export type TransactionType = 'receita' | 'despesa'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  date: string
  category: string
  description: string | null
  created_at: string
}

export interface TransactionFormData {
  type: TransactionType
  amount: number
  date: string
  category: string
  description: string
}

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Lazer',
  'Educação',
  'Roupas',
  'Assinaturas',
  'Outros',
] as const

export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguel',
  'Outros',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
