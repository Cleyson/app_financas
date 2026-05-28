'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/lib/actions/auth'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (formData.get('password') !== formData.get('confirmPassword')) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    if (result?.success && result.email) {
      setSentTo(result.email)
    }
  }

  // Tela de confirmação de e-mail
  if (sentTo) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ✉️
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Verifique seu e-mail</h1>
        <p className="text-slate-600 text-sm mb-1">
          Enviamos um link de confirmação para:
        </p>
        <p className="font-medium text-slate-900 text-sm mb-4">{sentTo}</p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-left mb-6">
          <p className="text-amber-800 text-sm font-medium mb-1">⚠️ Verifique também o spam</p>
          <p className="text-amber-700 text-xs">
            O e-mail pode ter chegado na pasta de spam ou lixo eletrônico. Marque como "não é spam" para receber futuros e-mails normalmente.
          </p>
        </div>
        <p className="text-slate-500 text-xs">
          Após confirmar, volte para{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            fazer login
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Criar conta</h1>
      <p className="text-slate-500 text-sm mb-6">Comece a controlar suas finanças hoje</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="seu@email.com"
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
            Confirmar senha
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Já tem conta?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
