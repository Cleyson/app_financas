export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">Rotina Financeira do R2HGC</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Controle financeiro simples e visual</p>
        </div>
        {children}
      </div>
    </div>
  )
}
