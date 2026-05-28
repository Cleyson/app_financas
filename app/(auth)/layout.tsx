export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">FinançasPessoais</span>
          </div>
          <p className="text-slate-500 text-sm">Controle financeiro simples e visual</p>
        </div>
        {children}
      </div>
    </div>
  )
}
