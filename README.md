# FinançasPessoais

App de gestão financeira pessoal — registre receitas e despesas, visualize um dashboard com resumo mensal e gráficos de categorias.

## Stack

- **Next.js 14+** (App Router) + TypeScript
- **Tailwind CSS** para estilização
- **Supabase** (PostgreSQL + Auth + RLS)
- **Recharts** para gráficos
- **Vercel** para deploy

## Configuração local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie `.env.local.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

3. Execute o schema SQL em **Supabase > SQL Editor**:

```sql
-- Cole o conteúdo de supabase/schema.sql
```

### 3. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Deploy na Vercel

1. Conecte o repositório GitHub na Vercel
2. Adicione as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Deploy automático a cada push na branch `main`

## Funcionalidades

- Autenticação via Supabase Auth (email/senha)
- Cadastro de receitas e despesas com categoria, data e descrição
- Listagem com filtros por mês, ano, tipo e categoria
- Editar e excluir transações
- Dashboard com cards de resumo (receitas, despesas, saldo)
- Gráfico de pizza com despesas por categoria
- Interface responsiva (mobile-first)
