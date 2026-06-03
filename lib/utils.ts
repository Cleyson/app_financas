import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day))
}

export function parseAmount(raw: string): number {
  const s = raw.trim().replace(/\s/g, '')
  if (!s) return NaN
  if (s.includes(',') && s.includes('.')) return parseFloat(s.replace(/\./g, '').replace(',', '.'))
  if (s.includes(',')) return parseFloat(s.replace(',', '.'))
  if (s.includes('.')) {
    const last = s.split('.').pop()!
    if (last.length === 3) return parseFloat(s.replace(/\./g, ''))
    return parseFloat(s)
  }
  return parseFloat(s)
}

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
