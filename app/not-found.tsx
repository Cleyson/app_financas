import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-300 dark:text-slate-700 mb-4">404</p>
        <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Página não encontrada</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">A página que você está procurando não existe.</p>
        <Link
          href="/dashboard"
          className="inline-flex h-9 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition items-center"
        >
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  )
}
