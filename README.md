# FollowLens — Frontend

Painel em Next.js 16 (App Router) com arquitetura **BFF**: o navegador só
conversa com as rotas `/api/*` deste app. As rotas e os Server Components chamam
o backend NestJS de servidor para servidor, enviando a `INTERNAL_API_KEY` e o
token do dono.

```
Navegador ──(cookie httpOnly)──▶ Next.js BFF ──(X-Internal-Api-Key + Bearer)──▶ API NestJS
```

## Estrutura

```
src/
├── app/                 rotas (App Router)
│   ├── (app)/           área autenticada: dashboard, unfollows, followers, imports
│   ├── api/             BFF: auth/*, imports/upload, imports/status, followers/filter-options
│   └── login/
├── server/              BFF — "server-only" (segredos nunca vão ao bundle do cliente)
│   ├── config/env.ts    variáveis validadas com zod
│   ├── http/            cliente do backend, erros, wrapper de rotas (CSRF por origem)
│   ├── auth/session.ts  cookie de sessão httpOnly
│   └── services/        auth, followers, imports
├── features/            módulos de domínio da UI (components, hooks, api, model)
│   ├── auth/  followers/  imports/  layout/
├── design-system/       tokens + componentes agnósticos ao domínio
└── shared/              contratos da API e utilitários puros
```

O lint impõe as camadas: `design-system` não importa `features` nem `server`, e
componentes de feature não importam `server`.

## Design system

- Os tokens semânticos ficam em `src/app/globals.css` (`--bg`, `--surface`, `--fg`, `--muted`, `--accent`, `--danger`…) e são expostos ao Tailwind v4 via `@theme`. Os componentes usam classes de intenção (`bg-surface`, `text-muted`), nunca cores cruas.
- O tema claro e o escuro seguem a preferência do sistema (`prefers-color-scheme`).
- Componentes: `Button`, `Card`, `Badge`, `StatCard`, `Avatar`, `Alert`, `Field`, `EmptyState`, `PageHeader`, `SegmentedNav`, `Pagination`, `Spinner` (exportados por `@/design-system`).

## Segurança

- A sessão fica num cookie `httpOnly` + `SameSite=Lax` (+ `Secure` em produção), inacessível a JavaScript.
- As rotas de mutação do BFF rejeitam requisições de outra origem (CSRF).
- Nenhuma variável é `NEXT_PUBLIC_`. A `INTERNAL_API_KEY` só existe no servidor.
- Headers de segurança globais em `next.config.ts` (HSTS, X-Frame-Options, etc.).
- O `proxy.ts` (antigo middleware) só faz o redirecionamento otimista. Quem autoriza de fato é o backend.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # BACKEND_URL e INTERNAL_API_KEY (a mesma do backend)
npm run dev                  # http://localhost:3000
```

## Deploy (Vercel)

1. Importe o repositório na Vercel (framework: Next.js).
2. Configure `BACKEND_URL` (URL do backend na Vercel) e `INTERNAL_API_KEY`.
3. A rota `/api/imports/upload` declara `maxDuration = 60`, porque o parse + diff do arquivo pode levar alguns segundos.

## Scripts

`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck`
