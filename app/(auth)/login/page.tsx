'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/lib/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function translateError(msg: string): string {
    if (msg.toLowerCase().includes('email not confirmed'))
      return 'E-mail não confirmado. Verifique sua caixa de entrada (e a pasta de spam) e clique no link de confirmação.'
    if (msg.toLowerCase().includes('invalid login credentials'))
      return 'E-mail ou senha incorretos.'
    if (msg.toLowerCase().includes('too many requests'))
      return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
    return msg
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await login(new FormData(e.currentTarget))
    if (result?.error) {
      setError(translateError(result.error))
      setLoading(false)
    }
  }

  const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
  const labelCls = "text-sm font-medium text-slate-700 dark:text-slate-300"

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Entrar</h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Acesse sua conta para continuar</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" name="email" type="email" required autoComplete="email"
            placeholder="seu@email.com" className={inputCls} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className={labelCls}>Senha</label>
          <input id="password" name="password" type="password" required autoComplete="current-password"
            placeholder="••••••••" className={inputCls} />
        </div>

        {error && (
          <p className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 px-3 py-2.5 rounded-lg leading-relaxed">{error}</p>
        )}

        <button type="submit" disabled={loading}
          className="w-full h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Não tem conta?{' '}
        <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}
