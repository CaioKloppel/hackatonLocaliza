---
title: Plano de implementação — protótipo BYD Dolphin com as três vertentes
date: 2026-09-30
---

# Protótipo BYD Dolphin com as três vertentes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir um protótipo estático (GitHub Pages) que reproduz a página BYD Dolphin da Localiza Assinatura e acrescenta as três vertentes da proposta (mês de teste, avaliações, telemetria), com modo "Página atual ↔ Proposta" e uma tela de assinante para a recomendação na renovação.

**Architecture:** App Vite + React + TypeScript isolado em `prototipo/`. Lógica de negócio (economia, recomendação, máscaras, validação, filtros) em funções puras em `src/lib/`, testadas com Vitest. Dados fictícios tipados em `src/data/`. UI em CSS Modules sobre tokens do design system LDS (`src/styles/tokens.css`). Duas rotas por hash (`#/` e `#/assinante`). Deploy por GitHub Actions.

**Tech Stack:** Vite 8, React 19, TypeScript ~6.0, CSS Modules, lucide-react 1.x, @fontsource/inter, Vitest 5 + jsdom + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-30-prototipo-dolphin-tres-vertentes-design.md`

## Global Constraints

- Todo o app vive em `prototipo/`. Comandos `npm` rodam dentro de `prototipo/`.
- `vite.config.ts` usa `base: '/hackatonLocaliza/'`. Caminhos de arquivos de `public/` no código passam por `asset()` (`src/lib/asset.ts`).
- **Nenhum preço absoluto da Localiza** em qualquer tela (mensalidade, aluguel). Só economia (R$ economizados ou %). Mensalidade na V3B aparece como `M` e `M + R$ 500`.
- Mês de teste = **30 dias**.
- Todos os dados são fictícios e a interface diz isso onde houver números.
- Nenhuma chamada de rede em tempo de execução (fonte Inter é self-hosted via `@fontsource/inter`).
- Textos da interface em pt-BR com acentuação correta.
- Tokens de cor, raio e tipografia vêm de `src/styles/tokens.css`; não usar hex solto em CSS de componente, exceto quando o token não existir.
- TypeScript com `erasableSyntaxOnly` (sem `enum`) e `verbatimModuleSyntax` (usar `import type` para tipos).
- Breakpoints: `sm` 672px, `md` 1200px. Sem scroll horizontal da página em 360px.
- Foco visível: `outline: 2px solid var(--c-focus)`.
- Cada task termina com `npm test` verde e commit.

## Review Focus

1. **Simulador com consumo inválido** (campo vazio, `0`, texto, `12,5` com vírgula, fora de 6–20): nunca mostrar `NaN`/`Infinity`; mostrar erro; aceitar vírgula. Teste na Task 13.
2. **Formulário com dados "quase válidos"** (nome só com espaços, e-mail sem domínio, telefone com 10 dígitos): botão de envio continua desabilitado. Testes nas Tasks 4 e 9.
3. **Links compartilhados** (`?modo=atual#/?teste=1`, `?modo=atual#/assinante`): `teste=1` força o modo proposta e marca "Mês de teste"; "Testar o Dolphin por 30 dias" também força a proposta. Testes nas Tasks 12 e 15.
4. **Documento colado com pontuação/lixo ou dígitos demais** (`123.456.789-01abc`, 20 dígitos): máscara limpa, limita a 14 e alterna CPF/CNPJ pelo tamanho. Teste na Task 4.
5. **Filtros de avaliação que zeram a lista**: mostra estado vazio com "Limpar filtros", esconde o contador e o "Ver mais"; ao limpar, volta a 3 itens. Teste na Task 14.

---

## Mapa de arquivos

```
.github/workflows/deploy.yml
prototipo/
├── package.json, package-lock.json, .gitignore
├── index.html, vite.config.ts, tsconfig.json, tsconfig.app.json, tsconfig.node.json
├── public/
│   ├── favicon.ico
│   └── assets/
│       ├── carros/  byd-dolphin.webp, byd-dolphin-mini-30kw.webp, byd-dolphin-mini-38kw.webp,
│       │            geely-ex2-pro.webp, geely-ex2-max.webp, geely-ex5-pro.webp
│       ├── marca/   logo-positivo.svg, logo-negativo.svg
│       └── decor/   linhas.svg
└── src/
    ├── main.tsx, App.tsx, App.test.tsx
    ├── styles/tokens.css, styles/global.css
    ├── test/setup.ts, test/render.tsx
    ├── lib/     asset.ts, formato.ts, texto.ts, economia.ts, recomendacao.ts, mascaras.ts,
    │            validacao.ts, filtroAvaliacoes.ts, rolagem.ts  (+ *.test.ts)
    ├── data/    dolphin.ts, relacionados.ts, avaliacoes.ts, telemetria.ts, assinante.ts (+ testes)
    ├── modo/    ModoContext.tsx (+ test)
    ├── hooks/   useHashRoute.ts (+ test)
    ├── components/
    │   ├── icons/Marcas.tsx
    │   ├── ui/      Button, Accordion, Chip, Estrelas, VertenteTag, SegmentedCards, Campos, Toast
    │   └── layout/  PrototypeBar, Header, Footer, FloatingWhatsApp
    ├── pages/ModeloPage/    ModeloPage, Breadcrumb, TitleBlock, VehicleCard, ColorPicker,
    │                        ItensDeSerie, ListaComIcones, QuoteForm, RelatedCarousel
    ├── features/mes-de-teste/  InicioContext, OpcaoInicioForm, MesDeTesteSection
    ├── features/avaliacoes/    AvaliacoesSection, ResumoNotas, FiltrosPerfil, AvaliacaoCard
    ├── features/telemetria/    DadosFrotaSection, FatoCard, SaudeBateriaChart, SimuladorEconomia
    └── pages/AssinantePage/    AssinantePage, Stepper, ConsentimentoStep, UsoStep, GraficoDiasKm,
                                RecargaStep, ResultadoStep
```

Cada componente `X.tsx` tem um `X.module.css` ao lado quando precisa de estilo.

---

### Task 1: Scaffold do app, tokens e infraestrutura de testes

**Files:**
- Create: `prototipo/package.json`, `prototipo/.gitignore`, `prototipo/index.html`, `prototipo/vite.config.ts`, `prototipo/tsconfig.json`, `prototipo/tsconfig.app.json`, `prototipo/tsconfig.node.json`
- Create: `prototipo/src/main.tsx`, `prototipo/src/App.tsx`, `prototipo/src/styles/tokens.css`, `prototipo/src/styles/global.css`, `prototipo/src/test/setup.ts`, `prototipo/src/lib/asset.ts`, `prototipo/src/lib/formato.ts`, `prototipo/src/lib/texto.ts`
- Test: `prototipo/src/lib/formato.test.ts`, `prototipo/src/lib/texto.test.ts`

**Interfaces:**
- Produces:
  - `asset(caminho: string): string` — prefixa `import.meta.env.BASE_URL`.
  - `formatarNumero(v: number): string` → `"2.000"`
  - `formatarReais(v: number): string` → `"R$ 740"`, negativo `"−R$ 740"` (sinal U+2212)
  - `formatarReaisComSinal(v: number): string` → `"+R$ 500"`, `"−R$ 740"`, `"R$ 0"`
  - `formatarReaisCentavos(v: number): string` → `"R$ 0,80"`
  - `formatarNota(v: number): string` → `"4,6"`
  - `formatarPct(v: number): string` → fração 0..1 para `"99%"` (arredonda para baixo)
  - `formatarData(iso: string): string` → `"2026-09-12"` para `"12/09/2026"`
  - `normalizar(t: string): string` — sem acentos, minúsculas.

- [ ] **Step 1: Criar `prototipo/package.json`**

```json
{
  "name": "prototipo-dolphin-localiza",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@fontsource/inter": "^5.3.0",
    "lucide-react": "^1.49.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^14.6.7",
    "@types/node": "^24.13.3",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "jsdom": "^30.1.1",
    "typescript": "~6.0.2",
    "vite": "^8.3.0",
    "vitest": "^5.0.3"
  }
}
```

- [ ] **Step 2: Criar configs**

`prototipo/.gitignore`:
```
node_modules
dist
*.local
.vite
```

`prototipo/tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`prototipo/tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

`prototipo/tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,
    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

`prototipo/vite.config.ts`:
```ts
/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/hackatonLocaliza/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

`prototipo/index.html`:
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Protótipo da página do BYD Dolphin por assinatura com mês de teste, avaliações de assinantes e telemetria."
    />
    <title>BYD Dolphin por assinatura · Protótipo Localiza Assinatura</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Instalar dependências**

Run (em `prototipo/`): `npm install`
Expected: termina sem erro de peer dependency; cria `package-lock.json`.

- [ ] **Step 4: Criar tokens e estilos globais**

`prototipo/src/styles/tokens.css`:
```css
:root {
  --font: 'Inter', Arial, Helvetica, sans-serif;

  --c-primary: #78de1f;
  --c-primary-contrast: #004521;
  --c-primary-lower: #cefdaf;
  --c-primary-low: #9aef65;
  --c-secondary: #018444;
  --c-secondary-dark: #024a32;
  --c-focus: #005c3a;

  --c-bg: #f2f2f2;
  --c-surface: #ffffff;
  --c-text: #383838;
  --c-text-high: #262626;
  --c-text-low: #5e5e5e;
  --c-border: #919191;
  --c-border-low: #d6d6d6;
  --c-paper-border: #e6e6e6;
  --c-icon: #6e6e6e;
  --c-inverse: #262626;

  --c-disabled-bg: #c2c2c2;
  --c-disabled-text: #919191;
  --c-critical: #d92020;
  --c-critical-lower: #ffe4e4;
  --c-warning-high: #f0c000;
  --c-warning-lower: #fdf3d3;
  --c-warning-contrast: #473600;
  --c-info-lower: #d8effd;
  --c-info-contrast: #09547c;
  --c-success-lower: #d1f5dc;

  --r-sharp: 4px;
  --r-main: 8px;
  --r-soft: 16px;
  --r-card: 24px;
  --r-pill: 400px;

  --shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.15);
  --shadow-high: 0px 4px 16px 2px rgba(0, 0, 0, 0.15);

  --header-h: 88px;
  --bar-h: 40px;
}
```

`prototipo/src/styles/global.css`:
```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: var(--font);
  font-size: 16px;
  line-height: 150%;
  color: var(--c-text);
  background: var(--c-bg);
  overflow-x: hidden;
}

h1, h2, h3, h4, p, ul, ol, dl, dd, figure {
  margin: 0;
}

ul, ol {
  padding: 0;
  list-style: none;
}

img, svg {
  display: block;
  max-width: 100%;
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
}

a {
  color: inherit;
}

:focus-visible {
  outline: 2px solid var(--c-focus);
  outline-offset: 2px;
}

[id] {
  scroll-margin-top: calc(var(--header-h) + 16px);
}

.visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5: Criar setup de teste**

`prototipo/src/test/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

Element.prototype.scrollIntoView = vi.fn()
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})
```

- [ ] **Step 6: Escrever os testes de formatação (falhando)**

`prototipo/src/lib/formato.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import {
  formatarData,
  formatarNota,
  formatarNumero,
  formatarPct,
  formatarReais,
  formatarReaisCentavos,
  formatarReaisComSinal,
} from './formato'

describe('formato', () => {
  it('formata números inteiros com separador de milhar', () => {
    expect(formatarNumero(2000)).toBe('2.000')
    expect(formatarNumero(739.6)).toBe('740')
  })

  it('formata reais sem centavos', () => {
    expect(formatarReais(740)).toBe('R$ 740')
    expect(formatarReais(8880)).toBe('R$ 8.880')
    expect(formatarReais(-160)).toBe('−R$ 160')
  })

  it('formata reais com sinal', () => {
    expect(formatarReaisComSinal(-740)).toBe('−R$ 740')
    expect(formatarReaisComSinal(500)).toBe('+R$ 500')
    expect(formatarReaisComSinal(0)).toBe('R$ 0')
  })

  it('formata reais com centavos', () => {
    expect(formatarReaisCentavos(0.8)).toBe('R$ 0,80')
    expect(formatarReaisCentavos(6)).toBe('R$ 6,00')
  })

  it('formata nota com uma casa e vírgula', () => {
    expect(formatarNota(4.6)).toBe('4,6')
    expect(formatarNota(5)).toBe('5,0')
  })

  it('formata porcentagem arredondando para baixo', () => {
    expect(formatarPct(362 / 365)).toBe('99%')
    expect(formatarPct(336 / 365)).toBe('92%')
    expect(formatarPct(0.95)).toBe('95%')
  })

  it('formata data ISO sem depender de fuso', () => {
    expect(formatarData('2026-09-12')).toBe('12/09/2026')
  })
})
```

`prototipo/src/lib/texto.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { normalizar } from './texto'

describe('normalizar', () => {
  it('remove acentos e deixa minúsculo', () => {
    expect(normalizar('Autonomia ELÉTRICA')).toBe('autonomia eletrica')
    expect(normalizar('Câmbio')).toBe('cambio')
  })
})
```

- [ ] **Step 7: Rodar para ver falhar**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./formato"` e `"./texto"`.

- [ ] **Step 8: Implementar**

`prototipo/src/lib/formato.ts`:
```ts
const MENOS = '−'

export function formatarNumero(v: number): string {
  return Math.round(v).toLocaleString('pt-BR')
}

export function formatarReais(v: number): string {
  const r = Math.round(v)
  return r < 0 ? `${MENOS}R$ ${formatarNumero(-r)}` : `R$ ${formatarNumero(r)}`
}

export function formatarReaisComSinal(v: number): string {
  const r = Math.round(v)
  if (r === 0) return 'R$ 0'
  return `${r < 0 ? MENOS : '+'}R$ ${formatarNumero(Math.abs(r))}`
}

export function formatarReaisCentavos(v: number): string {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatarNota(v: number): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function formatarPct(fracao: number): string {
  return `${Math.floor(fracao * 100 + 1e-9)}%`
}

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}
```

`prototipo/src/lib/texto.ts`:
```ts
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}
```

`prototipo/src/lib/asset.ts`:
```ts
export function asset(caminho: string): string {
  return `${import.meta.env.BASE_URL}${caminho}`
}
```

- [ ] **Step 9: App mínimo**

`prototipo/src/App.tsx`:
```tsx
export function App() {
  return <main>Protótipo Localiza Assinatura</main>
}
```

`prototipo/src/main.tsx`:
```tsx
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/tokens.css'
import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 10: Rodar testes e build**

Run: `npm test`
Expected: PASS (2 arquivos, 8 testes).

Run: `npm run build`
Expected: `tsc -b` sem erros e `dist/` gerado.

- [ ] **Step 11: Commit**

```bash
git add prototipo/
git commit -m "feat(prototipo): scaffold Vite + React + TS com tokens LDS e formatação"
```

---

### Task 2: Cálculo de economia (`lib/economia.ts`)

**Files:**
- Create: `prototipo/src/lib/economia.ts`
- Test: `prototipo/src/lib/economia.test.ts`

**Interfaces:**
- Produces:
  - `arredondarCentavos(v: number): number`
  - `custoKmCombustao(precoLitro: number, kmPorLitro: number): number` — R$/km arredondado a centavos; lança `RangeError` se `kmPorLitro <= 0`
  - `custoKmEletrico(tarifaKWh: number, kmPorKWh: number): number` — idem
  - `gastoEnergiaMensal(kmMes: number, custoKm: number): number` — reais inteiros
  - `economiaEnergiaMensal(kmMes: number, custoKmComb: number, custoKmElet: number): number` — reais inteiros
  - `economiaLiquidaMensal(kmMes: number, custoKmComb: number, custoKmElet: number, deltaMensalidade: number): number`

- [ ] **Step 1: Escrever o teste (falhando)**

`prototipo/src/lib/economia.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import {
  arredondarCentavos,
  custoKmCombustao,
  custoKmEletrico,
  economiaEnergiaMensal,
  economiaLiquidaMensal,
  gastoEnergiaMensal,
} from './economia'

describe('economia', () => {
  it('arredonda a centavos', () => {
    expect(arredondarCentavos(0.8 / 6)).toBe(0.13)
    expect(arredondarCentavos(1 / 6)).toBe(0.17)
    expect(arredondarCentavos(2 / 6)).toBe(0.33)
  })

  it('reproduz o exemplo do .md: R$ 240 de economia líquida', () => {
    const comb = custoKmCombustao(6, 12)
    const elet = custoKmEletrico(0.8, 6)
    expect(comb).toBe(0.5)
    expect(elet).toBe(0.13)
    expect(gastoEnergiaMensal(2000, comb)).toBe(1000)
    expect(gastoEnergiaMensal(2000, elet)).toBe(260)
    expect(economiaEnergiaMensal(2000, comb, elet)).toBe(740)
    expect(economiaLiquidaMensal(2000, comb, elet, 500)).toBe(240)
  })

  it('economia líquida fica negativa com recarga pública', () => {
    const comb = custoKmCombustao(6, 12)
    const elet = custoKmEletrico(2, 6)
    expect(economiaLiquidaMensal(2000, comb, elet, 500)).toBe(-160)
  })

  it('rejeita rendimento zero, negativo ou NaN', () => {
    expect(() => custoKmCombustao(6, 0)).toThrow(RangeError)
    expect(() => custoKmEletrico(0.8, -1)).toThrow(RangeError)
    expect(() => custoKmCombustao(6, Number.NaN)).toThrow(RangeError)
  })
})
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/lib/economia.test.ts`
Expected: FAIL — `Failed to resolve import "./economia"`.

- [ ] **Step 3: Implementar**

`prototipo/src/lib/economia.ts`:
```ts
export function arredondarCentavos(v: number): number {
  return Math.round((v + Number.EPSILON) * 100) / 100
}

function custoPorKm(preco: number, rendimento: number): number {
  if (!(rendimento > 0)) throw new RangeError('O rendimento (km por unidade) deve ser positivo')
  return arredondarCentavos(preco / rendimento)
}

/** R$ por km rodado com combustível, arredondado a centavos (como no .md). */
export function custoKmCombustao(precoLitro: number, kmPorLitro: number): number {
  return custoPorKm(precoLitro, kmPorLitro)
}

/** R$ por km rodado com energia elétrica, arredondado a centavos (como no .md). */
export function custoKmEletrico(tarifaKWh: number, kmPorKWh: number): number {
  return custoPorKm(tarifaKWh, kmPorKWh)
}

export function gastoEnergiaMensal(kmMes: number, custoKm: number): number {
  return Math.round(kmMes * custoKm)
}

export function economiaEnergiaMensal(kmMes: number, custoKmComb: number, custoKmElet: number): number {
  return Math.round(kmMes * (custoKmComb - custoKmElet))
}

export function economiaLiquidaMensal(
  kmMes: number,
  custoKmComb: number,
  custoKmElet: number,
  deltaMensalidade: number,
): number {
  return economiaEnergiaMensal(kmMes, custoKmComb, custoKmElet) - deltaMensalidade
}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `npm test -- src/lib/economia.test.ts`
Expected: PASS (4 testes).

- [ ] **Step 5: Commit**

```bash
git add prototipo/src/lib/economia.ts prototipo/src/lib/economia.test.ts
git commit -m "feat(prototipo): cálculo de custo por km e economia líquida"
```

---

### Task 3: Motor de recomendação e dados de telemetria (V3)

**Files:**
- Create: `prototipo/src/lib/recomendacao.ts`, `prototipo/src/data/telemetria.ts`, `prototipo/src/data/assinante.ts`
- Test: `prototipo/src/lib/recomendacao.test.ts`, `prototipo/src/data/telemetria.test.ts`

**Interfaces:**
- Consumes: `custoKmCombustao`, `custoKmEletrico`, `economiaLiquidaMensal` (Task 2); `formatarPct` (Task 1).
- Produces (`lib/recomendacao.ts`):
  ```ts
  type PerfilRecarga = 'casa' | 'trabalho' | 'rua'
  type Categoria = 1 | 2 | 3
  type Tarifas = Record<PerfilRecarga, number>
  interface ModeloEletrico { id: string; nome: string; categoria: Categoria; autonomiaRealKm: number; kmPorKWh: number; deltaMensalidade: number }
  interface Cliente { kmMes: number; kmDiarios: number[]; kmPorLitro: number; precoGasolina: number; categoria: Categoria }
  interface AvaliacaoModelo { modelo: ModeloEletrico; cobertura: number; custoKmEletrico: number; economiaLiquida: number; motivosExclusao: string[] }
  interface ResultadoRecomendacao { recomendado: AvaliacaoModelo | null; avaliados: AvaliacaoModelo[]; custoKmCombustao: number }
  const COBERTURA_MINIMA = 0.95
  const MARGEM_SEGURANCA = 100
  function cobertura(kmDiarios: number[], autonomiaKm: number): number
  function recomendar(cliente: Cliente, perfil: PerfilRecarga, modelos: ModeloEletrico[], tarifas: Tarifas, margem?: number): ResultadoRecomendacao
  ```
- Produces (`data/telemetria.ts`): `tarifas: Tarifas`, `PRECO_GASOLINA = 6`, `EFICIENCIA_DOLPHIN = 6`, `modelosEletricos: ModeloEletrico[]`, `imagemModelo: Record<string, string>`, `fatosFrota: FatosFrota`, tipos `PontoSaude { meses; pct }` e `FatosFrota`.
- Produces (`data/assinante.ts`): `kmDiarios: number[]`, `assinante: { nome; diasParaFimContrato; carroAtual; combustivel }`, `clienteTelemetria: Cliente`.

- [ ] **Step 1: Escrever os dados de telemetria e do assinante**

`prototipo/src/data/telemetria.ts`:
```ts
import type { ModeloEletrico, Tarifas } from '../lib/recomendacao'

/** Valores ilustrativos do protótipo. Trabalho e rua são estimativas. */
export const tarifas: Tarifas = { casa: 0.8, trabalho: 1.0, rua: 2.0 }
export const PRECO_GASOLINA = 6
export const EFICIENCIA_DOLPHIN = 6

export const modelosEletricos: ModeloEletrico[] = [
  { id: 'dolphin-mini', nome: 'BYD Dolphin Mini', categoria: 1, autonomiaRealKm: 190, kmPorKWh: 7, deltaMensalidade: 100 },
  { id: 'geely-ex2', nome: 'Geely EX2', categoria: 1, autonomiaRealKm: 230, kmPorKWh: 6.5, deltaMensalidade: 300 },
  { id: 'dolphin', nome: 'BYD Dolphin', categoria: 2, autonomiaRealKm: 290, kmPorKWh: 6, deltaMensalidade: 500 },
  { id: 'geely-ex5', nome: 'Geely EX5', categoria: 3, autonomiaRealKm: 380, kmPorKWh: 5, deltaMensalidade: 1200 },
]

export const imagemModelo: Record<string, string> = {
  'dolphin-mini': 'assets/carros/byd-dolphin-mini-38kw.webp',
  'geely-ex2': 'assets/carros/geely-ex2-pro.webp',
  dolphin: 'assets/carros/byd-dolphin.webp',
  'geely-ex5': 'assets/carros/geely-ex5-pro.webp',
}

export interface PontoSaude {
  meses: number
  pct: number
}

export interface FatosFrota {
  baseCarros: number
  periodo: string
  autonomiaCidadeKm: number
  autonomiaEstradaKm: number
  saudeBateria: PontoSaude[]
  reducaoCustoKmPct: number
  diasAbaixoAutonomiaPct: number
  recargasPorSemana: number
}

export const fatosFrota: FatosFrota = {
  baseCarros: 412,
  periodo: 'jan. a ago. de 2026',
  autonomiaCidadeKm: 305,
  autonomiaEstradaKm: 245,
  saudeBateria: [
    { meses: 0, pct: 100 },
    { meses: 6, pct: 99 },
    { meses: 12, pct: 98 },
    { meses: 18, pct: 97 },
    { meses: 24, pct: 96 },
  ],
  reducaoCustoKmPct: 74,
  diasAbaixoAutonomiaPct: 97,
  recargasPorSemana: 2,
}
```

`prototipo/src/data/assinante.ts`:
```ts
import type { Cliente } from '../lib/recomendacao'
import { PRECO_GASOLINA } from './telemetria'

/** Semana típica de deslocamentos (média 50 km/dia). */
const SEMANA_TIPICA = [48, 52, 55, 50, 60, 40, 45]

/** 29 dias longos no ano: 3 acima de 290 km e 26 entre 200 e 280 km. */
const DIAS_LONGOS = [
  300, 200, 210, 220, 230, 240, 250, 260, 270, 280,
  305, 215, 225, 235, 245, 255, 265, 275, 205, 212,
  310, 228, 236, 244, 252, 268, 276, 218, 262,
]

function construirKmDiarios(): number[] {
  const dias: number[] = []
  let base = 0
  let longo = 0
  for (let i = 0; i < 365; i++) {
    if (longo < DIAS_LONGOS.length && i % 12 === 5) {
      dias.push(DIAS_LONGOS[longo++])
    } else {
      dias.push(SEMANA_TIPICA[base++ % SEMANA_TIPICA.length])
    }
  }
  return dias
}

export const kmDiarios: number[] = construirKmDiarios()

export const assinante = {
  nome: 'Mariana',
  diasParaFimContrato: 87,
  carroAtual: 'Hatch 1.0 Turbo',
  combustivel: 'combustão',
}

export const clienteTelemetria: Cliente = {
  kmMes: 2000,
  kmDiarios,
  kmPorLitro: 12,
  precoGasolina: PRECO_GASOLINA,
  categoria: 2,
}
```

- [ ] **Step 2: Escrever os testes (falhando)**

`prototipo/src/data/telemetria.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { custoKmCombustao, custoKmEletrico } from '../lib/economia'
import { kmDiarios } from './assinante'
import { EFICIENCIA_DOLPHIN, fatosFrota, PRECO_GASOLINA, tarifas } from './telemetria'

describe('dados de telemetria', () => {
  it('km diários têm as propriedades da spec', () => {
    expect(kmDiarios).toHaveLength(365)
    expect(Math.max(...kmDiarios)).toBe(310)
    expect(kmDiarios.filter((km) => km > 290)).toHaveLength(3)
    expect(kmDiarios.filter((km) => km > 190)).toHaveLength(29)
    const soma = kmDiarios.reduce((a, b) => a + b, 0)
    expect(soma).toBeGreaterThan(23900)
    expect(soma).toBeLessThan(24100)
  })

  it('redução de custo por km é coerente com as premissas', () => {
    const comb = custoKmCombustao(PRECO_GASOLINA, 12)
    const elet = custoKmEletrico(tarifas.casa, EFICIENCIA_DOLPHIN)
    expect(Math.round((1 - elet / comb) * 100)).toBe(fatosFrota.reducaoCustoKmPct)
  })
})
```

`prototipo/src/lib/recomendacao.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { clienteTelemetria } from '../data/assinante'
import { modelosEletricos, tarifas } from '../data/telemetria'
import { cobertura, recomendar, type PerfilRecarga } from './recomendacao'

function avaliacaoDe(id: string, perfil: PerfilRecarga, margem?: number) {
  const r = recomendar(clienteTelemetria, perfil, modelosEletricos, tarifas, margem)
  return r.avaliados.find((a) => a.modelo.id === id)!
}

describe('cobertura', () => {
  it('é a fração de dias dentro da autonomia', () => {
    expect(cobertura([100, 200, 300, 400], 250)).toBe(0.5)
    expect(cobertura([], 250)).toBe(0)
  })

  it('Dolphin cobre ~99% e Mini ~92% dos dias do cliente', () => {
    expect(cobertura(clienteTelemetria.kmDiarios, 290)).toBeGreaterThanOrEqual(0.99)
    expect(cobertura(clienteTelemetria.kmDiarios, 190)).toBeCloseTo(336 / 365, 5)
  })
})

describe('recomendar', () => {
  it('recarga em casa: recomenda o Dolphin com R$ 240', () => {
    const r = recomendar(clienteTelemetria, 'casa', modelosEletricos, tarifas)
    expect(r.recomendado?.modelo.id).toBe('dolphin')
    expect(r.recomendado?.economiaLiquida).toBe(240)
    expect(r.custoKmCombustao).toBe(0.5)
    expect(r.avaliados).toHaveLength(4)
  })

  it('recarga no trabalho: recomenda o Dolphin com R$ 160', () => {
    const r = recomendar(clienteTelemetria, 'trabalho', modelosEletricos, tarifas)
    expect(r.recomendado?.modelo.id).toBe('dolphin')
    expect(r.recomendado?.economiaLiquida).toBe(160)
  })

  it('só recarga na rua: nenhuma recomendação', () => {
    const r = recomendar(clienteTelemetria, 'rua', modelosEletricos, tarifas)
    expect(r.recomendado).toBeNull()
    expect(avaliacaoDe('dolphin', 'rua').motivosExclusao).toEqual([
      'A economia com energia não cobre a diferença de mensalidade',
    ])
  })

  it('Dolphin Mini é excluído por cobertura e por categoria', () => {
    expect(avaliacaoDe('dolphin-mini', 'casa').motivosExclusao).toEqual([
      'Cobre só 92% dos seus dias (mínimo 95%)',
      'Categoria inferior ao seu carro atual',
    ])
  })

  it('Geely EX5 é excluído por economia negativa', () => {
    const ex5 = avaliacaoDe('geely-ex5', 'casa')
    expect(ex5.cobertura).toBe(1)
    expect(ex5.economiaLiquida).toBe(-520)
    expect(ex5.motivosExclusao).toEqual(['A economia com energia não cobre a diferença de mensalidade'])
  })

  it('economia positiva abaixo da margem exclui o modelo', () => {
    expect(avaliacaoDe('dolphin', 'trabalho').motivosExclusao).toEqual([])
    expect(avaliacaoDe('dolphin', 'trabalho', 200).motivosExclusao).toEqual([
      'Economia abaixo da margem de segurança',
    ])
  })

  it('entre elegíveis, escolhe a maior economia', () => {
    const outro = { ...modelosEletricos[2], id: 'dolphin-b', nome: 'Dolphin B', deltaMensalidade: 400 }
    const r = recomendar(clienteTelemetria, 'casa', [...modelosEletricos, outro], tarifas)
    expect(r.recomendado?.modelo.id).toBe('dolphin-b')
    expect(r.recomendado?.economiaLiquida).toBe(340)
  })
})
```

- [ ] **Step 3: Rodar para ver falhar**

Run: `npm test -- src/lib/recomendacao.test.ts src/data/telemetria.test.ts`
Expected: FAIL — `Failed to resolve import "../lib/recomendacao"` / `"./recomendacao"`.

- [ ] **Step 4: Implementar**

`prototipo/src/lib/recomendacao.ts`:
```ts
import { custoKmCombustao, custoKmEletrico, economiaLiquidaMensal } from './economia'
import { formatarPct } from './formato'

export type PerfilRecarga = 'casa' | 'trabalho' | 'rua'
/** 1 = hatch compacto, 2 = hatch, 3 = SUV */
export type Categoria = 1 | 2 | 3
export type Tarifas = Record<PerfilRecarga, number>

export interface ModeloEletrico {
  id: string
  nome: string
  categoria: Categoria
  autonomiaRealKm: number
  kmPorKWh: number
  deltaMensalidade: number
}

export interface Cliente {
  kmMes: number
  kmDiarios: number[]
  kmPorLitro: number
  precoGasolina: number
  categoria: Categoria
}

export interface AvaliacaoModelo {
  modelo: ModeloEletrico
  cobertura: number
  custoKmEletrico: number
  economiaLiquida: number
  motivosExclusao: string[]
}

export interface ResultadoRecomendacao {
  recomendado: AvaliacaoModelo | null
  avaliados: AvaliacaoModelo[]
  custoKmCombustao: number
}

export const COBERTURA_MINIMA = 0.95
export const MARGEM_SEGURANCA = 100

export function cobertura(kmDiarios: number[], autonomiaKm: number): number {
  if (kmDiarios.length === 0) return 0
  return kmDiarios.filter((km) => km <= autonomiaKm).length / kmDiarios.length
}

export function recomendar(
  cliente: Cliente,
  perfil: PerfilRecarga,
  modelos: ModeloEletrico[],
  tarifas: Tarifas,
  margem: number = MARGEM_SEGURANCA,
): ResultadoRecomendacao {
  const custoComb = custoKmCombustao(cliente.precoGasolina, cliente.kmPorLitro)

  const avaliados = modelos.map((modelo): AvaliacaoModelo => {
    const cob = cobertura(cliente.kmDiarios, modelo.autonomiaRealKm)
    const custoElet = custoKmEletrico(tarifas[perfil], modelo.kmPorKWh)
    const economia = economiaLiquidaMensal(cliente.kmMes, custoComb, custoElet, modelo.deltaMensalidade)

    const motivos: string[] = []
    if (cob < COBERTURA_MINIMA) motivos.push(`Cobre só ${formatarPct(cob)} dos seus dias (mínimo 95%)`)
    if (modelo.categoria < cliente.categoria) motivos.push('Categoria inferior ao seu carro atual')
    if (economia <= 0) motivos.push('A economia com energia não cobre a diferença de mensalidade')
    else if (economia < margem) motivos.push('Economia abaixo da margem de segurança')

    return { modelo, cobertura: cob, custoKmEletrico: custoElet, economiaLiquida: economia, motivosExclusao: motivos }
  })

  const elegiveis = avaliados
    .filter((a) => a.motivosExclusao.length === 0)
    .sort((a, b) => b.economiaLiquida - a.economiaLiquida)

  return { recomendado: elegiveis[0] ?? null, avaliados, custoKmCombustao: custoComb }
}
```

- [ ] **Step 5: Rodar para ver passar**

Run: `npm test`
Expected: PASS (todos os arquivos).

- [ ] **Step 6: Commit**

```bash
git add prototipo/src/lib/recomendacao.ts prototipo/src/lib/recomendacao.test.ts prototipo/src/data/
git commit -m "feat(prototipo): motor de recomendação da V3B e dados fictícios de telemetria"
```

---

### Task 4: Máscaras e validação do formulário

**Files:**
- Create: `prototipo/src/lib/mascaras.ts`, `prototipo/src/lib/validacao.ts`
- Test: `prototipo/src/lib/mascaras.test.ts`, `prototipo/src/lib/validacao.test.ts`

**Interfaces:**
- Produces (`mascaras.ts`): `somenteDigitos(v: string): string`, `mascaraTelefone(v: string): string`, `mascaraDocumento(v: string): string`, `mascaraCep(v: string): string`.
- Produces (`validacao.ts`):
  ```ts
  interface DadosOrcamento { periodo: string; franquia: string; nome: string; email: string; telefone: string; documento: string; cep: string; whatsapp: boolean; marketing: boolean }
  type CampoValidado = 'nome' | 'email' | 'telefone' | 'documento' | 'cep'
  type ErrosOrcamento = Partial<Record<CampoValidado, string>>
  function validarOrcamento(d: DadosOrcamento): ErrosOrcamento
  ```

- [ ] **Step 1: Escrever os testes (falhando)**

`prototipo/src/lib/mascaras.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { mascaraCep, mascaraDocumento, mascaraTelefone, somenteDigitos } from './mascaras'

describe('máscaras', () => {
  it('extrai só dígitos', () => {
    expect(somenteDigitos('(41) 9a9-9')).toBe('41999')
  })

  it('telefone', () => {
    expect(mascaraTelefone('')).toBe('')
    expect(mascaraTelefone('4')).toBe('(4')
    expect(mascaraTelefone('41')).toBe('(41')
    expect(mascaraTelefone('419')).toBe('(41) 9')
    expect(mascaraTelefone('41 9999')).toBe('(41) 9999')
    expect(mascaraTelefone('41999998888')).toBe('(41) 99999-8888')
    expect(mascaraTelefone('419999988889999')).toBe('(41) 99999-8888')
    expect(mascaraTelefone('abc')).toBe('')
  })

  it('CPF até 11 dígitos', () => {
    expect(mascaraDocumento('123')).toBe('123')
    expect(mascaraDocumento('1234')).toBe('123.4')
    expect(mascaraDocumento('12345678901')).toBe('123.456.789-01')
    expect(mascaraDocumento('123.456.789-01abc')).toBe('123.456.789-01')
  })

  it('CNPJ de 12 a 14 dígitos e limite de 14', () => {
    expect(mascaraDocumento('123456789012')).toBe('12.345.678/9012')
    expect(mascaraDocumento('12345678000199')).toBe('12.345.678/0001-99')
    expect(mascaraDocumento('12345678000199123456')).toBe('12.345.678/0001-99')
  })

  it('CEP', () => {
    expect(mascaraCep('800')).toBe('800')
    expect(mascaraCep('80000000')).toBe('80000-000')
    expect(mascaraCep('80000-0001234')).toBe('80000-000')
  })
})
```

`prototipo/src/lib/validacao.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { validarOrcamento, type DadosOrcamento } from './validacao'

const valido: DadosOrcamento = {
  periodo: '48 Meses',
  franquia: '500 Km',
  nome: 'Ana',
  email: 'ana@exemplo.com',
  telefone: '(41) 99999-8888',
  documento: '123.456.789-01',
  cep: '80000-000',
  whatsapp: false,
  marketing: false,
}

describe('validarOrcamento', () => {
  it('aceita dados válidos (CPF ou CNPJ)', () => {
    expect(validarOrcamento(valido)).toEqual({})
    expect(validarOrcamento({ ...valido, documento: '12.345.678/0001-99' })).toEqual({})
  })

  it('rejeita nome só com espaços ou curto', () => {
    expect(validarOrcamento({ ...valido, nome: '   ' }).nome).toBeDefined()
    expect(validarOrcamento({ ...valido, nome: 'A' }).nome).toBeDefined()
  })

  it('rejeita e-mail sem domínio', () => {
    expect(validarOrcamento({ ...valido, email: 'ana@' }).email).toBeDefined()
    expect(validarOrcamento({ ...valido, email: 'ana@exemplo' }).email).toBeDefined()
  })

  it('rejeita telefone com 10 dígitos', () => {
    expect(validarOrcamento({ ...valido, telefone: '(41) 9999-888' }).telefone).toBeDefined()
  })

  it('rejeita documento com 12 dígitos e CEP incompleto', () => {
    const erros = validarOrcamento({ ...valido, documento: '12.345.678/9012', cep: '8000' })
    expect(erros.documento).toBeDefined()
    expect(erros.cep).toBeDefined()
  })
})
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/lib/mascaras.test.ts src/lib/validacao.test.ts`
Expected: FAIL — imports não resolvidos.

- [ ] **Step 3: Implementar**

`prototipo/src/lib/mascaras.ts`:
```ts
export function somenteDigitos(v: string): string {
  return v.replace(/\D/g, '')
}

/** Aplica um padrão em que `9` é um dígito. Para quando os dígitos acabam. */
function aplicarPadrao(digitos: string, padrao: string): string {
  let saida = ''
  let i = 0
  for (const ch of padrao) {
    if (i >= digitos.length) break
    if (ch === '9') saida += digitos[i++]
    else saida += ch
  }
  return saida
}

export function mascaraTelefone(v: string): string {
  return aplicarPadrao(somenteDigitos(v).slice(0, 11), '(99) 99999-9999')
}

export function mascaraDocumento(v: string): string {
  const d = somenteDigitos(v).slice(0, 14)
  return d.length <= 11 ? aplicarPadrao(d, '999.999.999-99') : aplicarPadrao(d, '99.999.999/9999-99')
}

export function mascaraCep(v: string): string {
  return aplicarPadrao(somenteDigitos(v).slice(0, 8), '99999-999')
}
```

`prototipo/src/lib/validacao.ts`:
```ts
import { somenteDigitos } from './mascaras'

export interface DadosOrcamento {
  periodo: string
  franquia: string
  nome: string
  email: string
  telefone: string
  documento: string
  cep: string
  whatsapp: boolean
  marketing: boolean
}

export type CampoValidado = 'nome' | 'email' | 'telefone' | 'documento' | 'cep'
export type ErrosOrcamento = Partial<Record<CampoValidado, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarOrcamento(d: DadosOrcamento): ErrosOrcamento {
  const erros: ErrosOrcamento = {}
  if (d.nome.trim().length < 2) erros.nome = 'Digite o seu nome.'
  if (!EMAIL.test(d.email.trim())) erros.email = 'Digite um e-mail válido.'
  if (somenteDigitos(d.telefone).length !== 11) erros.telefone = 'Digite o telefone com DDD (11 dígitos).'
  const doc = somenteDigitos(d.documento).length
  if (doc !== 11 && doc !== 14) erros.documento = 'Digite um CPF (11) ou CNPJ (14 dígitos).'
  if (somenteDigitos(d.cep).length !== 8) erros.cep = 'Digite um CEP com 8 dígitos.'
  return erros
}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `npm test -- src/lib/mascaras.test.ts src/lib/validacao.test.ts`
Expected: PASS (10 testes).

- [ ] **Step 5: Commit**

```bash
git add prototipo/src/lib/mascaras.ts prototipo/src/lib/mascaras.test.ts prototipo/src/lib/validacao.ts prototipo/src/lib/validacao.test.ts
git commit -m "feat(prototipo): máscaras de telefone, CPF/CNPJ e CEP e validação do orçamento"
```

---

### Task 5: Dados e filtro das avaliações (V2)

**Files:**
- Create: `prototipo/src/lib/filtroAvaliacoes.ts`, `prototipo/src/data/avaliacoes.ts`
- Test: `prototipo/src/lib/filtroAvaliacoes.test.ts`, `prototipo/src/data/avaliacoes.test.ts`

**Interfaces:**
- Produces (`lib/filtroAvaliacoes.ts`):
  ```ts
  type Uso = 'cidade' | 'estrada'
  type LocalRecarga = 'casa' | 'trabalho' | 'rua'
  type TipoAvaliador = 'assinante' | 'teste' | 'aluguel'
  interface Avaliacao { id: string; nome: string; cidade: string; tipo: TipoAvaliador; uso: Uso; recarga: LocalRecarga; tempo: string; nota: number; data: string; texto: string; resposta?: string }
  interface FiltrosAvaliacao { uso: Uso[]; recarga: LocalRecarga[]; tipo: TipoAvaliador[] }
  const FILTROS_VAZIOS: FiltrosAvaliacao
  function filtrarAvaliacoes(lista: Avaliacao[], f: FiltrosAvaliacao): Avaliacao[]
  function ordenarRecentes(lista: Avaliacao[]): Avaliacao[]
  function alternarFiltro(f: FiltrosAvaliacao, grupo: keyof FiltrosAvaliacao, valor: string): FiltrosAvaliacao
  function temFiltroAtivo(f: FiltrosAvaliacao): boolean
  ```
- Produces (`data/avaliacoes.ts`): `avaliacoes: Avaliacao[]` (10 itens), `resumoAvaliacoes: ResumoAvaliacoes`, tipo `ResumoAvaliacoes { media: number; total: number; distribuicao: { estrelas: number; qtd: number }[]; atributos: { rotulo: string; nota: number }[] }`.

- [ ] **Step 1: Escrever os dados**

`prototipo/src/data/avaliacoes.ts`:
```ts
import type { Avaliacao } from '../lib/filtroAvaliacoes'

export interface ResumoAvaliacoes {
  media: number
  total: number
  distribuicao: { estrelas: number; qtd: number }[]
  atributos: { rotulo: string; nota: number }[]
}

export const resumoAvaliacoes: ResumoAvaliacoes = {
  media: 4.6,
  total: 128,
  distribuicao: [
    { estrelas: 5, qtd: 95 },
    { estrelas: 4, qtd: 22 },
    { estrelas: 3, qtd: 6 },
    { estrelas: 2, qtd: 3 },
    { estrelas: 1, qtd: 2 },
  ],
  atributos: [
    { rotulo: 'Autonomia real', nota: 4.5 },
    { rotulo: 'Facilidade de recarga', nota: 4.1 },
    { rotulo: 'Conforto', nota: 4.7 },
    { rotulo: 'Economia no dia a dia', nota: 4.8 },
    { rotulo: 'Atendimento Localiza', nota: 4.6 },
  ],
}

export const avaliacoes: Avaliacao[] = [
  {
    id: 'a1', nome: 'Rafael', cidade: 'Curitiba (PR)', tipo: 'assinante', uso: 'cidade', recarga: 'casa',
    tempo: '8 meses de assinatura', nota: 5, data: '2026-09-12',
    texto: 'Carrego na garagem à noite e nunca mais pensei em posto. No dia a dia de cidade a bateria sobra: raramente uso mais de 40% da carga.',
  },
  {
    id: 'a2', nome: 'Juliana', cidade: 'São Paulo (SP)', tipo: 'assinante', uso: 'estrada', recarga: 'trabalho',
    tempo: '1 ano de assinatura', nota: 4, data: '2026-09-03',
    texto: 'Faço São Paulo–Campinas duas vezes por semana e chego com folga. Tirei uma estrela porque o carregador do prédio do trabalho vive ocupado.',
  },
  {
    id: 'a3', nome: 'Carlos', cidade: 'Belo Horizonte (MG)', tipo: 'assinante', uso: 'cidade', recarga: 'rua',
    tempo: '5 meses de assinatura', nota: 3, data: '2026-08-28',
    texto: 'O carro é ótimo, mas recarregar só na rua cansa: já esperei 40 minutos por um carregador livre no shopping.',
    resposta: 'Carlos, obrigado pelo relato. Enviamos pelo app o mapa de eletropostos com disponibilidade em tempo real e agendamos uma conversa com nosso time para avaliar um carregador no seu condomínio. Seguimos acompanhando.',
  },
  {
    id: 'a4', nome: 'Fernanda', cidade: 'Porto Alegre (RS)', tipo: 'teste', uso: 'cidade', recarga: 'casa',
    tempo: 'Mês de teste · dia 18', nota: 5, data: '2026-09-20',
    texto: 'Eu tinha medo da autonomia. Em 18 dias de rotina real, a menor carga que vi foi 35%. Já decidi assinar.',
  },
  {
    id: 'a5', nome: 'Thiago', cidade: 'Rio de Janeiro (RJ)', tipo: 'aluguel', uso: 'estrada', recarga: 'rua',
    tempo: 'Alugou por 7 dias', nota: 4, data: '2026-08-15',
    texto: 'Aluguei para subir a serra até Petrópolis. Subida tranquila e a regeneração na descida devolveu carga. Precisei planejar uma parada para recarregar.',
  },
  {
    id: 'a6', nome: 'Patrícia', cidade: 'Curitiba (PR)', tipo: 'assinante', uso: 'cidade', recarga: 'trabalho',
    tempo: '2 anos de assinatura', nota: 5, data: '2026-07-30',
    texto: 'Dois anos e a bateria continua como no primeiro dia. O conforto e o silêncio fazem falta quando dirijo outro carro.',
  },
  {
    id: 'a7', nome: 'André', cidade: 'São Paulo (SP)', tipo: 'assinante', uso: 'cidade', recarga: 'casa',
    tempo: '3 meses de assinatura', nota: 2, data: '2026-09-08',
    texto: 'Demoraram 12 dias para agendar a instalação do carregador residencial. Enquanto isso, dependi de recarga pública.',
    resposta: 'André, você tem razão: o prazo ficou acima do nosso padrão de 5 dias úteis. Revisamos o processo com o parceiro de instalação e devolvemos na sua fatura o valor das recargas públicas do período.',
  },
  {
    id: 'a8', nome: 'Luciana', cidade: 'Belo Horizonte (MG)', tipo: 'teste', uso: 'estrada', recarga: 'casa',
    tempo: 'Mês de teste · dia 25', nota: 4, data: '2026-09-25',
    texto: 'Fiz BH–Ouro Preto ida e volta sem recarregar. O tutorial de recarga no app ajudou muito na primeira semana.',
  },
  {
    id: 'a9', nome: 'Marcos', cidade: 'Porto Alegre (RS)', tipo: 'aluguel', uso: 'cidade', recarga: 'rua',
    tempo: 'Alugou por 3 dias', nota: 5, data: '2026-08-05',
    texto: 'Aluguei só para experimentar e virei fã. O gasto com energia ficou muito abaixo do que eu gastaria de gasolina.',
  },
  {
    id: 'a10', nome: 'Beatriz', cidade: 'Rio de Janeiro (RJ)', tipo: 'assinante', uso: 'estrada', recarga: 'casa',
    tempo: '10 meses de assinatura', nota: 5, data: '2026-06-18',
    texto: 'Pego estrada quase todo fim de semana. A autonomia real bate com o que a Localiza mostra na página.',
  },
]
```

- [ ] **Step 2: Escrever os testes (falhando)**

`prototipo/src/data/avaliacoes.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { avaliacoes, resumoAvaliacoes } from './avaliacoes'

describe('dados de avaliações', () => {
  it('distribuição soma o total e a média bate com 4,6', () => {
    const { distribuicao, total, media } = resumoAvaliacoes
    const qtd = distribuicao.reduce((s, d) => s + d.qtd, 0)
    const soma = distribuicao.reduce((s, d) => s + d.estrelas * d.qtd, 0)
    expect(qtd).toBe(total)
    expect(Math.round((soma / qtd) * 10) / 10).toBe(media)
  })

  it('cobre todos os tipos e tem negativas com resposta', () => {
    expect(new Set(avaliacoes.map((a) => a.tipo))).toEqual(new Set(['assinante', 'teste', 'aluguel']))
    const negativas = avaliacoes.filter((a) => a.nota <= 3)
    expect(negativas.length).toBeGreaterThanOrEqual(2)
    expect(negativas.every((a) => a.resposta)).toBe(true)
    expect(new Set(avaliacoes.map((a) => a.id)).size).toBe(avaliacoes.length)
  })
})
```

`prototipo/src/lib/filtroAvaliacoes.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { avaliacoes } from '../data/avaliacoes'
import {
  alternarFiltro,
  FILTROS_VAZIOS,
  filtrarAvaliacoes,
  ordenarRecentes,
  temFiltroAtivo,
} from './filtroAvaliacoes'

describe('filtroAvaliacoes', () => {
  it('sem filtros retorna tudo', () => {
    expect(filtrarAvaliacoes(avaliacoes, FILTROS_VAZIOS)).toHaveLength(10)
    expect(temFiltroAtivo(FILTROS_VAZIOS)).toBe(false)
  })

  it('OU dentro do grupo', () => {
    const r = filtrarAvaliacoes(avaliacoes, { ...FILTROS_VAZIOS, recarga: ['casa', 'trabalho'] })
    expect(r.every((a) => a.recarga === 'casa' || a.recarga === 'trabalho')).toBe(true)
    expect(r).toHaveLength(7)
  })

  it('E entre grupos', () => {
    const r = filtrarAvaliacoes(avaliacoes, { uso: ['estrada'], recarga: ['casa'], tipo: [] })
    expect(r.map((a) => a.id).sort()).toEqual(['a10', 'a8'])
  })

  it('combinação sem resultado retorna vazio', () => {
    expect(filtrarAvaliacoes(avaliacoes, { uso: [], recarga: ['rua'], tipo: ['teste'] })).toEqual([])
  })

  it('alternarFiltro liga e desliga', () => {
    const ligado = alternarFiltro(FILTROS_VAZIOS, 'tipo', 'teste')
    expect(ligado.tipo).toEqual(['teste'])
    expect(temFiltroAtivo(ligado)).toBe(true)
    expect(alternarFiltro(ligado, 'tipo', 'teste').tipo).toEqual([])
    expect(FILTROS_VAZIOS.tipo).toEqual([])
  })

  it('ordena da mais recente para a mais antiga', () => {
    const datas = ordenarRecentes(avaliacoes).map((a) => a.data)
    expect(datas[0]).toBe('2026-09-25')
    expect(datas[datas.length - 1]).toBe('2026-06-18')
  })
})
```

- [ ] **Step 3: Rodar para ver falhar**

Run: `npm test -- src/lib/filtroAvaliacoes.test.ts src/data/avaliacoes.test.ts`
Expected: FAIL — `Failed to resolve import "../lib/filtroAvaliacoes"`.

- [ ] **Step 4: Implementar**

`prototipo/src/lib/filtroAvaliacoes.ts`:
```ts
export type Uso = 'cidade' | 'estrada'
export type LocalRecarga = 'casa' | 'trabalho' | 'rua'
export type TipoAvaliador = 'assinante' | 'teste' | 'aluguel'

export interface Avaliacao {
  id: string
  nome: string
  cidade: string
  tipo: TipoAvaliador
  uso: Uso
  recarga: LocalRecarga
  tempo: string
  nota: number
  /** ISO yyyy-mm-dd */
  data: string
  texto: string
  resposta?: string
}

export interface FiltrosAvaliacao {
  uso: Uso[]
  recarga: LocalRecarga[]
  tipo: TipoAvaliador[]
}

export const FILTROS_VAZIOS: FiltrosAvaliacao = { uso: [], recarga: [], tipo: [] }

function passa<T>(selecionados: T[], valor: T): boolean {
  return selecionados.length === 0 || selecionados.includes(valor)
}

export function filtrarAvaliacoes(lista: Avaliacao[], f: FiltrosAvaliacao): Avaliacao[] {
  return lista.filter((a) => passa(f.uso, a.uso) && passa(f.recarga, a.recarga) && passa(f.tipo, a.tipo))
}

export function ordenarRecentes(lista: Avaliacao[]): Avaliacao[] {
  return [...lista].sort((a, b) => b.data.localeCompare(a.data))
}

export function alternarFiltro(f: FiltrosAvaliacao, grupo: keyof FiltrosAvaliacao, valor: string): FiltrosAvaliacao {
  const atual = f[grupo] as string[]
  const novo = atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor]
  return { ...f, [grupo]: novo } as FiltrosAvaliacao
}

export function temFiltroAtivo(f: FiltrosAvaliacao): boolean {
  return f.uso.length > 0 || f.recarga.length > 0 || f.tipo.length > 0
}
```

- [ ] **Step 5: Rodar para ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add prototipo/src/lib/filtroAvaliacoes.ts prototipo/src/lib/filtroAvaliacoes.test.ts prototipo/src/data/avaliacoes.ts prototipo/src/data/avaliacoes.test.ts
git commit -m "feat(prototipo): avaliações fictícias e filtro por perfil"
```

---

### Task 6: Rotas por hash, modo Atual/Proposta e Toast

**Files:**
- Create: `prototipo/src/hooks/useHashRoute.ts`, `prototipo/src/modo/ModoContext.tsx`, `prototipo/src/components/ui/Toast.tsx`, `prototipo/src/components/ui/Toast.module.css`, `prototipo/src/lib/rolagem.ts`, `prototipo/src/test/render.tsx`
- Test: `prototipo/src/hooks/useHashRoute.test.ts`, `prototipo/src/modo/ModoContext.test.tsx`

**Interfaces:**
- Produces (`hooks/useHashRoute.ts`):
  ```ts
  type Rota = 'modelo' | 'assinante'
  interface EstadoHash { rota: Rota; params: URLSearchParams }
  function lerHash(hash: string): EstadoHash
  function useHashRoute(): EstadoHash
  function limparParamsHash(): void   // troca o hash atual pelo da rota sem params, via replaceState
  ```
- Produces (`modo/ModoContext.tsx`): `type Modo = 'atual' | 'proposta'`, `lerModo(search: string): Modo`, `ModoProvider`, `useModo(): { modo: Modo; setModo: (m: Modo) => void }`.
- Produces (`components/ui/Toast.tsx`): `ToastProvider`, `useToast(): (mensagem: string) => void`, `MSG_DESATIVADO = 'Link desativado no protótipo'`.
- Produces (`lib/rolagem.ts`): `rolarPara(id: string): void`, `focarPrimeiroVazio(id: string): void`, `rolarParaOrcamento(): void` (rola até `#orcamento` e foca o primeiro campo de texto vazio, no próximo tick).
- Produces (`test/render.tsx`): `renderComProviders(ui: ReactElement, url?: string)` — define a URL e renderiza dentro de `ModoProvider` + `ToastProvider`.

- [ ] **Step 1: Escrever os testes (falhando)**

`prototipo/src/hooks/useHashRoute.test.ts`:
```ts
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { lerHash, limparParamsHash, useHashRoute } from './useHashRoute'

describe('lerHash', () => {
  it('vazio ou #/ é a página do modelo', () => {
    expect(lerHash('').rota).toBe('modelo')
    expect(lerHash('#/').rota).toBe('modelo')
  })

  it('reconhece a tela do assinante', () => {
    expect(lerHash('#/assinante').rota).toBe('assinante')
  })

  it('lê parâmetros depois do ? dentro do hash', () => {
    const { rota, params } = lerHash('#/?teste=1')
    expect(rota).toBe('modelo')
    expect(params.get('teste')).toBe('1')
  })

  it('hash desconhecido cai na página do modelo', () => {
    expect(lerHash('#avaliacoes').rota).toBe('modelo')
  })
})

describe('useHashRoute', () => {
  it('reage a hashchange', () => {
    const { result } = renderHook(() => useHashRoute())
    expect(result.current.rota).toBe('modelo')
    act(() => {
      window.location.hash = '#/assinante'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current.rota).toBe('assinante')
  })
})

describe('limparParamsHash', () => {
  it('remove os parâmetros mantendo a rota e a query de modo', () => {
    window.history.replaceState(null, '', '/?modo=proposta#/?teste=1')
    limparParamsHash()
    expect(window.location.hash).toBe('#/')
    expect(window.location.search).toBe('?modo=proposta')
  })
})
```

`prototipo/src/modo/ModoContext.test.tsx`:
```tsx
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { lerModo, ModoProvider, useModo } from './ModoContext'

const wrapper = ({ children }: { children: ReactNode }) => <ModoProvider>{children}</ModoProvider>

describe('modo', () => {
  it('padrão é proposta; ?modo=atual abre no modo atual', () => {
    expect(lerModo('')).toBe('proposta')
    expect(lerModo('?modo=xyz')).toBe('proposta')
    expect(lerModo('?modo=atual')).toBe('atual')
  })

  it('setModo atualiza o estado e a query string sem perder o hash', () => {
    window.history.replaceState(null, '', '/#/assinante')
    const { result } = renderHook(() => useModo(), { wrapper })
    expect(result.current.modo).toBe('proposta')
    act(() => result.current.setModo('atual'))
    expect(result.current.modo).toBe('atual')
    expect(window.location.search).toBe('?modo=atual')
    expect(window.location.hash).toBe('#/assinante')
  })
})
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/hooks src/modo`
Expected: FAIL — imports não resolvidos.

- [ ] **Step 3: Implementar**

`prototipo/src/hooks/useHashRoute.ts`:
```ts
import { useEffect, useState } from 'react'

export type Rota = 'modelo' | 'assinante'

export interface EstadoHash {
  rota: Rota
  params: URLSearchParams
}

export function lerHash(hash: string): EstadoHash {
  const semCerquilha = hash.replace(/^#/, '')
  const [caminho, query = ''] = semCerquilha.split('?')
  const rota: Rota = caminho === '/assinante' ? 'assinante' : 'modelo'
  return { rota, params: new URLSearchParams(query) }
}

export function useHashRoute(): EstadoHash {
  const [estado, setEstado] = useState(() => lerHash(window.location.hash))
  useEffect(() => {
    const aoMudar = () => setEstado(lerHash(window.location.hash))
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return estado
}

export function limparParamsHash(): void {
  const { rota } = lerHash(window.location.hash)
  const hash = rota === 'assinante' ? '#/assinante' : '#/'
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`)
}
```

`prototipo/src/modo/ModoContext.tsx`:
```tsx
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type Modo = 'atual' | 'proposta'

export function lerModo(search: string): Modo {
  return new URLSearchParams(search).get('modo') === 'atual' ? 'atual' : 'proposta'
}

interface ValorModo {
  modo: Modo
  setModo: (m: Modo) => void
}

const ModoCtx = createContext<ValorModo | null>(null)

export function ModoProvider({ children }: { children: ReactNode }) {
  const [modo, setModoEstado] = useState<Modo>(() => lerModo(window.location.search))

  const setModo = useCallback((m: Modo) => {
    setModoEstado(m)
    const url = new URL(window.location.href)
    url.searchParams.set('modo', m)
    window.history.replaceState(null, '', url)
  }, [])

  const valor = useMemo(() => ({ modo, setModo }), [modo, setModo])
  return <ModoCtx.Provider value={valor}>{children}</ModoCtx.Provider>
}

export function useModo(): ValorModo {
  const ctx = useContext(ModoCtx)
  if (!ctx) throw new Error('useModo precisa estar dentro de ModoProvider')
  return ctx
}
```

`prototipo/src/components/ui/Toast.tsx`:
```tsx
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Toast.module.css'

export const MSG_DESATIVADO = 'Link desativado no protótipo'

const ToastCtx = createContext<(mensagem: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [mensagem, setMensagem] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const mostrar = useCallback((m: string) => {
    setMensagem(m)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMensagem(null), 2500)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <ToastCtx.Provider value={mostrar}>
      {children}
      <div role="status" aria-live="polite" className={styles.regiao}>
        {mensagem && <div className={styles.toast}>{mensagem}</div>}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast(): (mensagem: string) => void {
  return useContext(ToastCtx)
}
```

`prototipo/src/components/ui/Toast.module.css`:
```css
.regiao {
  position: fixed;
  left: 50%;
  bottom: 104px;
  transform: translateX(-50%);
  z-index: 60;
  pointer-events: none;
}

.toast {
  background: var(--c-inverse);
  color: #fff;
  font-size: 14px;
  padding: 12px 20px;
  border-radius: var(--r-main);
  box-shadow: var(--shadow-high);
  white-space: nowrap;
}
```

`prototipo/src/lib/rolagem.ts`:
```ts
function reduzirMovimento(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export function rolarPara(id: string): void {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: reduzirMovimento() ? 'auto' : 'smooth', block: 'start' })
}

export function focarPrimeiroVazio(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const campos = el.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="email"], input[type="tel"]')
  const vazio = Array.from(campos).find((c) => c.value === '')
  vazio?.focus({ preventScroll: true })
}

/** Rola até o formulário de orçamento e foca o primeiro campo vazio no próximo tick. */
export function rolarParaOrcamento(): void {
  window.setTimeout(() => {
    rolarPara('orcamento')
    focarPrimeiroVazio('orcamento')
  }, 0)
}
```

`prototipo/src/test/render.tsx`:
```tsx
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ToastProvider } from '../components/ui/Toast'
import { ModoProvider } from '../modo/ModoContext'

export function renderComProviders(ui: ReactElement, url = '/') {
  window.history.replaceState(null, '', url)
  return render(
    <ModoProvider>
      <ToastProvider>{ui}</ToastProvider>
    </ModoProvider>,
  )
}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add prototipo/src/hooks prototipo/src/modo prototipo/src/components/ui/Toast.tsx prototipo/src/components/ui/Toast.module.css prototipo/src/lib/rolagem.ts prototipo/src/test/render.tsx
git commit -m "feat(prototipo): rotas por hash, modo atual/proposta e toast"
```

---

### Task 7: Assets (imagens, logos, fundo decorativo, favicon)

> **Antes de baixar:** peça confirmação ao usuário no chat, listando os arquivos e as origens abaixo (o download precisa de permissão explícita). Só prossiga com um "sim".

**Files:**
- Create: `prototipo/public/favicon.ico`
- Create: `prototipo/public/assets/carros/{byd-dolphin,byd-dolphin-mini-30kw,byd-dolphin-mini-38kw,geely-ex2-pro,geely-ex2-max,geely-ex5-pro}.webp`
- Create: `prototipo/public/assets/marca/logo-positivo.svg`, `prototipo/public/assets/marca/logo-negativo.svg`
- Create: `prototipo/public/assets/decor/linhas.svg`
- Test: `prototipo/tests/assets.test.ts` (fora de `src/`, para usar `node:fs` sem afetar o `tsc` do app)

**Interfaces:**
- Produces: arquivos servidos em `asset('assets/...')`.

| Arquivo | Origem | Tipo/tamanho conferidos |
| --- | --- | --- |
| `carros/byd-dolphin.webp` | `https://cdn-meoobackoffice-veiculos-api-prd.localiza.com/019ffbd1-3226-7654-9e2e-aaed9e52ef7b` | webp, ~26 KB |
| `carros/byd-dolphin-mini-30kw.webp` | `.../019fd747-5906-7a0a-b489-2be33f86f89b` | webp, ~30 KB |
| `carros/geely-ex2-pro.webp` | `.../019f907b-ef52-7a53-996b-eed816736cc6` | webp, ~25 KB |
| `carros/geely-ex2-max.webp` | `.../01a03dfd-8672-78b4-a9a9-9d8f5d18d20e` | webp, ~1,5 MB |
| `carros/byd-dolphin-mini-38kw.webp` | `.../01a039fe-5ed3-7910-ba93-0819edeaad23` | webp, ~140 KB |
| `carros/geely-ex5-pro.webp` | `.../01a0622f-ccc2-7461-9e56-59d4822b4883` | webp, ~1,5 MB |
| `favicon.ico` | `https://assinatura.localiza.com/favicon.ico` | ico, ~2 KB |
| `marca/logo-positivo.svg` | `https://cdn-design-system-h.localiza.com/static/logos/localiza-assinatura/complete/horizontal/positive/logo.svg` | responde 403 para `curl`; extrair pelo browser |
| `marca/logo-negativo.svg` | `.../horizontal/negative/logo.svg` | idem |

- [ ] **Step 1: Escrever o teste (falhando)**

`prototipo/tests/assets.test.ts`:
```ts
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const publico = fileURLToPath(new URL('../public', import.meta.url))

const webps = [
  'byd-dolphin',
  'byd-dolphin-mini-30kw',
  'byd-dolphin-mini-38kw',
  'geely-ex2-pro',
  'geely-ex2-max',
  'geely-ex5-pro',
]

describe('assets', () => {
  it.each(webps)('carros/%s.webp existe e é WebP', (nome) => {
    const caminho = resolve(publico, 'assets/carros', `${nome}.webp`)
    expect(existsSync(caminho)).toBe(true)
    const cabecalho = readFileSync(caminho).subarray(0, 12).toString('latin1')
    expect(cabecalho.startsWith('RIFF')).toBe(true)
    expect(cabecalho.slice(8)).toBe('WEBP')
  })

  it.each(['marca/logo-positivo.svg', 'marca/logo-negativo.svg', 'decor/linhas.svg'])('%s é SVG', (rel) => {
    const caminho = resolve(publico, 'assets', rel)
    expect(existsSync(caminho)).toBe(true)
    expect(readFileSync(caminho, 'utf8')).toContain('<svg')
  })

  it('favicon existe', () => {
    expect(existsSync(resolve(publico, 'favicon.ico'))).toBe(true)
  })
})
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- tests/assets.test.ts`
Expected: FAIL — arquivos inexistentes.

- [ ] **Step 3: Baixar imagens e favicon (após a confirmação do usuário)**

Run (em `prototipo/`, Git Bash):
```bash
mkdir -p public/assets/carros public/assets/marca public/assets/decor
CDN=https://cdn-meoobackoffice-veiculos-api-prd.localiza.com
curl -fsSL "$CDN/019ffbd1-3226-7654-9e2e-aaed9e52ef7b" -o public/assets/carros/byd-dolphin.webp
curl -fsSL "$CDN/019fd747-5906-7a0a-b489-2be33f86f89b" -o public/assets/carros/byd-dolphin-mini-30kw.webp
curl -fsSL "$CDN/019f907b-ef52-7a53-996b-eed816736cc6" -o public/assets/carros/geely-ex2-pro.webp
curl -fsSL "$CDN/01a03dfd-8672-78b4-a9a9-9d8f5d18d20e" -o public/assets/carros/geely-ex2-max.webp
curl -fsSL "$CDN/01a039fe-5ed3-7910-ba93-0819edeaad23" -o public/assets/carros/byd-dolphin-mini-38kw.webp
curl -fsSL "$CDN/01a0622f-ccc2-7461-9e56-59d4822b4883" -o public/assets/carros/geely-ex5-pro.webp
curl -fsSL https://assinatura.localiza.com/favicon.ico -o public/favicon.ico
ls -la public/assets/carros public/favicon.ico
```
Expected: 6 arquivos `.webp` e o favicon, todos com tamanho > 0.

- [ ] **Step 4: Extrair os logos pelo browser pane**

O CDN de logos bloqueia `curl` (403), mas serve ao navegador. Para cada logo:
1. `mcp__Claude_Browser__navigate` para a URL do logo.
2. `mcp__Claude_Browser__javascript_tool` com `document.documentElement.outerHTML` para obter o SVG.
3. Gravar o texto retornado (começa com `<svg`) com a ferramenta Write em `public/assets/marca/logo-positivo.svg` ou `logo-negativo.svg`.

Se o navegador também for bloqueado, grave este fallback em `logo-positivo.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="152" height="40" viewBox="0 0 152 40" role="img" aria-label="Localiza Assinatura">
  <path d="M4 10h8v18h11v8H4z" fill="#78de1f"/>
  <path d="M14 4c6.6 0 11 4.4 11 11H14z" fill="#018444"/>
  <text x="32" y="18" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" fill="#018444">localiza</text>
  <text x="32" y="35" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="500" fill="#018444">assinatura</text>
</svg>
```
e o mesmo conteúdo em `logo-negativo.svg`, trocando os dois `fill="#018444"` dos textos por `fill="#ffffff"`.

- [ ] **Step 5: Criar o fundo decorativo**

As SVGs originais (`graph_forms*.svg`) só são servidas pelo otimizador de imagens do Next.js, não diretamente. Desenhar linhas equivalentes:

`prototipo/public/assets/decor/linhas.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" fill="none" stroke="#d6d6d6" stroke-width="1">
  <path d="M-50 620C300 420 520 760 860 560S1400 240 1650 380"/>
  <path d="M-50 660C320 470 540 800 880 600S1420 280 1650 420"/>
  <path d="M-50 180C260 320 460 60 800 200S1300 520 1650 300"/>
  <path d="M-50 220C280 360 480 100 820 240S1320 560 1650 340"/>
</svg>
```

- [ ] **Step 6: Rodar para ver passar**

Run: `npm test -- tests/assets.test.ts`
Expected: PASS (10 testes).

- [ ] **Step 7: Commit**

```bash
git add prototipo/public prototipo/tests
git commit -m "chore(prototipo): imagens dos carros, logos, favicon e fundo decorativo"
```

---

### Task 8: Componentes base de UI

**Files:**
- Create: `prototipo/src/components/ui/Button.tsx` + `.module.css`
- Create: `prototipo/src/components/ui/Accordion.tsx` + `.module.css`
- Create: `prototipo/src/components/ui/Chip.tsx` + `.module.css`
- Create: `prototipo/src/components/ui/Estrelas.tsx` + `.module.css`
- Create: `prototipo/src/components/ui/VertenteTag.tsx` + `.module.css`
- Create: `prototipo/src/components/ui/SegmentedCards.tsx` + `.module.css`
- Create: `prototipo/src/components/ui/Campos.tsx` + `.module.css`
- Create: `prototipo/src/components/icons/Marcas.tsx`
- Test: `prototipo/src/components/ui/ui.test.tsx`

**Interfaces:**
- Consumes: `formatarNota` (Task 1).
- Produces:
  ```ts
  Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: 'primary' | 'secondary' | 'outline' | 'outlineDark' | 'ghost'; tamanho?: 'md' | 'sm'; larguraTotal?: boolean; icone?: ReactNode })
  Accordion(props: { id: string; titulo: string; icone: ReactNode; contador?: number; tag?: ReactNode; abertoInicial?: boolean; children: ReactNode })
  Chip(props: { selecionado: boolean; onClick: () => void; children: ReactNode })
  Estrelas(props: { nota: number; tamanho?: number })
  VertenteTag(props: { n: 1 | 2 | 3 })
  SegmentedCards<T extends string>(props: { nome: string; rotulo: string; opcoes: { valor: T; titulo: string; descricao?: string; selo?: string }[]; valor: T | null; onChange: (v: T) => void; compacto?: boolean })
  CampoTexto(props: InputHTMLAttributes<HTMLInputElement> & { id: string; rotulo: string; erro?: string })
  CampoSelect(props: SelectHTMLAttributes<HTMLSelectElement> & { id: string; rotulo: string; opcoes: string[] })
  CampoCheckbox(props: InputHTMLAttributes<HTMLInputElement> & { id: string; rotulo: string })
  WhatsAppIcon, InstagramIcon, FacebookIcon, YoutubeIcon (props: { size?: number })
  ```

- [ ] **Step 1: Escrever os testes (falhando)**

`prototipo/src/components/ui/ui.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Accordion } from './Accordion'
import { CampoTexto } from './Campos'
import { Chip } from './Chip'
import { Estrelas } from './Estrelas'
import { SegmentedCards } from './SegmentedCards'
import { VertenteTag } from './VertenteTag'

describe('Accordion', () => {
  it('abre por padrão e alterna aria-expanded e o painel', async () => {
    render(
      <Accordion id="x" titulo="Itens de série" icone={null} contador={19}>
        <p>conteúdo</p>
      </Accordion>,
    )
    const botao = screen.getByRole('button', { name: /itens de série/i })
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('conteúdo')).toBeVisible()
    await userEvent.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('conteúdo')).not.toBeVisible()
  })
})

describe('Estrelas', () => {
  it('tem rótulo acessível com a nota', () => {
    render(<Estrelas nota={4.6} />)
    expect(screen.getByRole('img', { name: 'Nota 4,6 de 5' })).toBeInTheDocument()
  })
})

describe('Chip', () => {
  it('expõe aria-pressed', () => {
    render(<Chip selecionado onClick={() => {}}>Casa</Chip>)
    expect(screen.getByRole('button', { name: 'Casa' })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('VertenteTag', () => {
  it('mostra número e nome da vertente', () => {
    render(<VertenteTag n={2} />)
    expect(screen.getByText('Vertente 2 · Avaliações')).toBeInTheDocument()
  })
})

describe('SegmentedCards', () => {
  function Exemplo() {
    const [v, setV] = useState<'a' | 'b' | null>(null)
    return (
      <SegmentedCards
        nome="ex"
        rotulo="Escolha"
        valor={v}
        onChange={setV}
        opcoes={[
          { valor: 'a', titulo: 'Opção A' },
          { valor: 'b', titulo: 'Opção B', selo: 'Novo' },
        ]}
      />
    )
  }

  it('funciona como grupo de rádio, sem seleção inicial', async () => {
    render(<Exemplo />)
    expect(screen.getByRole('group', { name: 'Escolha' })).toBeInTheDocument()
    const b = screen.getByRole('radio', { name: /opção b/i })
    expect(b).not.toBeChecked()
    await userEvent.click(b)
    expect(b).toBeChecked()
    expect(screen.getByRole('radio', { name: /opção a/i })).not.toBeChecked()
  })
})

describe('CampoTexto', () => {
  it('liga rótulo e mensagem de erro ao input', () => {
    render(<CampoTexto id="nome" rotulo="Nome" erro="Digite o seu nome." defaultValue="" />)
    const input = screen.getByLabelText('Nome')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Digite o seu nome.')
  })
})
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/components/ui/ui.test.tsx`
Expected: FAIL — imports não resolvidos.

- [ ] **Step 3: Implementar Button**

`prototipo/src/components/ui/Button.tsx`:
```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variante = 'primary' | 'secondary' | 'outline' | 'outlineDark' | 'ghost'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamanho?: 'md' | 'sm'
  larguraTotal?: boolean
  icone?: ReactNode
}

export function Button({
  variante = 'primary',
  tamanho = 'md',
  larguraTotal = false,
  icone,
  className,
  children,
  type = 'button',
  ...resto
}: Props) {
  const classes = [styles.btn, styles[variante], styles[tamanho], larguraTotal ? styles.total : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <button type={type} className={classes} {...resto}>
      {icone}
      {children}
    </button>
  )
}
```

`prototipo/src/components/ui/Button.module.css`:
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 24px;
  border: 1px solid transparent;
  border-radius: var(--r-soft);
  font: 600 16px/150% var(--font);
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  transition: box-shadow 0.15s ease;
}

.md { min-height: 48px; }
.sm { min-height: 40px; }
.total { width: 100%; }

.primary { background: var(--c-primary); color: var(--c-primary-contrast); border-color: var(--c-primary); }
.secondary { background: var(--c-secondary); color: #fff; border-color: var(--c-secondary); }
.outline { background: #fff; color: var(--c-primary-contrast); border-color: var(--c-primary); }
.outlineDark { background: #fff; color: var(--c-primary-contrast); border-color: var(--c-secondary); }
.ghost { background: transparent; color: var(--c-primary-contrast); border-color: transparent; }

.btn:hover:not(:disabled) { box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.15); }
.btn:active:not(:disabled) { box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.25); }

.btn:disabled {
  background: var(--c-disabled-bg);
  color: var(--c-disabled-text);
  border-color: var(--c-disabled-bg);
  cursor: not-allowed;
}
```

- [ ] **Step 4: Implementar Accordion**

`prototipo/src/components/ui/Accordion.tsx`:
```tsx
import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import styles from './Accordion.module.css'

interface Props {
  id: string
  titulo: string
  icone: ReactNode
  contador?: number
  tag?: ReactNode
  abertoInicial?: boolean
  children: ReactNode
}

export function Accordion({ id, titulo, icone, contador, tag, abertoInicial = true, children }: Props) {
  const [aberto, setAberto] = useState(abertoInicial)
  const painelId = `${id}-painel`
  return (
    <section id={id} className={styles.item}>
      {tag && <div className={styles.tag}>{tag}</div>}
      <h2 className={styles.cabecalho}>
        <button
          type="button"
          className={styles.gatilho}
          aria-expanded={aberto}
          aria-controls={painelId}
          onClick={() => setAberto((a) => !a)}
        >
          <span className={styles.icone} aria-hidden="true">{icone}</span>
          <span className={styles.titulo}>{titulo}</span>
          {contador !== undefined && <span className={styles.contador}>{contador}</span>}
          <ChevronDown size={24} aria-hidden="true" className={aberto ? styles.chevronAberto : styles.chevron} />
        </button>
      </h2>
      <div id={painelId} className={styles.painel} hidden={!aberto}>
        {children}
      </div>
    </section>
  )
}
```

`prototipo/src/components/ui/Accordion.module.css`:
```css
.item {
  padding: 24px 40px;
  border-top: 1px solid var(--c-paper-border);
}

.tag { margin-bottom: 8px; }

.cabecalho { font-size: inherit; }

.gatilho {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
  text-align: left;
  color: var(--c-secondary);
}

.icone { display: inline-flex; color: var(--c-secondary); }
.titulo { flex: 1; font: 700 16px/24px var(--font); }
.contador { font: 700 14px/21px var(--font); }

.chevron,
.chevronAberto { transition: transform 0.2s ease; color: var(--c-secondary); }
.chevronAberto { transform: rotate(180deg); }

.painel { padding-top: 16px; }

@media (max-width: 671px) {
  .item { padding: 24px 16px; }
}
```

- [ ] **Step 5: Implementar Chip, Estrelas e VertenteTag**

`prototipo/src/components/ui/Chip.tsx`:
```tsx
import type { ReactNode } from 'react'
import styles from './Chip.module.css'

interface Props {
  selecionado: boolean
  onClick: () => void
  children: ReactNode
}

export function Chip({ selecionado, onClick, children }: Props) {
  return (
    <button type="button" aria-pressed={selecionado} className={selecionado ? styles.ativo : styles.chip} onClick={onClick}>
      {children}
    </button>
  )
}
```

`prototipo/src/components/ui/Chip.module.css`:
```css
.chip,
.ativo {
  min-height: 36px;
  padding: 0 16px;
  border-radius: var(--r-pill);
  border: 1px solid var(--c-border-low);
  background: #fff;
  color: var(--c-text);
  font: 500 14px/21px var(--font);
  cursor: pointer;
}

.ativo {
  background: var(--c-primary-lower);
  border-color: var(--c-secondary);
  color: var(--c-primary-contrast);
}

.chip:hover { border-color: var(--c-border); }
```

`prototipo/src/components/ui/Estrelas.tsx`:
```tsx
import { Star } from 'lucide-react'
import { formatarNota } from '../../lib/formato'
import styles from './Estrelas.module.css'

interface Props {
  nota: number
  tamanho?: number
}

export function Estrelas({ nota, tamanho = 16 }: Props) {
  return (
    <span className={styles.estrelas} role="img" aria-label={`Nota ${formatarNota(nota)} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const preenchido = Math.max(0, Math.min(1, nota - (i - 1)))
        return (
          <span key={i} className={styles.estrela} style={{ width: tamanho, height: tamanho }}>
            <Star size={tamanho} className={styles.vazia} aria-hidden="true" />
            <span className={styles.cheia} style={{ width: `${preenchido * 100}%` }}>
              <Star size={tamanho} aria-hidden="true" />
            </span>
          </span>
        )
      })}
    </span>
  )
}
```

`prototipo/src/components/ui/Estrelas.module.css`:
```css
.estrelas { display: inline-flex; gap: 2px; vertical-align: middle; }
.estrela { position: relative; display: inline-block; }
.vazia { color: var(--c-border-low); fill: var(--c-border-low); }
.cheia {
  position: absolute;
  inset: 0 auto 0 0;
  overflow: hidden;
  color: var(--c-warning-high);
}
.cheia svg { fill: var(--c-warning-high); }
```

`prototipo/src/components/ui/VertenteTag.tsx`:
```tsx
import styles from './VertenteTag.module.css'

const NOMES = { 1: 'Mês de teste', 2: 'Avaliações', 3: 'Telemetria' } as const

export function VertenteTag({ n }: { n: 1 | 2 | 3 }) {
  return (
    <span className={styles.tag}>
      Vertente {n} · {NOMES[n]}
    </span>
  )
}
```

`prototipo/src/components/ui/VertenteTag.module.css`:
```css
.tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: var(--r-pill);
  background: var(--c-info-lower);
  color: var(--c-info-contrast);
  font: 600 12px/1 var(--font);
  letter-spacing: 0.01em;
}
```

- [ ] **Step 6: Implementar SegmentedCards**

`prototipo/src/components/ui/SegmentedCards.tsx`:
```tsx
import styles from './SegmentedCards.module.css'

export interface OpcaoSegmentada<T extends string> {
  valor: T
  titulo: string
  descricao?: string
  selo?: string
}

interface Props<T extends string> {
  nome: string
  rotulo: string
  opcoes: OpcaoSegmentada<T>[]
  valor: T | null
  onChange: (v: T) => void
  compacto?: boolean
}

export function SegmentedCards<T extends string>({ nome, rotulo, opcoes, valor, onChange, compacto = false }: Props<T>) {
  return (
    <fieldset className={styles.grupo}>
      <legend className={styles.legenda}>{rotulo}</legend>
      <div className={compacto ? styles.linhaCompacta : styles.linha}>
        {opcoes.map((o) => (
          <label key={o.valor} className={o.valor === valor ? styles.cardAtivo : styles.card}>
            <input
              type="radio"
              name={nome}
              value={o.valor}
              checked={o.valor === valor}
              onChange={() => onChange(o.valor)}
              className={styles.radio}
            />
            <span className={styles.titulo}>
              {o.titulo}
              {o.selo && <span className={styles.selo}>{o.selo}</span>}
            </span>
            {o.descricao && <span className={styles.descricao}>{o.descricao}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
```

`prototipo/src/components/ui/SegmentedCards.module.css`:
```css
.grupo { border: 0; margin: 0; padding: 0; min-width: 0; }

.legenda {
  padding: 0;
  margin-bottom: 8px;
  font: 600 16px/24px var(--font);
  color: var(--c-text);
}

.linha,
.linhaCompacta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.linhaCompacta { grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); }

.card,
.cardAtivo {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-height: 48px;
  padding: 10px 16px;
  border: 1px solid var(--c-border);
  border-radius: var(--r-main);
  background: #fff;
  cursor: pointer;
}

.cardAtivo {
  border: 2px solid var(--c-secondary);
  background: var(--c-primary-lower);
  padding: 9px 15px;
}

.card:has(.radio:focus-visible),
.cardAtivo:has(.radio:focus-visible) {
  outline: 2px solid var(--c-focus);
  outline-offset: 2px;
}

.radio { position: absolute; opacity: 0; width: 1px; height: 1px; }

.titulo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font: 600 14px/21px var(--font);
  color: var(--c-text-high);
}

.selo {
  padding: 0 8px;
  border-radius: var(--r-pill);
  background: var(--c-primary);
  color: var(--c-primary-contrast);
  font: 600 12px/20px var(--font);
}

.descricao { font: 400 12px/160% var(--font); color: var(--c-text-low); }
```

- [ ] **Step 7: Implementar Campos**

`prototipo/src/components/ui/Campos.tsx`:
```tsx
import { ChevronDown } from 'lucide-react'
import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import styles from './Campos.module.css'

interface CampoTextoProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  rotulo: string
  erro?: string
}

export function CampoTexto({ id, rotulo, erro, className, type = 'text', ...resto }: CampoTextoProps) {
  const erroId = `${id}-erro`
  return (
    <div className={[styles.campo, className ?? ''].join(' ')}>
      <label htmlFor={id} className={styles.rotulo}>{rotulo}</label>
      <input
        id={id}
        type={type}
        className={erro ? styles.inputErro : styles.input}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? erroId : undefined}
        {...resto}
      />
      {erro && <span id={erroId} className={styles.erro}>{erro}</span>}
    </div>
  )
}

interface CampoSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  rotulo: string
  opcoes: string[]
}

export function CampoSelect({ id, rotulo, opcoes, className, ...resto }: CampoSelectProps) {
  return (
    <div className={[styles.campo, className ?? ''].join(' ')}>
      <label htmlFor={id} className={styles.rotulo}>{rotulo}</label>
      <div className={styles.selectWrap}>
        <select id={id} className={styles.select} {...resto}>
          {opcoes.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={20} aria-hidden="true" className={styles.chevron} />
      </div>
    </div>
  )
}

interface CampoCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  rotulo: string
}

export function CampoCheckbox({ id, rotulo, ...resto }: CampoCheckboxProps) {
  return (
    <label htmlFor={id} className={styles.checkbox}>
      <input id={id} type="checkbox" className={styles.caixa} {...resto} />
      <span>{rotulo}</span>
    </label>
  )
}
```

`prototipo/src/components/ui/Campos.module.css`:
```css
.campo { display: flex; flex-direction: column; min-width: 0; }

.rotulo {
  margin-bottom: 8px;
  font: 600 16px/24px var(--font);
  color: var(--c-text);
}

.input,
.inputErro,
.select {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--c-border);
  border-radius: var(--r-main);
  background: #fff;
  font: 400 16px/24px var(--font);
  color: var(--c-text);
}

.input::placeholder,
.inputErro::placeholder { color: var(--c-border); }

.input:focus,
.inputErro:focus,
.select:focus {
  outline: none;
  border: 2px solid var(--c-focus);
  padding: 0 15px;
}

.inputErro { border-color: var(--c-critical); }

.erro { margin-top: 4px; font: 400 12px/160% var(--font); color: var(--c-critical); }

.selectWrap { position: relative; }

.select {
  appearance: none;
  padding-right: 40px;
  font-weight: 700;
  color: var(--c-text-high);
  cursor: pointer;
}

.chevron {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--c-text-high);
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  font: 400 14px/21px var(--font);
  color: var(--c-text);
  cursor: pointer;
}

.caixa {
  width: 24px;
  height: 24px;
  flex: none;
  margin: 0;
  accent-color: var(--c-secondary);
}
```

- [ ] **Step 8: Ícones de marca**

`prototipo/src/components/icons/Marcas.tsx`:
```tsx
interface Props {
  size?: number
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export function WhatsAppIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.3z" />
      <path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.6 1 1.4 1.8 2.4 2.4.2.1.4.1.6 0l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.5.4-2.6 0-1.9-.7-3.6-2.4-4.3-4.3-.4-1.1-.3-2 0-2.6z" />
    </svg>
  )
}

export function InstagramIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" />
    </svg>
  )
}

export function YoutubeIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" />
    </svg>
  )
}
```

- [ ] **Step 9: Rodar para ver passar**

Run: `npm test -- src/components/ui/ui.test.tsx`
Expected: PASS (6 testes).

Run: `npm run build`
Expected: sem erros de tipo.

- [ ] **Step 10: Commit**

```bash
git add prototipo/src/components
git commit -m "feat(prototipo): componentes base (botão, acordeão, chips, estrelas, campos, tags)"
```

---

### Task 9: Formulário de orçamento com a escolha do mês de teste (V1)

**Files:**
- Create: `prototipo/src/features/mes-de-teste/InicioContext.tsx`
- Create: `prototipo/src/features/mes-de-teste/OpcaoInicioForm.tsx` + `.module.css`
- Create: `prototipo/src/pages/ModeloPage/QuoteForm.tsx` + `.module.css`
- Test: `prototipo/src/pages/ModeloPage/QuoteForm.test.tsx`

**Interfaces:**
- Consumes: `useModo` (Task 6), `useToast`/`MSG_DESATIVADO` (Task 6), `rolarParaOrcamento` (Task 6), `validarOrcamento`/`DadosOrcamento`/`CampoValidado` (Task 4), `mascaraTelefone`/`mascaraDocumento`/`mascaraCep` (Task 4), `Button`, `SegmentedCards`, `VertenteTag`, `CampoTexto`/`CampoSelect`/`CampoCheckbox`, `WhatsAppIcon` (Task 8), `renderComProviders` (Task 6).
- Produces:
  ```ts
  type Inicio = 'agora' | 'teste'
  InicioProvider({ children })
  useInicio(): { inicio: Inicio; setInicio: (i: Inicio) => void; escolherTesteERolar: () => void }
  OpcaoInicioForm({ valor: Inicio; onChange: (v: Inicio) => void })
  QuoteForm()  // renderiza o card com id="orcamento"
  ```

- [ ] **Step 1: Escrever os testes (falhando)**

`prototipo/src/pages/ModeloPage/QuoteForm.test.tsx`:
```tsx
import { screen } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { InicioProvider } from '../../features/mes-de-teste/InicioContext'
import { renderComProviders } from '../../test/render'
import { QuoteForm } from './QuoteForm'

function renderForm(url = '/') {
  return renderComProviders(
    <InicioProvider>
      <QuoteForm />
    </InicioProvider>,
    url,
  )
}

async function preencherValido(user: UserEvent) {
  await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
  await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
  await user.type(screen.getByLabelText('Telefone'), '41999998888')
  await user.type(screen.getByLabelText('CPF ou CNPJ'), '12345678901')
  await user.type(screen.getByLabelText('CEP'), '80000000')
}

describe('QuoteForm', () => {
  it('mantém o envio desabilitado até o formulário ficar válido', async () => {
    const user = userEvent.setup()
    renderForm()
    const enviar = screen.getByRole('button', { name: 'Solicitar orçamento' })
    expect(enviar).toBeDisabled()
    await preencherValido(user)
    expect(screen.getByLabelText('Telefone')).toHaveValue('(41) 99999-8888')
    expect(screen.getByLabelText('CPF ou CNPJ')).toHaveValue('123.456.789-01')
    expect(screen.getByLabelText('CEP')).toHaveValue('80000-000')
    expect(enviar).toBeEnabled()
  })

  it('nome só com espaços volta a desabilitar o envio', async () => {
    const user = userEvent.setup()
    renderForm()
    await preencherValido(user)
    await user.clear(screen.getByLabelText('Nome'))
    await user.type(screen.getByLabelText('Nome'), '   ')
    expect(screen.getByRole('button', { name: 'Solicitar orçamento' })).toBeDisabled()
  })

  it('mostra o erro só depois de sair do campo', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('E-mail'), 'ana@')
    expect(screen.queryByText('Digite um e-mail válido.')).not.toBeInTheDocument()
    await user.tab()
    expect(screen.getByText('Digite um e-mail válido.')).toBeInTheDocument()
  })

  it('no modo atual não mostra a escolha de início', () => {
    renderForm('/?modo=atual')
    expect(screen.queryByRole('group', { name: 'Como quer começar?' })).not.toBeInTheDocument()
  })

  it('mês de teste muda o botão e mostra a explicação', async () => {
    const user = userEvent.setup()
    renderForm()
    expect(screen.getByRole('radio', { name: /assinar agora/i })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: /mês de teste/i }))
    expect(screen.getByText(/decida até o dia 25/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quero testar por 30 dias' })).toBeDisabled()
  })

  it('envio válido mostra sucesso e "Voltar" restaura o formulário preenchido', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('radio', { name: /mês de teste/i }))
    await preencherValido(user)
    await user.click(screen.getByRole('button', { name: 'Quero testar por 30 dias' }))
    expect(screen.getByText(/agendar a retirada do carro de teste/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Voltar ao formulário' }))
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana Souza')
  })

  it('sem mês de teste o sucesso é o genérico', async () => {
    const user = userEvent.setup()
    renderForm()
    await preencherValido(user)
    await user.click(screen.getByRole('button', { name: 'Solicitar orçamento' }))
    expect(screen.getByText('Logo entraremos em contato.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/pages/ModeloPage/QuoteForm.test.tsx`
Expected: FAIL — imports não resolvidos.

- [ ] **Step 3: Implementar o contexto de início**

`prototipo/src/features/mes-de-teste/InicioContext.tsx`:
```tsx
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { rolarParaOrcamento } from '../../lib/rolagem'

export type Inicio = 'agora' | 'teste'

interface ValorInicio {
  inicio: Inicio
  setInicio: (i: Inicio) => void
  escolherTesteERolar: () => void
}

const InicioCtx = createContext<ValorInicio | null>(null)

export function InicioProvider({ children }: { children: ReactNode }) {
  const [inicio, setInicio] = useState<Inicio>('agora')

  const escolherTesteERolar = useCallback(() => {
    setInicio('teste')
    rolarParaOrcamento()
  }, [])

  const valor = useMemo(() => ({ inicio, setInicio, escolherTesteERolar }), [inicio, escolherTesteERolar])
  return <InicioCtx.Provider value={valor}>{children}</InicioCtx.Provider>
}

export function useInicio(): ValorInicio {
  const ctx = useContext(InicioCtx)
  if (!ctx) throw new Error('useInicio precisa estar dentro de InicioProvider')
  return ctx
}
```

- [ ] **Step 4: Implementar a opção de início**

`prototipo/src/features/mes-de-teste/OpcaoInicioForm.tsx`:
```tsx
import { Info } from 'lucide-react'
import { SegmentedCards } from '../../components/ui/SegmentedCards'
import { VertenteTag } from '../../components/ui/VertenteTag'
import type { Inicio } from './InicioContext'
import styles from './OpcaoInicioForm.module.css'

interface Props {
  valor: Inicio
  onChange: (v: Inicio) => void
}

export function OpcaoInicioForm({ valor, onChange }: Props) {
  return (
    <div className={styles.bloco}>
      <VertenteTag n={1} />
      <SegmentedCards
        nome="inicio"
        rotulo="Como quer começar?"
        valor={valor}
        onChange={onChange}
        opcoes={[
          { valor: 'agora', titulo: 'Assinar agora' },
          { valor: 'teste', titulo: 'Mês de teste', selo: '30 dias' },
        ]}
      />
      {valor === 'teste' && (
        <p className={styles.info}>
          <Info size={20} aria-hidden="true" className={styles.icone} />
          <span>
            Use um Dolphin da frota por 30 dias pagando a 1ª mensalidade. Decida até o dia 25. Se desistir, devolve
            sem multa. A cor e a versão do carro de teste podem variar.
          </span>
        </p>
      )}
    </div>
  )
}
```

`prototipo/src/features/mes-de-teste/OpcaoInicioForm.module.css`:
```css
.bloco {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 24px;
}

.bloco > fieldset { width: 100%; }

.info {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: var(--c-bg);
  border-radius: var(--r-soft);
  font: 400 14px/21px var(--font);
}

.icone { flex: none; color: var(--c-info-contrast); }
```

- [ ] **Step 5: Implementar o formulário**

`prototipo/src/pages/ModeloPage/QuoteForm.tsx`:
```tsx
import { CircleCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { WhatsAppIcon } from '../../components/icons/Marcas'
import { Button } from '../../components/ui/Button'
import { CampoCheckbox, CampoSelect, CampoTexto } from '../../components/ui/Campos'
import { MSG_DESATIVADO, useToast } from '../../components/ui/Toast'
import { useInicio, type Inicio } from '../../features/mes-de-teste/InicioContext'
import { OpcaoInicioForm } from '../../features/mes-de-teste/OpcaoInicioForm'
import { mascaraCep, mascaraDocumento, mascaraTelefone } from '../../lib/mascaras'
import { validarOrcamento, type CampoValidado, type DadosOrcamento } from '../../lib/validacao'
import { useModo } from '../../modo/ModoContext'
import styles from './QuoteForm.module.css'

const PERIODOS = ['12 Meses', '18 Meses', '24 Meses', '36 Meses', '48 Meses']
const FRANQUIAS = ['500 Km', '1000 Km', '1500 Km', '2000 Km', '2500 Km']

const INICIAL: DadosOrcamento = {
  periodo: '48 Meses',
  franquia: '500 Km',
  nome: '',
  email: '',
  telefone: '',
  documento: '',
  cep: '',
  whatsapp: false,
  marketing: false,
}

const TEXTO_LEGAL =
  'A Localiza trata seus dados com segurança e transparência. Ao clicar em Solicitar orçamento, você autoriza a Localiza a tratar suas informações para contato, análise da solicitação, validação do serviço na sua região e, por meio de empresas parceiras, consultar o Sistema de Informações de Crédito para fins de análise de crédito e risco, nos termos da Resolução CMN nº 5.037, de 29/09/2022. Saiba mais sobre como tratamos seus dados em nosso Aviso de Privacidade.'

export function QuoteForm() {
  const { modo } = useModo()
  const { inicio, setInicio } = useInicio()
  const toast = useToast()
  const inicioEfetivo: Inicio = modo === 'proposta' ? inicio : 'agora'

  const [dados, setDados] = useState<DadosOrcamento>(INICIAL)
  const [tocados, setTocados] = useState<ReadonlySet<CampoValidado>>(new Set())
  const [enviado, setEnviado] = useState(false)

  const erros = validarOrcamento(dados)
  const valido = Object.keys(erros).length === 0

  const mudar = <K extends keyof DadosOrcamento>(campo: K, valor: DadosOrcamento[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }))
  const tocar = (c: CampoValidado) => setTocados((t) => new Set(t).add(c))
  const erroDe = (c: CampoValidado) => (tocados.has(c) ? erros[c] : undefined)

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (valido) setEnviado(true)
  }

  return (
    <div id="orcamento" className={styles.card}>
      {enviado ? (
        <div role="status" className={styles.sucesso}>
          <CircleCheck size={48} aria-hidden="true" className={styles.sucessoIcone} />
          <h2 className={styles.titulo}>Pronto!</h2>
          <p>
            {inicioEfetivo === 'teste'
              ? 'Um consultor vai te chamar para configurar seu 0 km e agendar a retirada do carro de teste.'
              : 'Logo entraremos em contato.'}
          </p>
          <Button variante="outlineDark" onClick={() => setEnviado(false)}>
            Voltar ao formulário
          </Button>
        </div>
      ) : (
        <form onSubmit={enviar} noValidate aria-labelledby="orcamento-titulo">
          <h2 id="orcamento-titulo" className={styles.titulo}>
            Preencha seus dados
          </h2>
          <p className={styles.subtitulo}>Logo entraremos em contato.</p>

          <div className={styles.whatsapp}>
            <span>Se preferir entre em contato pelo Whatsapp</span>
            <button
              type="button"
              className={styles.whatsappBotao}
              aria-label="Falar pelo WhatsApp"
              onClick={() => toast(MSG_DESATIVADO)}
            >
              <WhatsAppIcon size={24} />
            </button>
          </div>

          {modo === 'proposta' && <OpcaoInicioForm valor={inicio} onChange={setInicio} />}

          <div className={styles.grade}>
            <CampoSelect
              id="periodo"
              rotulo="Período de assinatura"
              opcoes={PERIODOS}
              value={dados.periodo}
              onChange={(e) => mudar('periodo', e.target.value)}
            />
            <CampoSelect
              id="franquia"
              rotulo="Franquia mensal"
              opcoes={FRANQUIAS}
              value={dados.franquia}
              onChange={(e) => mudar('franquia', e.target.value)}
            />
            <CampoTexto
              id="nome"
              rotulo="Nome"
              placeholder="Digite o seu nome"
              autoComplete="name"
              className={styles.inteiro}
              value={dados.nome}
              onChange={(e) => mudar('nome', e.target.value)}
              onBlur={() => tocar('nome')}
              erro={erroDe('nome')}
            />
            <CampoTexto
              id="email"
              type="email"
              rotulo="E-mail"
              placeholder="Digite o seu e-mail"
              autoComplete="email"
              value={dados.email}
              onChange={(e) => mudar('email', e.target.value)}
              onBlur={() => tocar('email')}
              erro={erroDe('email')}
            />
            <CampoTexto
              id="telefone"
              type="tel"
              rotulo="Telefone"
              placeholder="Digite o seu número"
              inputMode="numeric"
              autoComplete="tel-national"
              value={dados.telefone}
              onChange={(e) => mudar('telefone', mascaraTelefone(e.target.value))}
              onBlur={() => tocar('telefone')}
              erro={erroDe('telefone')}
            />
            <CampoTexto
              id="documento"
              rotulo="CPF ou CNPJ"
              placeholder="Digite somente números"
              inputMode="numeric"
              value={dados.documento}
              onChange={(e) => mudar('documento', mascaraDocumento(e.target.value))}
              onBlur={() => tocar('documento')}
              erro={erroDe('documento')}
            />
            <CampoTexto
              id="cep"
              rotulo="CEP"
              placeholder="Digite seu CEP"
              inputMode="numeric"
              autoComplete="postal-code"
              value={dados.cep}
              onChange={(e) => mudar('cep', mascaraCep(e.target.value))}
              onBlur={() => tocar('cep')}
              erro={erroDe('cep')}
            />
          </div>

          <div className={styles.opcoes}>
            <CampoCheckbox
              id="whatsapp-optin"
              rotulo="Pode me chamar no WhatsApp"
              checked={dados.whatsapp}
              onChange={(e) => mudar('whatsapp', e.target.checked)}
            />
            <CampoCheckbox
              id="marketing-optin"
              rotulo="Aceito receber e-mail e SMS promocionais da Localiza"
              checked={dados.marketing}
              onChange={(e) => mudar('marketing', e.target.checked)}
            />
          </div>

          <div className={styles.rodape}>
            <Button type="submit" disabled={!valido} className={styles.enviar}>
              {inicioEfetivo === 'teste' ? 'Quero testar por 30 dias' : 'Solicitar orçamento'}
            </Button>
          </div>

          <p className={styles.legal}>{TEXTO_LEGAL}</p>
        </form>
      )}
    </div>
  )
}
```

`prototipo/src/pages/ModeloPage/QuoteForm.module.css`:
```css
.card {
  background: #fff;
  border-radius: var(--r-soft);
  padding: 32px;
}

.titulo { font: 700 24px/33.6px var(--font); color: var(--c-secondary); }
.subtitulo { margin-top: 4px; font: 400 16px/24px var(--font); }

.whatsapp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 56px;
  margin-top: 24px;
  padding: 8px 8px 8px 16px;
  background: var(--c-bg);
  border-radius: var(--r-soft);
  font: 400 14px/21px var(--font);
}

.whatsappBotao {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: var(--r-main);
  background: var(--c-secondary);
  color: #fff;
  cursor: pointer;
}

.grade {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 16px;
  margin: 24px 0 8px;
}

.inteiro { grid-column: 1 / -1; }

.opcoes { display: flex; flex-direction: column; }

.rodape { display: flex; justify-content: flex-end; margin-top: 24px; }
.enviar { min-width: 200px; }

.legal { margin-top: 24px; font: 400 12px/160% var(--font); color: var(--c-text-low); }

.sucesso {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 0;
  text-align: center;
}

.sucessoIcone { color: var(--c-secondary); }

@media (min-width: 1200px) {
  .card {
    max-height: calc(100vh - var(--header-h) - 48px);
    overflow-y: auto;
  }
}

@media (max-width: 671px) {
  .card { padding: 24px 16px; }
  .grade { grid-template-columns: 1fr; }
  .enviar { width: 100%; }
}
```

- [ ] **Step 6: Rodar para ver passar**

Run: `npm test -- src/pages/ModeloPage/QuoteForm.test.tsx`
Expected: PASS (7 testes).

Run: `npm run build`
Expected: sem erros.

- [ ] **Step 7: Commit**

```bash
git add prototipo/src/features/mes-de-teste prototipo/src/pages/ModeloPage/QuoteForm.tsx prototipo/src/pages/ModeloPage/QuoteForm.module.css prototipo/src/pages/ModeloPage/QuoteForm.test.tsx
git commit -m "feat(prototipo): formulário de orçamento com máscaras e opção de mês de teste"
```

---

### Task 10: Página do modelo — conteúdo que já existe hoje

**Files:**
- Create: `prototipo/src/data/dolphin.ts`, `prototipo/src/data/relacionados.ts`
- Create em `prototipo/src/pages/ModeloPage/`: `Breadcrumb.tsx`, `TitleBlock.tsx`, `VehicleCard.tsx`, `ColorPicker.tsx`, `ItensDeSerie.tsx`, `ListaComIcones.tsx`, `RelatedCarousel.tsx`, `ModeloPage.tsx`, cada um com `.module.css`
- Test: `prototipo/src/pages/ModeloPage/ModeloPage.test.tsx`

**Interfaces:**
- Consumes: `asset`, `normalizar` (Task 1); `useToast`, `MSG_DESATIVADO`, `rolarParaOrcamento`, `renderComProviders` (Task 6); `Button`, `Accordion` (Task 8); `InicioProvider` e `QuoteForm` (Task 9).
- Produces:
  ```ts
  // data/dolphin.ts
  interface Destaque { rotulo: string; icone: LucideIcon }
  interface CorVeiculo { nome: string; hex: string }
  interface ItemComIcone { titulo: string; descricao: string; negrito?: string; icone: LucideIcon }
  const dolphin: { nome; versao; categoria; imagem; destaques: Destaque[]; cores: CorVeiculo[] }
  const itensDeSerie: string[]           // 19
  const inclusoNaAssinatura: ItemComIcone[]  // 12
  const adicionais: ItemComIcone[]       // 5
  // data/relacionados.ts
  interface ModeloRelacionado { nome; versao; categoria; destaques: Destaque[]; imagem; entregaRapida?: boolean }
  const relacionados: ModeloRelacionado[] // 5
  // pages
  ModeloPage()   // envolve tudo em InicioProvider; coluna esquerda com className styles.esquerda
  TitleBlock()
  ```

- [ ] **Step 1: Escrever os dados**

`prototipo/src/data/dolphin.ts`:
```ts
import {
  Car,
  Disc,
  FileText,
  Hammer,
  Headset,
  Monitor,
  PiggyBank,
  Puzzle,
  RectangleHorizontal,
  Satellite,
  Settings,
  Settings2,
  ShieldCheck,
  ShieldPlus,
  Smartphone,
  Sun,
  Truck,
  Users,
  Volume2,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export interface Destaque {
  rotulo: string
  icone: LucideIcon
}

export interface CorVeiculo {
  nome: string
  hex: string
}

export interface ItemComIcone {
  titulo: string
  descricao: string
  negrito?: string
  icone: LucideIcon
}

export const dolphin = {
  nome: 'BYD Dolphin',
  versao: 'EV 44KW Elétrico AT',
  categoria: 'Eletrico',
  imagem: 'assets/carros/byd-dolphin.webp',
  destaques: [
    { rotulo: "Multimídia 12.8'' pol", icone: Monitor },
    { rotulo: 'Automático', icone: Settings2 },
    { rotulo: 'Elétrico', icone: Zap },
    { rotulo: '5 Lugares', icone: Users },
  ] satisfies Destaque[],
  cores: [
    { nome: 'Cheese White', hex: '#ffffff' },
    { nome: 'Preto', hex: '#111111' },
    { nome: 'Cinza', hex: '#6e6e6e' },
  ] satisfies CorVeiculo[],
}

export const itensDeSerie: string[] = [
  'Tipo de carroceria: Hatch',
  'Número de portas: 4',
  'Número de passageiros: 5',
  'Veículo importado',
  'Tipo de motorização: Elétrico',
  'Capacidade da bateria: 44.9 kWh',
  'Autonomia elétrica: 291 km',
  'Tipo de câmbio: Automático',
  'Número de marchas: 1',
  'Comprimento: 4125 mm',
  'Entre-eixos: 2700 mm',
  'Especificação do pneu: 195/60 R16',
  'Especificação da roda: Luz de rodagem diurna (DRL) de LED',
  'Revestimento: Bancos com revestimento de material premium sustentável',
  'Ajustes do banco: Ajuste elétrico do banco do motorista (6 posições), Ajuste elétrico do banco do passageiro dianteiro (4 posições), Ajuste elétrico no banco do motorista (6 posições)',
  'Zonas de climatização: 1',
  'Tamanho da tela multimídia: 12.8',
  'Quantidade de airbags: 6',
  'Tipo de farol: full LED',
]

export const inclusoNaAssinatura: ItemComIcone[] = [
  { titulo: 'Emplacamento e documentação', icone: FileText, descricao: 'A gente cuida de tudo: emplacamento, taxas de licenciamento, IPVA e documentação.' },
  { titulo: 'Manutenção preventiva', icone: Wrench, descricao: 'A gente te avisa da revisão e agenda tudo com os parceiros certos, para manter seu carro sempre pronto pra você.' },
  { titulo: 'Manutenção corretiva', icone: Settings, descricao: 'As peças que se desgastam naturalmente são trocadas no tempo certo: sem surpresas e sem interrupções no seu dia a dia.' },
  { titulo: 'Troca de pneus', icone: Disc, descricao: 'Trocas e cuidados por desgaste natural já incluídos dentro da quilometragem do contrato, para você rodar sempre com segurança.' },
  { titulo: 'Sistema de som', icone: Volume2, descricao: 'Seu carro chega completo e pronto para acompanhar o ritmo da sua rotina.' },
  { titulo: 'Insufilm', icone: Sun, descricao: 'Padrão Localiza: ajudamos você a escolher e instalar a versão que melhor funciona para o seu uso.' },
  { titulo: 'Assistência 24h', icone: Headset, descricao: 'Precisou, ligou! Nosso atendimento especializado resolve todo tipo de emergência.' },
  { titulo: 'Reparo de avarias', icone: Hammer, descricao: 'Se o carro tiver qualquer dano, nossos parceiros podem te ajudar. Para isso, é importante nos contatar na hora, ok?' },
  { titulo: 'Proteção para terceiros', icone: ShieldCheck, descricao: 'Dirija com tranquilidade. Cliente Localiza Assinatura tem proteção por danos físicos e materiais a terceiros inclusa na assinatura.' },
  { titulo: 'Reboque', icone: Truck, descricao: 'Aconteceu algum imprevisto?\nMandamos um guincho até você, onde quer que esteja! Nossa cobertura é nacional.' },
  { titulo: 'Aplicativo Localiza Assinatura', icone: Smartphone, descricao: 'Com nosso aplicativo, você controla seu plano e seu carro de forma simples e segura, onde estiver.' },
  { titulo: 'Clube de Benefícios', icone: PiggyBank, descricao: 'Programa exclusivo: aproveite vantagens incríveis em lojas, estacionamentos, pedágios, hospedagens', negrito: 'e muito mais!' },
]

export const adicionais: ItemComIcone[] = [
  { titulo: 'Acessórios customizados', icone: Puzzle, descricao: 'Personalize seu veículo com acessórios e itens adicionais para deixá-lo do seu jeito e atender às suas necessidades do dia a dia.' },
  { titulo: 'Carro reserva', icone: Car, descricao: 'Mais praticidade para sua rotina com um veículo disponível enquanto o seu estiver em manutenção ou reparo.' },
  { titulo: 'Telemetria', icone: Satellite, descricao: 'Mais controle e eficiência na gestão do veículo com acompanhamento de localização, quilometragem e muito mais.' },
  { titulo: 'Escolha o final da placa', icone: RectangleHorizontal, descricao: 'Caso tenha preferência pelo final da sua placa, principalmente se residir em regiões de rodízio, disponibilizamos essa possibilidade de escolha.' },
  { titulo: 'Proteção especial', icone: ShieldPlus, descricao: 'Você tem opção de fazer um upgrade no pacote de proteção aumentando a cobertura ou reduzindo o valor pre fixado de danos.' },
]
```

`prototipo/src/data/relacionados.ts`:
```ts
import { AirVent, Monitor, Settings2, Users, Zap } from 'lucide-react'
import type { Destaque } from './dolphin'

export interface ModeloRelacionado {
  nome: string
  versao: string
  categoria: string
  destaques: Destaque[]
  imagem: string
  entregaRapida?: boolean
}

const comuns = (tela: string): Destaque[] => [
  { rotulo: `Multimídia ${tela}'' pol`, icone: Monitor },
  { rotulo: 'Automático', icone: Settings2 },
  { rotulo: 'Ar-condicionado', icone: AirVent },
  { rotulo: 'Elétrico', icone: Zap },
  { rotulo: '5 Lugares', icone: Users },
]

export const relacionados: ModeloRelacionado[] = [
  { nome: 'BYD Dolphin Mini', versao: '30KW Elétrico AT', categoria: 'Eletrico | Hatch', destaques: comuns('10.1'), imagem: 'assets/carros/byd-dolphin-mini-30kw.webp', entregaRapida: true },
  { nome: 'Geely EX2', versao: 'Geely EX2 PRO AT 39KW', categoria: 'Eletrico | Hatch', destaques: comuns('14.6'), imagem: 'assets/carros/geely-ex2-pro.webp' },
  { nome: 'Geely EX2', versao: 'Geely EX2 MAX AT 39KW', categoria: 'Eletrico | Hatch', destaques: comuns('14.6'), imagem: 'assets/carros/geely-ex2-max.webp' },
  { nome: 'BYD Dolphin Mini', versao: '38KW Elétrico AT', categoria: 'Eletrico | Hatch', destaques: comuns('10.1'), imagem: 'assets/carros/byd-dolphin-mini-38kw.webp' },
  { nome: 'Geely EX5', versao: 'Geely EX5 PRO Elétrico 60 KW', categoria: 'Eletrico | SUV', destaques: comuns('15.4'), imagem: 'assets/carros/geely-ex5-pro.webp' },
]
```

- [ ] **Step 2: Escrever o teste (falhando)**

`prototipo/src/pages/ModeloPage/ModeloPage.test.tsx`:
```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderComProviders } from '../../test/render'
import { ModeloPage } from './ModeloPage'

describe('ModeloPage — conteúdo existente', () => {
  it('mostra título, versão e formulário', () => {
    renderComProviders(<ModeloPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'BYD Dolphin' })).toBeInTheDocument()
    expect(screen.getByText('EV 44KW Elétrico AT')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Preencha seus dados' })).toBeInTheDocument()
  })

  it('busca de itens de série ignora acentos e atualiza o contador', async () => {
    const user = userEvent.setup()
    renderComProviders(<ModeloPage />)
    const secao = document.getElementById('itens-de-serie')!
    const lista = () => within(secao).queryAllByRole('listitem')
    expect(lista()).toHaveLength(19)
    expect(within(secao).getByText('19')).toBeInTheDocument()

    await user.type(within(secao).getByRole('searchbox'), 'ELETRICO')
    expect(lista()).toHaveLength(3)
    expect(within(secao).getByText('3')).toBeInTheDocument()

    await user.clear(within(secao).getByRole('searchbox'))
    await user.type(within(secao).getByRole('searchbox'), 'xyz')
    expect(lista()).toHaveLength(0)
    expect(within(secao).getByText('Nenhum item encontrado.')).toBeInTheDocument()
  })

  it('seletor de cor troca a cor ativa e o nome', async () => {
    const user = userEvent.setup()
    renderComProviders(<ModeloPage />)
    const grupo = screen.getByRole('radiogroup', { name: 'Cor do veículo' })
    await user.click(within(grupo).getByRole('radio', { name: 'Preto' }))
    expect(within(grupo).getByRole('radio', { name: 'Preto' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('Preto', { selector: 'p' })).toBeInTheDocument()
  })

  it('lista incluso (12) e adicionais (5)', () => {
    renderComProviders(<ModeloPage />)
    expect(within(document.getElementById('incluso')!).getAllByRole('heading', { level: 3 })).toHaveLength(12)
    expect(within(document.getElementById('adicionais')!).getAllByRole('heading', { level: 3 })).toHaveLength(5)
    expect(screen.getByText('e muito mais!').tagName).toBe('STRONG')
  })

  it('carrossel mostra 5 modelos e links desativados avisam', async () => {
    const user = userEvent.setup()
    renderComProviders(<ModeloPage />)
    const carrossel = screen.getByRole('region', { name: /outros modelos/i })
    expect(within(carrossel).getAllByRole('article')).toHaveLength(5)
    expect(within(carrossel).getAllByText('Entrega rápida')).toHaveLength(1)
    await user.click(within(carrossel).getAllByRole('button', { name: 'Tenho Interesse' })[0])
    expect(screen.getByRole('status')).toHaveTextContent('Link desativado no protótipo')
  })
})
```

- [ ] **Step 3: Rodar para ver falhar**

Run: `npm test -- src/pages/ModeloPage/ModeloPage.test.tsx`
Expected: FAIL — `Failed to resolve import "./ModeloPage"`.

- [ ] **Step 4: Breadcrumb e TitleBlock**

`prototipo/src/pages/ModeloPage/Breadcrumb.tsx`:
```tsx
import { ArrowLeft, ChevronRight } from 'lucide-react'
import type { MouseEvent } from 'react'
import { MSG_DESATIVADO, useToast } from '../../components/ui/Toast'
import styles from './Breadcrumb.module.css'

export function Breadcrumb() {
  const toast = useToast()
  const desativado = (e: MouseEvent) => {
    e.preventDefault()
    toast(MSG_DESATIVADO)
  }
  return (
    <div className={styles.linha}>
      <button type="button" className={styles.voltar} aria-label="Voltar" onClick={desativado}>
        <ArrowLeft size={24} aria-hidden="true" />
      </button>
      <nav aria-label="Trilha de navegação">
        <ol className={styles.lista}>
          <li><a href="#/" onClick={desativado} className={styles.item}>...</a></li>
          <li>
            <ChevronRight size={16} aria-hidden="true" className={styles.sep} />
            <a href="#/" onClick={desativado} className={styles.item}>Modelos disponíveis</a>
          </li>
          <li>
            <ChevronRight size={16} aria-hidden="true" className={styles.sep} />
            <span aria-current="page" className={styles.atual}>BYD Dolphin</span>
          </li>
        </ol>
      </nav>
    </div>
  )
}
```

`prototipo/src/pages/ModeloPage/Breadcrumb.module.css`:
```css
.linha { display: flex; align-items: center; gap: 24px; }

.voltar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: var(--r-main);
  background: #fff;
  color: var(--c-text);
  cursor: pointer;
}

.lista { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.lista li { display: inline-flex; align-items: center; gap: 8px; }
.item { font: 600 16px/24px var(--font); color: var(--c-text-high); text-decoration: none; }
.sep { color: var(--c-icon); }
.atual { font: 600 20px/28px var(--font); color: var(--c-secondary); }

@media (max-width: 671px) {
  .linha { gap: 12px; }
  .voltar { width: 48px; height: 48px; }
  .atual { font-size: 16px; line-height: 24px; }
}
```

`prototipo/src/pages/ModeloPage/TitleBlock.tsx`:
```tsx
import { dolphin } from '../../data/dolphin'
import styles from './TitleBlock.module.css'

export function TitleBlock() {
  return (
    <div className={styles.bloco}>
      <p className={styles.nota}>Imagens ilustrativas</p>
      <h1 className={styles.titulo}>{dolphin.nome}</h1>
      <p className={styles.versao}>{dolphin.versao}</p>
    </div>
  )
}
```

`prototipo/src/pages/ModeloPage/TitleBlock.module.css`:
```css
.bloco { margin-top: 24px; }
.nota { font: 400 12px/160% var(--font); color: var(--c-text); }
.titulo { font: 700 48px/120% var(--font); color: var(--c-secondary); }
.versao { font: 700 16px/24px var(--font); color: var(--c-text); }

.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: var(--r-pill);
  background: #fff;
  border: 1px solid var(--c-border-low);
  color: var(--c-text-high);
  font: 500 14px/21px var(--font);
  text-decoration: none;
}

.chip:hover { border-color: var(--c-secondary); }
.chipIcone { color: var(--c-secondary); }
.estrela { color: var(--c-warning-high); fill: var(--c-warning-high); }

@media (max-width: 671px) {
  .titulo { font-size: 32px; line-height: 130%; }
}
```

(As classes `.chips`, `.chip`, `.chipIcone` e `.estrela` são usadas na Task 12.)

- [ ] **Step 5: VehicleCard e ColorPicker**

`prototipo/src/pages/ModeloPage/ColorPicker.tsx`:
```tsx
import type { CSSProperties } from 'react'
import type { CorVeiculo } from '../../data/dolphin'
import styles from './ColorPicker.module.css'

interface Props {
  cores: CorVeiculo[]
  selecionada: CorVeiculo
  onChange: (c: CorVeiculo) => void
}

export function ColorPicker({ cores, selecionada, onChange }: Props) {
  return (
    <div className={styles.picker}>
      <div role="radiogroup" aria-label="Cor do veículo" className={styles.swatches}>
        {cores.map((c) => {
          const ativa = c.nome === selecionada.nome
          return (
            <button
              key={c.nome}
              type="button"
              role="radio"
              aria-checked={ativa}
              aria-label={c.nome}
              className={styles.alvo}
              onClick={() => onChange(c)}
            >
              <span className={ativa ? styles.swatchAtivo : styles.swatch} style={{ '--cor': c.hex } as CSSProperties} />
            </button>
          )
        })}
      </div>
      <p className={styles.nome}>{selecionada.nome}</p>
    </div>
  )
}
```

`prototipo/src/pages/ModeloPage/ColorPicker.module.css`:
```css
.picker { display: flex; flex-direction: column; align-items: center; flex: none; }
.swatches { display: flex; gap: 4px; }

.alvo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.swatch,
.swatchAtivo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--cor);
  border: 1px solid var(--c-border-low);
}

.swatchAtivo { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--c-primary); }

.nome { font: 400 12px/160% var(--font); color: var(--c-text); }
```

`prototipo/src/pages/ModeloPage/VehicleCard.tsx`:
```tsx
import { useState } from 'react'
import { dolphin } from '../../data/dolphin'
import { asset } from '../../lib/asset'
import { ColorPicker } from './ColorPicker'
import styles from './VehicleCard.module.css'

export function VehicleCard() {
  const [cor, setCor] = useState(dolphin.cores[0])
  return (
    <article className={styles.card} aria-label={`${dolphin.nome} ${dolphin.versao}`}>
      <div className={styles.imagemArea}>
        <img src={asset(dolphin.imagem)} alt={`${dolphin.nome} na cor ${cor.nome}`} className={styles.imagem} />
      </div>
      <div className={styles.info}>
        <div>
          <p className={styles.categoria}>{dolphin.categoria}</p>
          <ul className={styles.destaques}>
            {dolphin.destaques.map(({ rotulo, icone: Icone }) => (
              <li key={rotulo}>
                <Icone size={16} aria-hidden="true" />
                {rotulo}
              </li>
            ))}
          </ul>
        </div>
        <ColorPicker cores={dolphin.cores} selecionada={cor} onChange={setCor} />
      </div>
    </article>
  )
}
```

`prototipo/src/pages/ModeloPage/VehicleCard.module.css`:
```css
.imagemArea {
  display: flex;
  justify-content: center;
  padding: 0 24px;
  border-radius: var(--r-card) var(--r-card) 0 0;
  background: linear-gradient(180deg, var(--c-primary-low) 20%, rgba(255, 255, 255, 0) 80%);
}

.imagem { width: 100%; max-width: 560px; margin-top: -40px; margin-bottom: 8px; }

.info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 40px 24px;
}

.categoria { font: 700 16px/24px var(--font); color: var(--c-text); }

.destaques {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
  font: 400 12px/19.2px var(--font);
}

.destaques li { display: inline-flex; align-items: center; gap: 8px; }

@media (max-width: 671px) {
  .imagemArea { padding: 0 8px; }
  .imagem { margin-top: -24px; }
  .info { flex-direction: column; padding: 16px; }
}
```

- [ ] **Step 6: ItensDeSerie e ListaComIcones**

`prototipo/src/pages/ModeloPage/ItensDeSerie.tsx`:
```tsx
import { List, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Accordion } from '../../components/ui/Accordion'
import { itensDeSerie } from '../../data/dolphin'
import { normalizar } from '../../lib/texto'
import styles from './ItensDeSerie.module.css'

export function ItensDeSerie() {
  const [busca, setBusca] = useState('')
  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim())
    return itensDeSerie.filter((i) => normalizar(i).includes(termo))
  }, [busca])

  return (
    <Accordion id="itens-de-serie" titulo="Itens de série" icone={<List size={20} />} contador={filtrados.length}>
      <div className={styles.busca}>
        <Search size={20} aria-hidden="true" className={styles.lupa} />
        <input
          type="search"
          aria-label="Pesquise por um item"
          placeholder="Pesquise por um item"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={styles.input}
        />
      </div>
      {filtrados.length > 0 ? (
        <ul className={styles.lista}>
          {filtrados.map((item) => (
            <li key={item} className={styles.linha}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.vazio}>Nenhum item encontrado.</p>
      )}
    </Accordion>
  )
}
```

`prototipo/src/pages/ModeloPage/ItensDeSerie.module.css`:
```css
.busca { position: relative; margin-bottom: 16px; }
.lupa { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--c-icon); }

.input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 48px;
  border: 1px solid var(--c-border-low);
  border-radius: var(--r-main);
  font: 400 16px/24px var(--font);
}

.lista {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 8px 0;
  background: var(--c-bg);
  border-radius: var(--r-soft);
}

.linha {
  padding: 16px;
  border-bottom: 1px solid var(--c-border-low);
  font: 400 14px/21px var(--font);
  color: var(--c-text);
}

.linha:last-child { border-bottom: 0; }

.vazio { padding: 16px; font: 400 14px/21px var(--font); color: var(--c-text-low); }
```

`prototipo/src/pages/ModeloPage/ListaComIcones.tsx`:
```tsx
import { List } from 'lucide-react'
import type { ReactNode } from 'react'
import { Accordion } from '../../components/ui/Accordion'
import { Button } from '../../components/ui/Button'
import type { ItemComIcone } from '../../data/dolphin'
import { rolarParaOrcamento } from '../../lib/rolagem'
import styles from './ListaComIcones.module.css'

interface Props {
  id: string
  titulo: string
  itens: ItemComIcone[]
  variante: 'incluso' | 'adicional'
  rodape: ReactNode
  botao: { rotulo: string; variante: 'outline' | 'outlineDark' }
}

export function ListaComIcones({ id, titulo, itens, variante, rodape, botao }: Props) {
  return (
    <Accordion id={id} titulo={titulo} icone={<List size={20} />}>
      <ul className={styles.lista}>
        {itens.map(({ titulo: t, descricao, negrito, icone: Icone }) => (
          <li key={t} className={styles.item}>
            <span className={variante === 'incluso' ? styles.iconeIncluso : styles.iconeAdicional} aria-hidden="true">
              <Icone size={32} />
            </span>
            <div>
              <h3 className={styles.titulo}>{t}</h3>
              <p className={styles.descricao}>
                {descricao}
                {negrito && (
                  <>
                    {' '}
                    <strong>{negrito}</strong>
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.rodape}>
        <p>{rodape}</p>
        <Button variante={botao.variante} onClick={rolarParaOrcamento}>
          {botao.rotulo}
        </Button>
      </div>
    </Accordion>
  )
}
```

`prototipo/src/pages/ModeloPage/ListaComIcones.module.css`:
```css
.lista { display: flex; flex-direction: column; gap: 40px; }
.item { display: flex; align-items: flex-start; gap: 24px; }

.iconeIncluso,
.iconeAdicional {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--c-primary-low);
  color: var(--c-primary-contrast);
}

.iconeAdicional { background: var(--c-secondary); color: #fff; }

.titulo { font: 700 16px/24px var(--font); color: var(--c-text); }
.descricao { margin-top: 4px; font: 400 14px/21px var(--font); white-space: pre-line; }

.rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 40px;
  font: 400 14px/21px var(--font);
}

@media (max-width: 671px) {
  .item { gap: 16px; }
  .iconeIncluso, .iconeAdicional { width: 56px; height: 56px; }
  .rodape { flex-direction: column; align-items: stretch; }
}
```

- [ ] **Step 7: RelatedCarousel**

`prototipo/src/pages/ModeloPage/RelatedCarousel.tsx`:
```tsx
import { ChevronLeft, ChevronRight, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { MSG_DESATIVADO, useToast } from '../../components/ui/Toast'
import { relacionados } from '../../data/relacionados'
import { asset } from '../../lib/asset'
import styles from './RelatedCarousel.module.css'

export function RelatedCarousel() {
  const toast = useToast()
  const trilho = useRef<HTMLUListElement>(null)
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    const el = trilho.current
    if (!el) return
    const atualizar = () => {
      if (el.clientWidth === 0) return
      const total = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05))
      setTotalPaginas(total)
      setPagina(Math.min(total - 1, Math.round(el.scrollLeft / el.clientWidth)))
    }
    atualizar()
    el.addEventListener('scroll', atualizar, { passive: true })
    window.addEventListener('resize', atualizar)
    return () => {
      el.removeEventListener('scroll', atualizar)
      window.removeEventListener('resize', atualizar)
    }
  }, [])

  const irPara = (p: number) => {
    const el = trilho.current
    el?.scrollTo?.({ left: p * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className={styles.secao} aria-labelledby="relacionados-titulo">
      <h2 id="relacionados-titulo" className={styles.titulo}>
        Conheça outros modelos da categoria Eletrico que podem combinar com o seu perfil.
      </h2>
      <div className={styles.palco}>
        <button
          type="button"
          className={styles.seta}
          aria-label="Modelos anteriores"
          disabled={pagina === 0}
          onClick={() => irPara(pagina - 1)}
        >
          <ChevronLeft size={32} aria-hidden="true" />
        </button>
        <ul ref={trilho} className={styles.trilho}>
          {relacionados.map((m) => (
            <li key={m.versao} className={styles.slide}>
              <article className={styles.card}>
                <div className={styles.imagemArea}>
                  <img src={asset(m.imagem)} alt={`${m.nome} ${m.versao}`} loading="lazy" className={styles.imagem} />
                </div>
                {m.entregaRapida && (
                  <span className={styles.entrega}>
                    <Truck size={16} aria-hidden="true" />
                    Entrega rápida
                  </span>
                )}
                <h3 className={styles.nome}>{m.nome}</h3>
                <p className={styles.versao}>{m.versao}</p>
                <p className={styles.categoria}>{m.categoria}</p>
                <ul className={styles.destaques}>
                  {m.destaques.map(({ rotulo, icone: Icone }) => (
                    <li key={rotulo}>
                      <Icone size={16} aria-hidden="true" />
                      {rotulo}
                    </li>
                  ))}
                </ul>
                <div className={styles.acoes}>
                  <Button variante="outline" larguraTotal onClick={() => toast(MSG_DESATIVADO)}>
                    Tenho Interesse
                  </Button>
                  <Button variante="ghost" larguraTotal onClick={() => toast(MSG_DESATIVADO)}>
                    Ver carro
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={styles.seta}
          aria-label="Próximos modelos"
          disabled={pagina >= totalPaginas - 1}
          onClick={() => irPara(pagina + 1)}
        >
          <ChevronRight size={32} aria-hidden="true" />
        </button>
      </div>
      {totalPaginas > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para a página ${i + 1}`}
              aria-current={i === pagina ? 'true' : undefined}
              className={i === pagina ? styles.dotAtivo : styles.dot}
              onClick={() => irPara(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
```

`prototipo/src/pages/ModeloPage/RelatedCarousel.module.css`:
```css
.secao { padding: 64px 0 32px; }

.titulo {
  max-width: 800px;
  margin: 0 auto 40px;
  text-align: center;
  font: 400 40px/52px var(--font);
  color: var(--c-text);
}

.palco { display: flex; align-items: center; gap: 8px; }

.seta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 48px;
  height: 48px;
  border: 0;
  background: none;
  color: var(--c-icon);
  cursor: pointer;
}

.seta:disabled { opacity: 0.3; cursor: default; }

.trilho {
  display: flex;
  gap: 24px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 40px 0 8px;
}

.trilho::-webkit-scrollbar { display: none; }

.slide { flex: 0 0 calc((100% - 48px) / 3); scroll-snap-align: start; }

.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  border-radius: var(--r-card);
  background: #fff;
}

.imagemArea {
  display: flex;
  justify-content: center;
  border-radius: var(--r-soft);
  background: linear-gradient(180deg, var(--c-primary) 0%, rgba(255, 255, 255, 0) 85%);
  height: 140px;
}

.imagem { width: 100%; height: 170px; object-fit: contain; margin-top: -40px; }

.entrega {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  margin-top: 8px;
  padding: 0 16px 0 8px;
  border-radius: var(--r-pill);
  background: var(--c-primary);
  color: var(--c-primary-contrast);
  font: 500 14px/1 var(--font);
}

.nome { margin-top: 16px; font: 600 20px/28px var(--font); color: var(--c-text); }
.versao { font: 700 16px/24px var(--font); color: var(--c-secondary); }
.categoria { font: 400 12px/160% var(--font); }

.destaques {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin: 12px 0 16px;
  font: 400 12px/160% var(--font);
}

.destaques li { display: inline-flex; align-items: center; gap: 6px; }

.acoes { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }

.dots { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }

.dot,
.dotAtivo {
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--c-border-low);
  cursor: pointer;
}

.dotAtivo { width: 32px; background: var(--c-primary); }

@media (max-width: 1199px) {
  .slide { flex-basis: calc((100% - 24px) / 2); }
}

@media (max-width: 671px) {
  .titulo { font-size: 24px; line-height: 140%; }
  .seta { display: none; }
  .slide { flex-basis: 85%; }
}
```

- [ ] **Step 8: ModeloPage**

`prototipo/src/pages/ModeloPage/ModeloPage.tsx`:
```tsx
import { ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { MSG_DESATIVADO, useToast } from '../../components/ui/Toast'
import { adicionais, inclusoNaAssinatura } from '../../data/dolphin'
import { InicioProvider } from '../../features/mes-de-teste/InicioContext'
import { asset } from '../../lib/asset'
import { Breadcrumb } from './Breadcrumb'
import { ItensDeSerie } from './ItensDeSerie'
import { ListaComIcones } from './ListaComIcones'
import styles from './ModeloPage.module.css'
import { QuoteForm } from './QuoteForm'
import { RelatedCarousel } from './RelatedCarousel'
import { TitleBlock } from './TitleBlock'
import { VehicleCard } from './VehicleCard'

export function ModeloPage() {
  const toast = useToast()
  return (
    <InicioProvider>
      <main className={styles.pagina} style={{ backgroundImage: `url(${asset('assets/decor/linhas.svg')})` }}>
        <div className={styles.container}>
          <Breadcrumb />
          <TitleBlock />
          <div className={styles.colunas}>
            <div className={styles.esquerda}>
              <VehicleCard />
              <ItensDeSerie />
              <ListaComIcones
                id="incluso"
                titulo="Incluso na assinatura"
                itens={inclusoNaAssinatura}
                variante="incluso"
                rodape={
                  <>
                    <strong>Tenha uma assinatura completa, com a confiança Localiza</strong> para você dirigir um carro
                    0km com mais tranquilidade todos os dias.
                  </>
                }
                botao={{ rotulo: 'Quero assinar', variante: 'outline' }}
              />
              <ListaComIcones
                id="adicionais"
                titulo="Adicionais"
                itens={adicionais}
                variante="adicional"
                rodape="Personalize sua assinatura com os adicionais disponíveis e tenha um veículo ainda mais alinhado ao seu estilo de vida e às suas necessidades."
                botao={{ rotulo: 'Solicitar orçamento', variante: 'outlineDark' }}
              />
            </div>
            <aside className={styles.direita} aria-label="Solicitar orçamento">
              <QuoteForm />
            </aside>
          </div>
          <hr className={styles.divisor} />
          <RelatedCarousel />
          <div className={styles.voltar}>
            <Button variante="outlineDark" icone={<ArrowLeft size={20} aria-hidden="true" />} onClick={() => toast(MSG_DESATIVADO)}>
              Voltar para a listagem
            </Button>
          </div>
        </div>
      </main>
    </InicioProvider>
  )
}
```

`prototipo/src/pages/ModeloPage/ModeloPage.module.css`:
```css
.pagina {
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 1600px auto;
}

.container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 24px 16px 64px;
}

.colunas {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 48px;
  margin-top: 64px;
}

.esquerda,
.direita {
  width: 100%;
  max-width: 660px;
  margin: 0 auto;
}

.esquerda {
  background: #fff;
  border-radius: var(--r-card);
  padding-bottom: 8px;
}

.divisor { margin: 64px 0 0; border: 0; border-top: 1px solid var(--c-border-low); }

.voltar { display: flex; justify-content: center; }

@media (min-width: 1200px) {
  .container { padding: 24px 0 64px; }

  .colunas {
    grid-template-columns: 660px 437px;
    justify-content: space-between;
    align-items: start;
  }

  .esquerda,
  .direita { max-width: none; margin: 0; }

  .direita {
    position: sticky;
    top: calc(var(--header-h) + 24px);
  }
}
```

- [ ] **Step 9: Rodar para ver passar**

Run: `npm test -- src/pages/ModeloPage/ModeloPage.test.tsx`
Expected: PASS (5 testes).

Run: `npm test && npm run build`
Expected: tudo verde.

- [ ] **Step 10: Commit**

```bash
git add prototipo/src/data/dolphin.ts prototipo/src/data/relacionados.ts prototipo/src/pages/ModeloPage
git commit -m "feat(prototipo): página do BYD Dolphin com o conteúdo atual da Localiza"
```

---

### Task 11: Layout (barra do protótipo, header, footer, WhatsApp) e App

**Files:**
- Create em `prototipo/src/components/layout/`: `PrototypeBar.tsx`, `Header.tsx`, `Footer.tsx`, `FloatingWhatsApp.tsx`, cada um com `.module.css`
- Modify: `prototipo/src/App.tsx`, `prototipo/src/main.tsx`
- Test: `prototipo/src/App.test.tsx`

**Interfaces:**
- Consumes: `useHashRoute`, `Rota` (Task 6); `useModo` (Task 6); `useToast`, `MSG_DESATIVADO`, `ToastProvider` (Task 6); `ModoProvider` (Task 6); `rolarParaOrcamento` (Task 6); `Button` (Task 8); ícones de marca (Task 8); `ModeloPage` (Task 10); `asset` (Task 1).
- Produces: `PrototypeBar({ rota: Rota })`, `Header({ rota: Rota })`, `Footer()`, `FloatingWhatsApp()`, `App()`.

- [ ] **Step 1: Escrever o teste (falhando)**

`prototipo/src/App.test.tsx`:
```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { renderComProviders } from './test/render'

describe('App', () => {
  it('abre na proposta e o switch alterna para a página atual', async () => {
    const user = userEvent.setup()
    renderComProviders(<App />)
    const chave = screen.getByRole('switch', { name: 'Mostrar proposta' })
    expect(chave).toHaveAttribute('aria-checked', 'true')
    await user.click(chave)
    expect(chave).toHaveAttribute('aria-checked', 'false')
    expect(window.location.search).toBe('?modo=atual')
  })

  it('?modo=atual abre na página atual', () => {
    renderComProviders(<App />, '/?modo=atual')
    expect(screen.getByRole('switch', { name: 'Mostrar proposta' })).toHaveAttribute('aria-checked', 'false')
  })

  it('na proposta, o botão de usuário leva à tela do assinante', async () => {
    const user = userEvent.setup()
    renderComProviders(<App />)
    await user.click(screen.getByRole('button', { name: 'Área do assinante' }))
    expect(window.location.hash).toBe('#/assinante')
  })

  it('no modo atual, o botão de usuário avisa que está desativado', async () => {
    const user = userEvent.setup()
    renderComProviders(<App />, '/?modo=atual')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('status')).toHaveTextContent('Link desativado no protótipo')
  })

  it('tem footer e botão flutuante de consultor', async () => {
    const user = userEvent.setup()
    renderComProviders(<App />)
    expect(screen.getByRole('contentinfo')).toHaveTextContent('A melhor e mais completa solução de carro por assinatura do país.')
    await user.click(screen.getByRole('button', { name: /fale com um consultor/i }))
    expect(screen.getByRole('status')).toHaveTextContent('Link desativado no protótipo')
  })
})
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/App.test.tsx`
Expected: FAIL — `switch` não encontrado (App ainda é o placeholder).

- [ ] **Step 3: PrototypeBar**

`prototipo/src/components/layout/PrototypeBar.tsx`:
```tsx
import type { Rota } from '../../hooks/useHashRoute'
import { useModo } from '../../modo/ModoContext'
import styles from './PrototypeBar.module.css'

export function PrototypeBar({ rota }: { rota: Rota }) {
  const { modo, setModo } = useModo()
  const proposta = modo === 'proposta'
  return (
    <div className={styles.barra} role="region" aria-label="Controles do protótipo">
      <div className={styles.conteudo}>
        <span className={styles.rotulo}>Protótipo · Ideathon Localiza</span>
        {rota === 'modelo' ? (
          <div className={styles.chave}>
            <span className={proposta ? styles.opcao : styles.opcaoAtiva} aria-hidden="true">Página atual</span>
            <button
              type="button"
              role="switch"
              aria-checked={proposta}
              aria-label="Mostrar proposta"
              className={styles.switch}
              onClick={() => setModo(proposta ? 'atual' : 'proposta')}
            >
              <span className={styles.bolinha} />
            </button>
            <span className={proposta ? styles.opcaoAtiva : styles.opcao} aria-hidden="true">Proposta</span>
          </div>
        ) : (
          <a className={styles.link} href="#/">← Página do modelo</a>
        )}
        {rota === 'modelo' && (
          <a className={styles.linkAssinante} href="#/assinante" onClick={() => setModo('proposta')}>
            Tela do assinante (V3B)
          </a>
        )}
      </div>
    </div>
  )
}
```

`prototipo/src/components/layout/PrototypeBar.module.css`:
```css
.barra { background: var(--c-inverse); color: #fff; }

.conteudo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1152px;
  min-height: var(--bar-h);
  margin: 0 auto;
  padding: 0 16px;
  font: 500 13px/1.2 var(--font);
}

.rotulo { opacity: 0.85; }

.chave { display: inline-flex; align-items: center; gap: 10px; }
.opcao { opacity: 0.6; }
.opcaoAtiva { font-weight: 700; }

.switch {
  position: relative;
  width: 44px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--c-border);
  cursor: pointer;
}

.switch[aria-checked='true'] { background: var(--c-primary); }

.bolinha {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.15s ease;
}

.switch[aria-checked='true'] .bolinha { transform: translateX(20px); }

.switch:focus-visible { outline-color: var(--c-primary-lower); }

.link,
.linkAssinante { color: var(--c-primary-lower); }

@media (min-width: 1200px) {
  .conteudo { padding: 0; }
}

@media (max-width: 671px) {
  .rotulo,
  .linkAssinante { display: none; }
  .conteudo { justify-content: center; }
}
```

- [ ] **Step 4: Header**

`prototipo/src/components/layout/Header.tsx`:
```tsx
import { ChevronDown, Menu, User, X } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import type { Rota } from '../../hooks/useHashRoute'
import { asset } from '../../lib/asset'
import { rolarParaOrcamento } from '../../lib/rolagem'
import { useModo } from '../../modo/ModoContext'
import { Button } from '../ui/Button'
import { MSG_DESATIVADO, useToast } from '../ui/Toast'
import styles from './Header.module.css'

const LINKS = ['Carros', 'Comparativo', 'Calcular Assinatura']

export function Header({ rota }: { rota: Rota }) {
  const { modo } = useModo()
  const toast = useToast()
  const [menuAberto, setMenuAberto] = useState(false)

  const desativado = (e: MouseEvent) => {
    e.preventDefault()
    toast(MSG_DESATIVADO)
  }

  const solicitarOrcamento = () => {
    if (rota === 'assinante') window.location.hash = '#/'
    else rolarParaOrcamento()
  }

  const abrirUsuario = () => {
    if (modo === 'proposta') window.location.hash = '#/assinante'
    else toast(MSG_DESATIVADO)
  }

  return (
    <header className={styles.header}>
      <div className={styles.conteudo}>
        <div className={styles.esquerda}>
          <button
            type="button"
            className={styles.hamburger}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls="menu-movel"
            onClick={() => setMenuAberto((a) => !a)}
          >
            {menuAberto ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
          <nav className={styles.nav} aria-label="Principal">
            {LINKS.map((l) => (
              <a key={l} href="#/" className={styles.link} onClick={desativado}>{l}</a>
            ))}
            <a href="#/" className={styles.link} onClick={desativado}>
              Mais <ChevronDown size={16} aria-hidden="true" />
            </a>
          </nav>
        </div>
        <a href="#/" className={styles.logo}>
          <img src={asset('assets/marca/logo-positivo.svg')} alt="Localiza Assinatura" />
        </a>
        <div className={styles.acoes}>
          <Button tamanho="sm" className={styles.cta} onClick={solicitarOrcamento}>
            Solicitar orçamento
          </Button>
          <button
            type="button"
            className={styles.usuario}
            aria-label={modo === 'proposta' ? 'Área do assinante' : 'Entrar'}
            onClick={abrirUsuario}
          >
            <User size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
      {menuAberto && (
        <nav id="menu-movel" className={styles.menuMovel} aria-label="Menu">
          {[...LINKS, 'Mais'].map((l) => (
            <a key={l} href="#/" className={styles.linkMovel} onClick={desativado}>{l}</a>
          ))}
        </nav>
      )}
    </header>
  )
}
```

`prototipo/src/components/layout/Header.module.css`:
```css
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--c-bg);
}

.conteudo {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  max-width: 1152px;
  height: var(--header-h);
  margin: 0 auto;
  padding: 0 16px;
  border-bottom: 1px solid var(--c-border-low);
}

.esquerda { display: flex; align-items: center; }

.hamburger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  background: none;
  color: var(--c-text);
  cursor: pointer;
}

.nav { display: flex; gap: 24px; }

.link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  font: 400 14px/21px var(--font);
  color: var(--c-text);
  text-decoration: none;
}

.logo img { height: 38px; width: auto; }

.acoes { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }

.usuario {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--c-secondary);
  border-radius: var(--r-soft);
  background: #fff;
  color: var(--c-secondary);
  cursor: pointer;
}

.menuMovel {
  display: flex;
  flex-direction: column;
  padding: 8px 16px 16px;
  border-bottom: 1px solid var(--c-border-low);
  background: var(--c-bg);
}

.linkMovel {
  display: flex;
  align-items: center;
  min-height: 44px;
  font: 500 16px/24px var(--font);
  color: var(--c-text);
  text-decoration: none;
}

@media (min-width: 1200px) {
  .conteudo { padding: 0; }
  .menuMovel { display: none; }
}

@media (max-width: 1199px) {
  .conteudo { grid-template-columns: auto auto 1fr; gap: 8px; height: 72px; }
  .hamburger { display: inline-flex; }
  .nav { display: none; }
}

@media (max-width: 479px) {
  .cta { display: none; }
}
```

- [ ] **Step 5: Footer e FloatingWhatsApp**

`prototipo/src/components/layout/Footer.tsx`:
```tsx
import { Cookie, Lock } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { asset } from '../../lib/asset'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YoutubeIcon } from '../icons/Marcas'
import { Button } from '../ui/Button'
import { MSG_DESATIVADO, useToast } from '../ui/Toast'
import styles from './Footer.module.css'

const COLUNAS = [
  { titulo: 'Assinatura', links: ['Carros', 'Comparativo', 'Calcular Assinatura', 'Blog', 'Central de ajuda', 'Benefícios'] },
  { titulo: 'Localiza', links: ['Aluguel de carros', 'Seminovos', 'Aluguel de frotas', 'Carros para aplicativo (Zarp)'] },
]

export function Footer() {
  const toast = useToast()
  const [logoFalhou, setLogoFalhou] = useState(false)
  const desativado = (e: MouseEvent) => {
    e.preventDefault()
    toast(MSG_DESATIVADO)
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.conteudo}>
        <div className={styles.marca}>
          <img
            src={asset(logoFalhou ? 'assets/marca/logo-positivo.svg' : 'assets/marca/logo-negativo.svg')}
            alt="Localiza Assinatura"
            className={logoFalhou ? styles.logoInvertido : styles.logo}
            onError={() => setLogoFalhou(true)}
          />
          <p className={styles.tagline}>A melhor e mais completa solução de carro por assinatura do país.</p>
        </div>
        {COLUNAS.map((c) => (
          <nav key={c.titulo} aria-label={c.titulo}>
            <h2 className={styles.tituloColuna}>{c.titulo}</h2>
            <ul className={styles.links}>
              {c.links.map((l) => (
                <li key={l}><a href="#/" onClick={desativado}>{l}</a></li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className={styles.tituloColuna}>Contatos</h2>
          <Button variante="secondary" tamanho="sm" icone={<WhatsAppIcon size={20} />} onClick={() => toast(MSG_DESATIVADO)}>
            Atendimento Whatsapp
          </Button>
          <ul className={styles.contatos}>
            <li>Whatsapp: <strong>31 3003-4774</strong></li>
            <li>Central de vendas: <strong>0800 979 3003</strong></li>
            <li>Central de atendimento: <strong>0800 099 1001</strong></li>
          </ul>
        </div>
      </div>
      <div className={styles.barra}>
        <div className={styles.barraEsquerda}>
          <span>© Localiza - Todos os direitos reservados.</span>
          <a href="#/" onClick={desativado}><strong>Aviso de privacidade</strong></a>
          <a href="#/" onClick={desativado} className={styles.cookies}>
            <Cookie size={16} aria-hidden="true" /> Preferências de Cookies
          </a>
        </div>
        <div className={styles.barraDireita}>
          <span className={styles.seguro}>
            <Lock size={16} aria-hidden="true" /> Site seguro — Proteção e criptografia garantidos
          </span>
          <a href="#/" onClick={desativado} aria-label="Instagram"><InstagramIcon /></a>
          <a href="#/" onClick={desativado} aria-label="Facebook"><FacebookIcon /></a>
          <a href="#/" onClick={desativado} aria-label="YouTube"><YoutubeIcon /></a>
        </div>
      </div>
    </footer>
  )
}
```

`prototipo/src/components/layout/Footer.module.css`:
```css
.footer {
  background: var(--c-secondary-dark);
  color: #fff;
  padding: 80px 16px 32px;
}

.conteudo {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 32px;
  max-width: 1152px;
  margin: 0 auto;
}

.logo { height: 38px; width: auto; }
.logoInvertido { height: 38px; width: auto; filter: brightness(0) invert(1); }

.tagline { margin-top: 16px; max-width: 260px; font: 600 16px/24px var(--font); color: var(--c-primary); }

.tituloColuna { margin-bottom: 16px; font: 700 14px/21px var(--font); color: var(--c-primary); }

.links { display: flex; flex-direction: column; gap: 12px; }

.links a,
.barra a { color: #fff; text-decoration: none; font: 400 14px/21px var(--font); }

.contatos { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; font: 400 14px/21px var(--font); }

.barra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1152px;
  margin: 48px auto 0;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  font: 400 12px/160% var(--font);
}

.barraEsquerda,
.barraDireita { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }

.cookies { display: inline-flex; align-items: center; gap: 6px; }

.seguro {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--r-pill);
  background: var(--c-secondary);
}

.barraDireita a { display: inline-flex; color: var(--c-primary); }

@media (max-width: 1199px) {
  .conteudo { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 671px) {
  .footer { padding: 48px 16px 96px; }
  .conteudo { grid-template-columns: 1fr; }
}
```

`prototipo/src/components/layout/FloatingWhatsApp.tsx`:
```tsx
import { WhatsAppIcon } from '../icons/Marcas'
import { MSG_DESATIVADO, useToast } from '../ui/Toast'
import styles from './FloatingWhatsApp.module.css'

export function FloatingWhatsApp() {
  const toast = useToast()
  return (
    <button type="button" className={styles.botao} onClick={() => toast(MSG_DESATIVADO)}>
      <WhatsAppIcon size={24} />
      <span className={styles.rotulo}>Fale com um consultor</span>
      <span className={styles.badge} aria-label="1 nova mensagem">1</span>
    </button>
  )
}
```

`prototipo/src/components/layout/FloatingWhatsApp.module.css`:
```css
.botao {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 256px;
  height: 56px;
  border: 0;
  border-radius: var(--r-soft);
  background: var(--c-secondary);
  color: #fff;
  font: 600 16px/24px var(--font);
  box-shadow: var(--shadow-high);
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--c-critical);
  color: #fff;
  font: 700 12px/1 var(--font);
}

@media (max-width: 671px) {
  .botao { right: 16px; bottom: 16px; width: 56px; }
  .rotulo {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
}
```

- [ ] **Step 6: App e main**

`prototipo/src/App.tsx` (substituir):
```tsx
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { PrototypeBar } from './components/layout/PrototypeBar'
import { useHashRoute } from './hooks/useHashRoute'
import { ModeloPage } from './pages/ModeloPage/ModeloPage'

export function App() {
  const { rota } = useHashRoute()
  return (
    <>
      <PrototypeBar rota={rota} />
      <Header rota={rota} />
      <ModeloPage />
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
```

`prototipo/src/main.tsx` (substituir):
```tsx
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/tokens.css'
import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { ToastProvider } from './components/ui/Toast'
import { ModoProvider } from './modo/ModoContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModoProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ModoProvider>
  </StrictMode>,
)
```

- [ ] **Step 7: Rodar para ver passar**

Run: `npm test && npm run build`
Expected: tudo verde.

- [ ] **Step 8: Commit**

```bash
git add prototipo/src/components/layout prototipo/src/App.tsx prototipo/src/App.test.tsx prototipo/src/main.tsx
git commit -m "feat(prototipo): barra do protótipo, header, footer e botão de consultor"
```

---

### Task 12: Vertente 1 — seção "Mês de teste", chips no título e link `#/?teste=1`

**Files:**
- Create: `prototipo/src/features/mes-de-teste/MesDeTesteSection.tsx` + `.module.css`
- Modify: `prototipo/src/pages/ModeloPage/TitleBlock.tsx`, `prototipo/src/pages/ModeloPage/ModeloPage.tsx`, `prototipo/src/App.tsx`
- Test: `prototipo/src/features/mes-de-teste/MesDeTeste.test.tsx`

**Interfaces:**
- Consumes: `useInicio` (Task 9), `useModo` (Task 6), `limparParamsHash` (Task 6), `rolarPara`, `rolarParaOrcamento` (Task 6), `resumoAvaliacoes` (Task 5), `formatarNota` (Task 1), `Accordion`, `Button`, `VertenteTag` (Task 8).
- Produces: `MesDeTesteSection()` (id `mes-de-teste`); `ModeloPage({ params }: { params: URLSearchParams })` — **assinatura muda**: passa a receber `params`.

- [ ] **Step 1: Escrever os testes (falhando)**

`prototipo/src/features/mes-de-teste/MesDeTeste.test.tsx`:
```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ModeloPage } from '../../pages/ModeloPage/ModeloPage'
import { renderComProviders } from '../../test/render'

const semParams = new URLSearchParams()

describe('Vertente 1 na página do modelo', () => {
  it('proposta mostra chips e a seção com 6 passos', () => {
    renderComProviders(<ModeloPage params={semParams} />)
    expect(screen.getByRole('link', { name: /teste 30 dias antes de assinar/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /4,6 · 128 avaliações/i })).toBeInTheDocument()
    const secao = document.getElementById('mes-de-teste')!
    expect(within(secao).getAllByRole('heading', { level: 3 })).toHaveLength(6)
    expect(within(secao).getByText('Até 73% mais barato')).toBeInTheDocument()
  })

  it('modo atual não mostra chips nem a seção', () => {
    renderComProviders(<ModeloPage params={semParams} />, '/?modo=atual')
    expect(screen.queryByRole('link', { name: /teste 30 dias/i })).not.toBeInTheDocument()
    expect(document.getElementById('mes-de-teste')).toBeNull()
  })

  it('"Quero testar por 30 dias" marca a opção no formulário', async () => {
    const user = userEvent.setup()
    renderComProviders(<ModeloPage params={semParams} />)
    await user.click(screen.getByRole('button', { name: 'Quero testar por 30 dias' }))
    expect(screen.getByRole('radio', { name: /mês de teste/i })).toBeChecked()
  })

  it('#/?teste=1 marca o mês de teste e limpa o hash', () => {
    renderComProviders(<ModeloPage params={new URLSearchParams('teste=1')} />, '/#/?teste=1')
    expect(screen.getByRole('radio', { name: /mês de teste/i })).toBeChecked()
    expect(window.location.hash).toBe('#/')
  })

  it('link com ?modo=atual e teste=1 força o modo proposta', () => {
    renderComProviders(<ModeloPage params={new URLSearchParams('teste=1')} />, '/?modo=atual#/?teste=1')
    expect(screen.getByRole('radio', { name: /mês de teste/i })).toBeChecked()
    expect(window.location.search).toBe('?modo=proposta')
  })
})
```

Atualize também `prototipo/src/pages/ModeloPage/ModeloPage.test.tsx`: troque todas as ocorrências de `<ModeloPage />` por `<ModeloPage params={new URLSearchParams()} />`.

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/features/mes-de-teste`
Expected: FAIL — chips e seção não existem; erro de tipo em `params` é ignorado pelo Vitest, mas os asserts falham.

- [ ] **Step 3: Implementar a seção**

`prototipo/src/features/mes-de-teste/MesDeTesteSection.tsx`:
```tsx
import { CalendarCheck, Car, Headset, KeyRound, MessageCircle, Signature } from 'lucide-react'
import { Accordion } from '../../components/ui/Accordion'
import { Button } from '../../components/ui/Button'
import { VertenteTag } from '../../components/ui/VertenteTag'
import { useInicio } from './InicioContext'
import styles from './MesDeTesteSection.module.css'

const PASSOS = [
  { titulo: 'Interesse', texto: 'Você escolhe a configuração do 0 km com um consultor.', icone: MessageCircle },
  { titulo: 'Crédito e contrato', texto: 'Com cláusula de desistência sem multa.', icone: Signature },
  { titulo: 'Retirada', texto: 'Um carro do mesmo modelo na frota de aluguel.', icone: KeyRound },
  { titulo: 'Apoio', texto: 'Tutorial de recarga, mapa de eletropostos e contatos nos dias 3, 15 e 25.', icone: Headset },
  { titulo: 'Decisão', texto: 'Você decide até o dia 25.', icone: CalendarCheck },
  { titulo: 'Resultado', texto: 'Chega o 0 km (o carro de teste fica com você até a entrega) ou você devolve sem multa.', icone: Car },
]

export function MesDeTesteSection() {
  const { escolherTesteERolar } = useInicio()
  return (
    <Accordion
      id="mes-de-teste"
      titulo="Mês de teste: experimente antes de assinar"
      icone={<CalendarCheck size={20} />}
      tag={<VertenteTag n={1} />}
    >
      <ol className={styles.linhaDoTempo}>
        {PASSOS.map(({ titulo, texto, icone: Icone }, i) => (
          <li key={titulo} className={styles.passo}>
            <span className={styles.marcador} aria-hidden="true">
              <Icone size={20} />
            </span>
            <div>
              <h3 className={styles.titulo}>
                {i + 1}. {titulo}
              </h3>
              <p className={styles.texto}>{texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.destaque}>
        <p className={styles.destaqueNumero}>Até 73% mais barato</p>
        <p>
          que alugar um elétrico por 30 dias. Você paga só a 1ª mensalidade do plano escolhido, e ela já conta no
          contrato.
        </p>
        <p className={styles.fonte}>Comparação com diárias de aluguel de elétricos coletadas em maio de 2026 (Ekko Green).</p>
      </div>

      <ul className={styles.regras}>
        <li>Vale uma vez por CPF.</li>
        <li>A franquia de km é a mesma do plano escolhido.</li>
        <li>O mês de teste conta no prazo do contrato.</li>
      </ul>

      <Button onClick={escolherTesteERolar}>Quero testar por 30 dias</Button>
    </Accordion>
  )
}
```

`prototipo/src/features/mes-de-teste/MesDeTesteSection.module.css`:
```css
.linhaDoTempo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 16px;
  counter-reset: none;
}

.passo { display: flex; gap: 12px; align-items: flex-start; }

.marcador {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--c-primary-low);
  color: var(--c-primary-contrast);
}

.titulo { font: 700 14px/21px var(--font); color: var(--c-text-high); }
.texto { font: 400 14px/21px var(--font); }

.destaque {
  margin-top: 32px;
  padding: 24px;
  border-radius: var(--r-soft);
  background: var(--c-primary-lower);
  color: var(--c-primary-contrast);
  font: 400 14px/21px var(--font);
}

.destaqueNumero { font: 700 24px/33.6px var(--font); }
.fonte { margin-top: 8px; font: 400 12px/160% var(--font); color: var(--c-text-low); }

.regras {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 16px 0 24px;
  padding-left: 18px;
  list-style: disc;
  font: 400 12px/160% var(--font);
  color: var(--c-text-low);
}

@media (max-width: 671px) {
  .linhaDoTempo {
    grid-template-columns: 1fr;
    gap: 0;
    border-left: 2px solid var(--c-primary-low);
    margin-left: 19px;
  }
  .passo { margin-left: -21px; padding-bottom: 20px; }
}
```

- [ ] **Step 4: Chips no TitleBlock**

`prototipo/src/pages/ModeloPage/TitleBlock.tsx` (substituir):
```tsx
import { CalendarCheck, Star } from 'lucide-react'
import type { MouseEvent } from 'react'
import { resumoAvaliacoes } from '../../data/avaliacoes'
import { dolphin } from '../../data/dolphin'
import { formatarNota } from '../../lib/formato'
import { rolarPara } from '../../lib/rolagem'
import { useModo } from '../../modo/ModoContext'
import styles from './TitleBlock.module.css'

function irPara(id: string) {
  return (e: MouseEvent) => {
    e.preventDefault()
    rolarPara(id)
  }
}

export function TitleBlock() {
  const { modo } = useModo()
  return (
    <div className={styles.bloco}>
      <p className={styles.nota}>Imagens ilustrativas</p>
      <h1 className={styles.titulo}>{dolphin.nome}</h1>
      <p className={styles.versao}>{dolphin.versao}</p>
      {modo === 'proposta' && (
        <div className={styles.chips}>
          <a href="#avaliacoes" className={styles.chip} onClick={irPara('avaliacoes')}>
            <Star size={16} aria-hidden="true" className={styles.estrela} />
            {formatarNota(resumoAvaliacoes.media)} · {resumoAvaliacoes.total} avaliações
          </a>
          <a href="#mes-de-teste" className={styles.chip} onClick={irPara('mes-de-teste')}>
            <CalendarCheck size={16} aria-hidden="true" className={styles.chipIcone} />
            Teste 30 dias antes de assinar
          </a>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: ModeloPage recebe `params` e mostra a seção**

Em `prototipo/src/pages/ModeloPage/ModeloPage.tsx`:

1. Troque os imports do topo por:
```tsx
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { MSG_DESATIVADO, useToast } from '../../components/ui/Toast'
import { adicionais, inclusoNaAssinatura } from '../../data/dolphin'
import { InicioProvider, useInicio } from '../../features/mes-de-teste/InicioContext'
import { MesDeTesteSection } from '../../features/mes-de-teste/MesDeTesteSection'
import { limparParamsHash } from '../../hooks/useHashRoute'
import { asset } from '../../lib/asset'
import { rolarParaOrcamento } from '../../lib/rolagem'
import { useModo } from '../../modo/ModoContext'
import { Breadcrumb } from './Breadcrumb'
import { ItensDeSerie } from './ItensDeSerie'
import { ListaComIcones } from './ListaComIcones'
import styles from './ModeloPage.module.css'
import { QuoteForm } from './QuoteForm'
import { RelatedCarousel } from './RelatedCarousel'
import { TitleBlock } from './TitleBlock'
import { VehicleCard } from './VehicleCard'

function AplicarParametroTeste({ params }: { params: URLSearchParams }) {
  const { setInicio } = useInicio()
  const { setModo } = useModo()
  useEffect(() => {
    if (params.get('teste') === '1') {
      setModo('proposta')
      setInicio('teste')
      limparParamsHash()
      rolarParaOrcamento()
    } else {
      window.scrollTo(0, 0)
    }
  }, [params, setInicio, setModo])
  return null
}
```

2. Troque o início do componente:
```tsx
export function ModeloPage() {
  const toast = useToast()
  return (
    <InicioProvider>
      <main
```
por:
```tsx
export function ModeloPage({ params }: { params: URLSearchParams }) {
  const toast = useToast()
  const { modo } = useModo()
  const proposta = modo === 'proposta'
  return (
    <InicioProvider>
      <AplicarParametroTeste params={params} />
      <main
```

3. Troque `              <ItensDeSerie />` por:
```tsx
              <ItensDeSerie />
              {proposta && <MesDeTesteSection />}
```

`prototipo/src/App.tsx`: troque `const { rota } = useHashRoute()` por `const { rota, params } = useHashRoute()` e `<ModeloPage />` por `<ModeloPage params={params} />`.

- [ ] **Step 6: Rodar para ver passar**

Run: `npm test && npm run build`
Expected: tudo verde (incluindo `ModeloPage.test.tsx` com `params`).

- [ ] **Step 7: Commit**

```bash
git add prototipo/src
git commit -m "feat(prototipo): vertente 1 — seção do mês de teste, chips e link direto para o teste"
```

---

### Task 13: Vertente 3A — dados reais da frota e simulador de economia

**Files:**
- Create em `prototipo/src/features/telemetria/`: `DadosFrotaSection.tsx`, `FatoCard.tsx`, `SaudeBateriaChart.tsx`, `SimuladorEconomia.tsx`, com `.module.css` (`DadosFrotaSection.module.css` também serve `FatoCard`; `SimuladorEconomia.module.css`; `SaudeBateriaChart.module.css`)
- Modify: `prototipo/src/pages/ModeloPage/ModeloPage.tsx`
- Test: `prototipo/src/features/telemetria/telemetria.test.tsx`

**Interfaces:**
- Consumes: `fatosFrota`, `PontoSaude`, `tarifas`, `PRECO_GASOLINA`, `EFICIENCIA_DOLPHIN` (Task 3); `custoKmCombustao`, `custoKmEletrico`, `economiaEnergiaMensal` (Task 2); `PerfilRecarga` (Task 3); `formatarNumero`, `formatarReais`, `formatarReaisCentavos` (Task 1); `Accordion`, `VertenteTag`, `SegmentedCards`, `CampoTexto` (Task 8).
- Produces: `DadosFrotaSection()` (id `dados-frota`), `SimuladorEconomia()`, `SaudeBateriaChart({ pontos: PontoSaude[] })`, `FatoCard({ pergunta: string; icone: LucideIcon; children: ReactNode })`.

- [ ] **Step 1: Escrever os testes (falhando)**

`prototipo/src/features/telemetria/telemetria.test.tsx`:
```tsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { fatosFrota } from '../../data/telemetria'
import { DadosFrotaSection } from './DadosFrotaSection'
import { SaudeBateriaChart } from './SaudeBateriaChart'
import { SimuladorEconomia } from './SimuladorEconomia'

describe('DadosFrotaSection', () => {
  it('mostra as 5 dúvidas, a base de dados e a tag da vertente', () => {
    render(<DadosFrotaSection />)
    const secao = document.getElementById('dados-frota')!
    const perguntas = [
      'O carro chega aonde eu preciso?',
      'A bateria vai estragar?',
      'Vou economizar de verdade?',
      'Vou ficar sem carga no dia a dia?',
      'Recarregar vai tomar meu tempo?',
    ]
    for (const p of perguntas) {
      expect(within(secao).getByRole('heading', { level: 3, name: p })).toBeInTheDocument()
    }
    expect(within(secao).getByText(/412 BYD Dolphin da frota Localiza/)).toBeInTheDocument()
    expect(within(secao).getByText('Vertente 3 · Telemetria')).toBeInTheDocument()
  })
})

describe('SaudeBateriaChart', () => {
  it('descreve os pontos no rótulo acessível', () => {
    render(<SaudeBateriaChart pontos={fatosFrota.saudeBateria} />)
    expect(screen.getByRole('img', { name: /24 meses: 96%/ })).toBeInTheDocument()
  })
})

describe('SimuladorEconomia', () => {
  it('padrão (2.000 km, 12 km/l, casa) economiza R$ 740/mês', () => {
    render(<SimuladorEconomia />)
    expect(screen.getByText('R$ 740/mês')).toBeInTheDocument()
    expect(screen.getByText('R$ 8.880/ano')).toBeInTheDocument()
  })

  it('recarga na rua reduz para R$ 340/mês', async () => {
    const user = userEvent.setup()
    render(<SimuladorEconomia />)
    await user.click(screen.getByRole('radio', { name: 'Rua' }))
    expect(screen.getByText('R$ 340/mês')).toBeInTheDocument()
  })

  it('carro muito econômico + rua: avisa que não compensa', async () => {
    const user = userEvent.setup()
    render(<SimuladorEconomia />)
    const consumo = screen.getByLabelText('Consumo do seu carro atual (km/l)')
    await user.clear(consumo)
    await user.type(consumo, '20')
    await user.click(screen.getByRole('radio', { name: 'Rua' }))
    expect(screen.getByText(/a energia não sai mais barata/i)).toBeInTheDocument()
  })

  it('slider de km atualiza o valor', () => {
    render(<SimuladorEconomia />)
    fireEvent.change(screen.getByLabelText(/km por mês/i), { target: { value: '1000' } })
    expect(screen.getByText('R$ 370/mês')).toBeInTheDocument()
  })

  it.each(['', '0', 'abc', '25'])('consumo inválido "%s" mostra erro e nunca NaN', async (valor) => {
    const user = userEvent.setup()
    render(<SimuladorEconomia />)
    const consumo = screen.getByLabelText('Consumo do seu carro atual (km/l)')
    await user.clear(consumo)
    if (valor) await user.type(consumo, valor)
    expect(screen.getByText('Informe um consumo entre 6 e 20 km/l.')).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/NaN|Infinity/)
  })

  it('aceita vírgula decimal', async () => {
    const user = userEvent.setup()
    render(<SimuladorEconomia />)
    const consumo = screen.getByLabelText('Consumo do seu carro atual (km/l)')
    await user.clear(consumo)
    await user.type(consumo, '12,5')
    expect(screen.queryByText('Informe um consumo entre 6 e 20 km/l.')).not.toBeInTheDocument()
    expect(screen.getByText('R$ 700/mês')).toBeInTheDocument()
  })
})
```

Conta do último caso: 6 ÷ 12,5 = 0,48 → 2.000 × (0,48 − 0,13) = R$ 700.

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/features/telemetria`
Expected: FAIL — imports não resolvidos.

- [ ] **Step 3: FatoCard e SaudeBateriaChart**

`prototipo/src/features/telemetria/FatoCard.tsx`:
```tsx
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './DadosFrotaSection.module.css'

interface Props {
  pergunta: string
  icone: LucideIcon
  children: ReactNode
}

export function FatoCard({ pergunta, icone: Icone, children }: Props) {
  return (
    <div className={styles.fato}>
      <h3 className={styles.pergunta}>
        <Icone size={20} aria-hidden="true" className={styles.iconeFato} />
        {pergunta}
      </h3>
      <div className={styles.resposta}>{children}</div>
    </div>
  )
}
```

`prototipo/src/features/telemetria/SaudeBateriaChart.tsx`:
```tsx
import type { PontoSaude } from '../../data/telemetria'
import styles from './SaudeBateriaChart.module.css'

const LARGURA = 260
const ALTURA = 96
const MARGEM = 12
const BASE_GRAFICO = 68
const PCT_MIN = 94
const PCT_MAX = 100

export function SaudeBateriaChart({ pontos }: { pontos: PontoSaude[] }) {
  const ultimoMes = pontos[pontos.length - 1]?.meses || 1
  const x = (meses: number) => MARGEM + (meses / ultimoMes) * (LARGURA - 2 * MARGEM)
  const y = (pct: number) => MARGEM + ((PCT_MAX - pct) / (PCT_MAX - PCT_MIN)) * (BASE_GRAFICO - MARGEM)
  const caminho = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.meses).toFixed(1)},${y(p.pct).toFixed(1)}`).join(' ')
  const descricao = pontos.map((p) => `${p.meses} meses: ${p.pct}%`).join('; ')

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      className={styles.grafico}
      role="img"
      aria-label={`Saúde média da bateria ao longo do tempo. ${descricao}`}
    >
      <line x1={MARGEM} x2={LARGURA - MARGEM} y1={BASE_GRAFICO} y2={BASE_GRAFICO} className={styles.eixo} />
      <path d={caminho} className={styles.linha} />
      {pontos.map((p) => (
        <g key={p.meses}>
          <circle cx={x(p.meses)} cy={y(p.pct)} r={3.5} className={styles.ponto} />
          <text x={x(p.meses)} y={y(p.pct) - 8} textAnchor="middle" className={styles.valor}>{p.pct}%</text>
          <text x={x(p.meses)} y={ALTURA - 8} textAnchor="middle" className={styles.rotulo}>{p.meses}m</text>
        </g>
      ))}
    </svg>
  )
}
```

`prototipo/src/features/telemetria/SaudeBateriaChart.module.css`:
```css
.grafico { width: 100%; max-width: 320px; height: auto; margin-top: 8px; }
.eixo { stroke: var(--c-border-low); stroke-width: 1; }
.linha { fill: none; stroke: var(--c-secondary); stroke-width: 2; }
.ponto { fill: var(--c-secondary); }
.valor { font: 600 10px var(--font); fill: var(--c-text-high); }
.rotulo { font: 400 10px var(--font); fill: var(--c-text-low); }
```

- [ ] **Step 4: SimuladorEconomia**

`prototipo/src/features/telemetria/SimuladorEconomia.tsx`:
```tsx
import { useState } from 'react'
import { CampoTexto } from '../../components/ui/Campos'
import { SegmentedCards } from '../../components/ui/SegmentedCards'
import { EFICIENCIA_DOLPHIN, PRECO_GASOLINA, tarifas } from '../../data/telemetria'
import { custoKmCombustao, custoKmEletrico, economiaEnergiaMensal } from '../../lib/economia'
import { formatarNumero, formatarReais, formatarReaisCentavos } from '../../lib/formato'
import type { PerfilRecarga } from '../../lib/recomendacao'
import styles from './SimuladorEconomia.module.css'

const CONSUMO_MIN = 6
const CONSUMO_MAX = 20

export function lerConsumo(texto: string): number | null {
  const limpo = texto.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(limpo)) return null
  const valor = Number(limpo)
  return valor >= CONSUMO_MIN && valor <= CONSUMO_MAX ? valor : null
}

export function SimuladorEconomia() {
  const [kmMes, setKmMes] = useState(2000)
  const [consumoTexto, setConsumoTexto] = useState('12')
  const [recarga, setRecarga] = useState<PerfilRecarga>('casa')

  const consumo = lerConsumo(consumoTexto)
  const economia =
    consumo === null
      ? null
      : economiaEnergiaMensal(
          kmMes,
          custoKmCombustao(PRECO_GASOLINA, consumo),
          custoKmEletrico(tarifas[recarga], EFICIENCIA_DOLPHIN),
        )

  return (
    <section className={styles.simulador} aria-labelledby="simulador-titulo">
      <h3 id="simulador-titulo" className={styles.titulo}>Quanto você economizaria com energia?</h3>

      <div className={styles.campos}>
        <div className={styles.slider}>
          <label htmlFor="sim-km" className={styles.rotulo}>
            km por mês <output htmlFor="sim-km" className={styles.valorSlider}>{formatarNumero(kmMes)} km</output>
          </label>
          <input
            id="sim-km"
            type="range"
            min={500}
            max={4000}
            step={100}
            value={kmMes}
            onChange={(e) => setKmMes(Number(e.target.value))}
          />
        </div>

        <CampoTexto
          id="sim-consumo"
          rotulo="Consumo do seu carro atual (km/l)"
          inputMode="decimal"
          value={consumoTexto}
          onChange={(e) => setConsumoTexto(e.target.value)}
          erro={consumo === null ? `Informe um consumo entre ${CONSUMO_MIN} e ${CONSUMO_MAX} km/l.` : undefined}
        />

        <SegmentedCards
          nome="sim-recarga"
          rotulo="Onde você recarregaria?"
          compacto
          valor={recarga}
          onChange={setRecarga}
          opcoes={[
            { valor: 'casa', titulo: 'Casa' },
            { valor: 'trabalho', titulo: 'Trabalho' },
            { valor: 'rua', titulo: 'Rua' },
          ]}
        />
      </div>

      <div className={styles.resultado} aria-live="polite">
        {economia !== null &&
          (economia > 0 ? (
            <>
              <p className={styles.rotuloResultado}>Economia estimada</p>
              <p className={styles.valor}>{formatarReais(economia)}/mês</p>
              <p className={styles.ano}>{formatarReais(economia * 12)}/ano</p>
            </>
          ) : (
            <p>Com esse perfil, a energia não sai mais barata que a gasolina.</p>
          ))}
      </div>

      <details className={styles.premissas}>
        <summary>Ver premissas</summary>
        <ul>
          <li>Gasolina: {formatarReaisCentavos(PRECO_GASOLINA)}/l</li>
          <li>Energia residencial: {formatarReaisCentavos(tarifas.casa)}/kWh</li>
          <li>Recarga no trabalho: {formatarReaisCentavos(tarifas.trabalho)}/kWh (ilustrativo)</li>
          <li>Recarga pública: {formatarReaisCentavos(tarifas.rua)}/kWh (ilustrativo)</li>
          <li>Eficiência do BYD Dolphin: {EFICIENCIA_DOLPHIN} km/kWh</li>
        </ul>
      </details>

      <a href="#/assinante" className={styles.link}>
        Já é assinante de carro a combustão? Veja sua recomendação →
      </a>
    </section>
  )
}
```

`prototipo/src/features/telemetria/SimuladorEconomia.module.css`:
```css
.simulador {
  margin-top: 32px;
  padding: 24px;
  border-radius: var(--r-soft);
  background: var(--c-bg);
}

.titulo { font: 700 20px/28px var(--font); color: var(--c-text-high); }

.campos { display: flex; flex-direction: column; gap: 20px; margin-top: 16px; }

.slider { display: flex; flex-direction: column; gap: 8px; }
.slider input { width: 100%; accent-color: var(--c-secondary); min-height: 44px; }

.rotulo {
  display: flex;
  justify-content: space-between;
  font: 600 16px/24px var(--font);
  color: var(--c-text);
}

.valorSlider { font-weight: 700; color: var(--c-secondary); }

.resultado {
  margin-top: 24px;
  padding: 20px;
  border-radius: var(--r-soft);
  background: #fff;
  min-height: 72px;
}

.rotuloResultado { font: 400 14px/21px var(--font); }
.valor { font: 700 32px/130% var(--font); color: var(--c-secondary); }
.ano { font: 600 16px/24px var(--font); }

.premissas { margin-top: 16px; font: 400 12px/160% var(--font); color: var(--c-text-low); }
.premissas summary { cursor: pointer; min-height: 44px; display: flex; align-items: center; font-weight: 600; }
.premissas ul { list-style: disc; padding-left: 18px; }

.link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 8px;
  font: 600 14px/21px var(--font);
  color: var(--c-secondary);
}

@media (max-width: 671px) {
  .simulador { padding: 16px; }
}
```

- [ ] **Step 5: DadosFrotaSection**

`prototipo/src/features/telemetria/DadosFrotaSection.tsx`:
```tsx
import { BatteryCharging, BatteryFull, Gauge, HandCoins, PlugZap, Route } from 'lucide-react'
import { Accordion } from '../../components/ui/Accordion'
import { VertenteTag } from '../../components/ui/VertenteTag'
import { fatosFrota } from '../../data/telemetria'
import styles from './DadosFrotaSection.module.css'
import { FatoCard } from './FatoCard'
import { SaudeBateriaChart } from './SaudeBateriaChart'
import { SimuladorEconomia } from './SimuladorEconomia'

export function DadosFrotaSection() {
  const f = fatosFrota
  const ultimo = f.saudeBateria[f.saudeBateria.length - 1]
  return (
    <Accordion id="dados-frota" titulo="Dados reais da frota Localiza" icone={<Gauge size={20} />} tag={<VertenteTag n={3} />}>
      <div className={styles.grade}>
        <FatoCard pergunta="O carro chega aonde eu preciso?" icone={Route}>
          <p className={styles.duplo}>
            <span><strong className={styles.numero}>{f.autonomiaCidadeKm} km</strong> na cidade</span>
            <span><strong className={styles.numero}>{f.autonomiaEstradaKm} km</strong> na estrada</span>
          </p>
          <p className={styles.legenda}>Autonomia real média</p>
        </FatoCard>
        <FatoCard pergunta="A bateria vai estragar?" icone={BatteryFull}>
          <p><strong className={styles.numero}>{ultimo.pct}%</strong> de saúde média após {ultimo.meses} meses</p>
          <SaudeBateriaChart pontos={f.saudeBateria} />
        </FatoCard>
        <FatoCard pergunta="Vou economizar de verdade?" icone={HandCoins}>
          <p><strong className={styles.numero}>{f.reducaoCustoKmPct}% menor</strong></p>
          <p className={styles.legenda}>custo por km em energia, comparado à gasolina</p>
        </FatoCard>
        <FatoCard pergunta="Vou ficar sem carga no dia a dia?" icone={BatteryCharging}>
          <p><strong className={styles.numero}>{f.diasAbaixoAutonomiaPct}% dos dias</strong></p>
          <p className={styles.legenda}>os assinantes rodaram menos que a autonomia</p>
        </FatoCard>
        <FatoCard pergunta="Recarregar vai tomar meu tempo?" icone={PlugZap}>
          <p><strong className={styles.numero}>~{f.recargasPorSemana}× por semana</strong></p>
          <p className={styles.legenda}>é quanto recarrega um assinante típico</p>
        </FatoCard>
      </div>
      <p className={styles.base}>
        Base: {f.baseCarros} BYD Dolphin da frota Localiza · {f.periodo} · dados agregados e anônimos · valores
        ilustrativos do protótipo.
      </p>
      <SimuladorEconomia />
    </Accordion>
  )
}
```

`prototipo/src/features/telemetria/DadosFrotaSection.module.css`:
```css
.grade { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.fato {
  padding: 20px;
  border: 1px solid var(--c-paper-border);
  border-radius: var(--r-soft);
  background: #fff;
}

.pergunta {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font: 700 16px/24px var(--font);
  color: var(--c-text-high);
}

.iconeFato { flex: none; margin-top: 2px; color: var(--c-secondary); }

.resposta { margin-top: 12px; font: 400 14px/21px var(--font); }

.numero { font: 700 24px/33.6px var(--font); color: var(--c-secondary); }

.duplo { display: flex; flex-wrap: wrap; gap: 4px 16px; }

.legenda { color: var(--c-text-low); }

.base { margin-top: 16px; font: 400 12px/160% var(--font); color: var(--c-text-low); }

@media (max-width: 671px) {
  .grade { grid-template-columns: 1fr; }
}
```

- [ ] **Step 6: Encaixar na página**

Em `prototipo/src/pages/ModeloPage/ModeloPage.tsx`:

1. Adicione o import (junto dos outros de `features`):
```tsx
import { DadosFrotaSection } from '../../features/telemetria/DadosFrotaSection'
```

2. Troque:
```tsx
              {proposta && <MesDeTesteSection />}
```
por:
```tsx
              {proposta && <DadosFrotaSection />}
              {proposta && <MesDeTesteSection />}
```

- [ ] **Step 7: Rodar para ver passar**

Run: `npm test && npm run build`
Expected: tudo verde.

- [ ] **Step 8: Commit**

```bash
git add prototipo/src
git commit -m "feat(prototipo): vertente 3A — dados reais da frota e simulador de economia"
```

---

### Task 14: Vertente 2 — avaliações de assinantes

**Files:**
- Create em `prototipo/src/features/avaliacoes/`: `AvaliacoesSection.tsx`, `ResumoNotas.tsx`, `FiltrosPerfil.tsx`, `AvaliacaoCard.tsx`, cada um com `.module.css`
- Modify: `prototipo/src/pages/ModeloPage/ModeloPage.tsx`
- Test: `prototipo/src/features/avaliacoes/AvaliacoesSection.test.tsx`

**Interfaces:**
- Consumes: `avaliacoes`, `resumoAvaliacoes`, `ResumoAvaliacoes` (Task 5); `filtrarAvaliacoes`, `ordenarRecentes`, `alternarFiltro`, `temFiltroAtivo`, `FILTROS_VAZIOS`, tipos `Avaliacao`, `FiltrosAvaliacao`, `TipoAvaliador` (Task 5); `formatarNota`, `formatarData` (Task 1); `Accordion`, `Button`, `Chip`, `Estrelas`, `VertenteTag` (Task 8).
- Produces: `AvaliacoesSection()` (id `avaliacoes`), `ResumoNotas({ resumo })`, `FiltrosPerfil({ filtros, onAlternar })`, `AvaliacaoCard({ avaliacao })`.

- [ ] **Step 1: Escrever o teste (falhando)**

`prototipo/src/features/avaliacoes/AvaliacoesSection.test.tsx`:
```tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AvaliacoesSection } from './AvaliacoesSection'

const cards = () => screen.queryAllByRole('article')

describe('AvaliacoesSection', () => {
  it('mostra resumo, 3 avaliações e o contador', () => {
    render(<AvaliacoesSection />)
    expect(screen.getByText('128 avaliações verificadas')).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: 'Nota 4,6 de 5' })[0]).toBeInTheDocument()
    expect(cards()).toHaveLength(3)
    expect(screen.getByText('Mostrando 3 de 10')).toBeInTheDocument()
  })

  it('"Ver mais" adiciona 3 por clique até acabar', async () => {
    const user = userEvent.setup()
    render(<AvaliacoesSection />)
    await user.click(screen.getByRole('button', { name: 'Ver mais avaliações' }))
    expect(cards()).toHaveLength(6)
    await user.click(screen.getByRole('button', { name: 'Ver mais avaliações' }))
    await user.click(screen.getByRole('button', { name: 'Ver mais avaliações' }))
    expect(cards()).toHaveLength(10)
    expect(screen.queryByRole('button', { name: 'Ver mais avaliações' })).not.toBeInTheDocument()
  })

  it('filtra por tipo e mostra a resposta da Localiza nas negativas', async () => {
    const user = userEvent.setup()
    render(<AvaliacoesSection />)
    await user.click(screen.getByRole('button', { name: 'Cliente em teste' }))
    expect(cards()).toHaveLength(2)
    expect(screen.getByText('Mostrando 2 de 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cliente em teste' }))
    await user.click(screen.getByRole('button', { name: 'Rua' }))
    const comResposta = cards().filter((c) => within(c).queryByText('Resposta da Localiza'))
    expect(comResposta).toHaveLength(1)
  })

  it('filtros que zeram a lista mostram estado vazio e "Limpar filtros" volta ao início', async () => {
    const user = userEvent.setup()
    render(<AvaliacoesSection />)
    await user.click(screen.getByRole('button', { name: 'Ver mais avaliações' }))
    await user.click(screen.getByRole('button', { name: 'Cliente em teste' }))
    await user.click(screen.getByRole('button', { name: 'Rua' }))
    expect(cards()).toHaveLength(0)
    expect(screen.getByText('Ainda não há avaliações com esse perfil.')).toBeInTheDocument()
    expect(screen.queryByText(/^Mostrando/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ver mais avaliações' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(cards()).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Cliente em teste' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('tem nota de transparência', () => {
    render(<AvaliacoesSection />)
    expect(screen.getByText(/Publicamos avaliações positivas e negativas/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/features/avaliacoes`
Expected: FAIL — `Failed to resolve import "./AvaliacoesSection"`.

- [ ] **Step 3: ResumoNotas**

`prototipo/src/features/avaliacoes/ResumoNotas.tsx`:
```tsx
import { Estrelas } from '../../components/ui/Estrelas'
import type { ResumoAvaliacoes } from '../../data/avaliacoes'
import { formatarNota } from '../../lib/formato'
import styles from './ResumoNotas.module.css'

export function ResumoNotas({ resumo }: { resumo: ResumoAvaliacoes }) {
  return (
    <div className={styles.resumo}>
      <div className={styles.geral}>
        <p className={styles.media}>{formatarNota(resumo.media)}</p>
        <Estrelas nota={resumo.media} tamanho={20} />
        <p className={styles.total}>{resumo.total} avaliações verificadas</p>
      </div>
      <ul className={styles.barras} aria-label="Distribuição das notas">
        {resumo.distribuicao.map((d) => (
          <li key={d.estrelas} className={styles.linha}>
            <span className={styles.rotuloCurto}>{d.estrelas}★</span>
            <span className={styles.trilho} aria-hidden="true">
              <span className={styles.preenchido} style={{ width: `${(d.qtd / resumo.total) * 100}%` }} />
            </span>
            <span className={styles.qtd}>{d.qtd}</span>
          </li>
        ))}
      </ul>
      <ul className={styles.barras} aria-label="Notas por atributo">
        {resumo.atributos.map((a) => (
          <li key={a.rotulo} className={styles.linhaAtributo}>
            <span>{a.rotulo}</span>
            <span className={styles.trilho} aria-hidden="true">
              <span className={styles.preenchido} style={{ width: `${(a.nota / 5) * 100}%` }} />
            </span>
            <span className={styles.qtd}>{formatarNota(a.nota)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

`prototipo/src/features/avaliacoes/ResumoNotas.module.css`:
```css
.resumo {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px 32px;
  align-items: start;
}

.geral { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; grid-row: span 2; }
.media { font: 700 48px/120% var(--font); color: var(--c-text-high); }
.total { font: 400 12px/160% var(--font); color: var(--c-text-low); }

.barras { display: flex; flex-direction: column; gap: 6px; font: 400 12px/160% var(--font); }

.linha { display: grid; grid-template-columns: 28px 1fr 32px; align-items: center; gap: 8px; }
.linhaAtributo { display: grid; grid-template-columns: 150px 1fr 32px; align-items: center; gap: 8px; }

.trilho { height: 8px; border-radius: 999px; background: var(--c-border-low); overflow: hidden; }
.preenchido { display: block; height: 100%; border-radius: 999px; background: var(--c-secondary); }

.qtd { text-align: right; font-weight: 600; }
.rotuloCurto { white-space: nowrap; }

@media (max-width: 671px) {
  .resumo { grid-template-columns: 1fr; }
  .geral { grid-row: auto; }
  .linhaAtributo { grid-template-columns: 1fr 80px 32px; }
}
```

- [ ] **Step 4: FiltrosPerfil e AvaliacaoCard**

`prototipo/src/features/avaliacoes/FiltrosPerfil.tsx`:
```tsx
import { Chip } from '../../components/ui/Chip'
import type { FiltrosAvaliacao } from '../../lib/filtroAvaliacoes'
import styles from './FiltrosPerfil.module.css'

const GRUPOS: { chave: keyof FiltrosAvaliacao; rotulo: string; opcoes: { valor: string; rotulo: string }[] }[] = [
  { chave: 'uso', rotulo: 'Uso', opcoes: [{ valor: 'cidade', rotulo: 'Cidade' }, { valor: 'estrada', rotulo: 'Estrada' }] },
  {
    chave: 'recarga',
    rotulo: 'Recarrega em',
    opcoes: [
      { valor: 'casa', rotulo: 'Casa' },
      { valor: 'trabalho', rotulo: 'Trabalho' },
      { valor: 'rua', rotulo: 'Rua' },
    ],
  },
  {
    chave: 'tipo',
    rotulo: 'Tipo',
    opcoes: [
      { valor: 'assinante', rotulo: 'Assinante' },
      { valor: 'teste', rotulo: 'Cliente em teste' },
      { valor: 'aluguel', rotulo: 'Cliente de aluguel' },
    ],
  },
]

interface Props {
  filtros: FiltrosAvaliacao
  onAlternar: (grupo: keyof FiltrosAvaliacao, valor: string) => void
}

export function FiltrosPerfil({ filtros, onAlternar }: Props) {
  return (
    <div className={styles.filtros}>
      <h3 className={styles.titulo}>Encontre alguém com a sua rotina</h3>
      {GRUPOS.map((g) => (
        <div key={g.chave} role="group" aria-label={g.rotulo} className={styles.grupo}>
          <span className={styles.rotulo} aria-hidden="true">{g.rotulo}</span>
          <div className={styles.chips}>
            {g.opcoes.map((o) => (
              <Chip
                key={o.valor}
                selecionado={(filtros[g.chave] as string[]).includes(o.valor)}
                onClick={() => onAlternar(g.chave, o.valor)}
              >
                {o.rotulo}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

`prototipo/src/features/avaliacoes/FiltrosPerfil.module.css`:
```css
.filtros { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; }
.titulo { font: 700 16px/24px var(--font); color: var(--c-text-high); }
.grupo { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; }
.rotulo { min-width: 104px; font: 600 12px/160% var(--font); color: var(--c-text-low); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }

@media (max-width: 671px) {
  .grupo { flex-direction: column; align-items: flex-start; }
}
```

`prototipo/src/features/avaliacoes/AvaliacaoCard.tsx`:
```tsx
import { BadgeCheck, MessageSquareReply } from 'lucide-react'
import { Estrelas } from '../../components/ui/Estrelas'
import type { Avaliacao, LocalRecarga, TipoAvaliador, Uso } from '../../lib/filtroAvaliacoes'
import { formatarData } from '../../lib/formato'
import styles from './AvaliacaoCard.module.css'

const SELOS: Record<TipoAvaliador, string> = {
  assinante: 'Assinante verificado',
  teste: 'Cliente em teste',
  aluguel: 'Cliente de aluguel',
}
const USO: Record<Uso, string> = { cidade: 'Uso na cidade', estrada: 'Uso na estrada' }
const RECARGA: Record<LocalRecarga, string> = {
  casa: 'Recarrega em casa',
  trabalho: 'Recarrega no trabalho',
  rua: 'Recarrega na rua',
}

export function AvaliacaoCard({ avaliacao: a }: { avaliacao: Avaliacao }) {
  return (
    <article className={styles.card} aria-label={`Avaliação de ${a.nome}`}>
      <div className={styles.topo}>
        <div>
          <p className={styles.nome}>
            {a.nome} · {a.cidade}
          </p>
          <span className={a.tipo === 'assinante' ? styles.seloAssinante : styles.selo}>
            <BadgeCheck size={16} aria-hidden="true" />
            {SELOS[a.tipo]}
          </span>
        </div>
        <div className={styles.nota}>
          <Estrelas nota={a.nota} />
          <time dateTime={a.data} className={styles.data}>{formatarData(a.data)}</time>
        </div>
      </div>
      <ul className={styles.tags} aria-label="Perfil de quem avaliou">
        <li>{USO[a.uso]}</li>
        <li>{RECARGA[a.recarga]}</li>
        <li>{a.tempo}</li>
      </ul>
      <p className={styles.texto}>{a.texto}</p>
      {a.resposta && (
        <div className={styles.resposta}>
          <p className={styles.respostaTitulo}>
            <MessageSquareReply size={16} aria-hidden="true" />
            Resposta da Localiza
          </p>
          <p>{a.resposta}</p>
        </div>
      )}
    </article>
  )
}
```

`prototipo/src/features/avaliacoes/AvaliacaoCard.module.css`:
```css
.card {
  padding: 20px;
  border: 1px solid var(--c-paper-border);
  border-radius: var(--r-soft);
  background: #fff;
}

.topo { display: flex; justify-content: space-between; gap: 16px; }

.nome { font: 700 16px/24px var(--font); color: var(--c-text-high); }

.selo,
.seloAssinante {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  font: 600 12px/160% var(--font);
  background: var(--c-info-lower);
  color: var(--c-info-contrast);
}

.seloAssinante { background: var(--c-success-lower); color: var(--c-focus); }

.nota { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex: none; }
.data { font: 400 12px/160% var(--font); color: var(--c-text-low); }

.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }

.tags li {
  padding: 2px 10px;
  border-radius: var(--r-pill);
  background: var(--c-bg);
  font: 400 12px/160% var(--font);
}

.texto { margin-top: 12px; font: 400 14px/21px var(--font); }

.resposta {
  margin-top: 16px;
  padding: 12px 16px;
  border-left: 3px solid var(--c-secondary);
  border-radius: 0 var(--r-main) var(--r-main) 0;
  background: var(--c-bg);
  font: 400 14px/21px var(--font);
}

.respostaTitulo {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-weight: 700;
  color: var(--c-secondary);
}

@media (max-width: 671px) {
  .topo { flex-direction: column; }
  .nota { align-items: flex-start; }
}
```

- [ ] **Step 5: AvaliacoesSection**

`prototipo/src/features/avaliacoes/AvaliacoesSection.tsx`:
```tsx
import { Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Accordion } from '../../components/ui/Accordion'
import { Button } from '../../components/ui/Button'
import { VertenteTag } from '../../components/ui/VertenteTag'
import { avaliacoes, resumoAvaliacoes } from '../../data/avaliacoes'
import {
  alternarFiltro,
  FILTROS_VAZIOS,
  filtrarAvaliacoes,
  ordenarRecentes,
  type FiltrosAvaliacao,
} from '../../lib/filtroAvaliacoes'
import { AvaliacaoCard } from './AvaliacaoCard'
import styles from './AvaliacoesSection.module.css'
import { FiltrosPerfil } from './FiltrosPerfil'
import { ResumoNotas } from './ResumoNotas'

const POR_PAGINA = 3

export function AvaliacoesSection() {
  const [filtros, setFiltros] = useState<FiltrosAvaliacao>(FILTROS_VAZIOS)
  const [visiveis, setVisiveis] = useState(POR_PAGINA)

  const todas = useMemo(() => ordenarRecentes(avaliacoes), [])
  const filtradas = useMemo(() => filtrarAvaliacoes(todas, filtros), [todas, filtros])

  const alternar = (grupo: keyof FiltrosAvaliacao, valor: string) => {
    setFiltros((f) => alternarFiltro(f, grupo, valor))
    setVisiveis(POR_PAGINA)
  }

  const limpar = () => {
    setFiltros(FILTROS_VAZIOS)
    setVisiveis(POR_PAGINA)
  }

  return (
    <Accordion id="avaliacoes" titulo="Avaliações de assinantes" icone={<Star size={20} />} tag={<VertenteTag n={2} />}>
      <ResumoNotas resumo={resumoAvaliacoes} />
      <FiltrosPerfil filtros={filtros} onAlternar={alternar} />

      {filtradas.length === 0 ? (
        <div className={styles.vazio}>
          <p>Ainda não há avaliações com esse perfil.</p>
          <Button variante="outlineDark" tamanho="sm" onClick={limpar}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <>
          <p className={styles.contador} aria-live="polite">
            Mostrando {Math.min(visiveis, filtradas.length)} de {filtradas.length}
          </p>
          <ul className={styles.lista}>
            {filtradas.slice(0, visiveis).map((a) => (
              <li key={a.id}>
                <AvaliacaoCard avaliacao={a} />
              </li>
            ))}
          </ul>
          {visiveis < filtradas.length && (
            <Button variante="outlineDark" larguraTotal onClick={() => setVisiveis((v) => v + POR_PAGINA)}>
              Ver mais avaliações
            </Button>
          )}
        </>
      )}

      <p className={styles.transparencia}>
        Publicamos avaliações positivas e negativas. A moderação remove só ofensas, dados pessoais e conteúdo fora do
        tema. Quem avalia autoriza a publicação do primeiro nome e da cidade (LGPD). Não oferecemos incentivo para
        avaliar.
      </p>
    </Accordion>
  )
}
```

`prototipo/src/features/avaliacoes/AvaliacoesSection.module.css`:
```css
.contador { margin: 24px 0 12px; font: 400 12px/160% var(--font); color: var(--c-text-low); }

.lista { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }

.vazio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 24px;
  padding: 20px;
  border-radius: var(--r-soft);
  background: var(--c-bg);
}

.transparencia { margin-top: 16px; font: 400 12px/160% var(--font); color: var(--c-text-low); }
```

- [ ] **Step 6: Encaixar na página**

Em `prototipo/src/pages/ModeloPage/ModeloPage.tsx`:

1. Adicione o import:
```tsx
import { AvaliacoesSection } from '../../features/avaliacoes/AvaliacoesSection'
```

2. Troque:
```tsx
              {proposta && <DadosFrotaSection />}
              {proposta && <MesDeTesteSection />}
```
por:
```tsx
              {proposta && (
                <>
                  <DadosFrotaSection />
                  <AvaliacoesSection />
                  <MesDeTesteSection />
                </>
              )}
```

- [ ] **Step 7: Rodar para ver passar**

Run: `npm test && npm run build`
Expected: tudo verde.

Nota: em `ModeloPage.test.tsx`, o teste do carrossel usa `within(carrossel).getAllByRole('article')`, então os `article` das avaliações não interferem.

- [ ] **Step 8: Commit**

```bash
git add prototipo/src
git commit -m "feat(prototipo): vertente 2 — avaliações verificadas com filtros por perfil"
```

---

### Task 15: Vertente 3B — tela do assinante (`#/assinante`)

**Files:**
- Create em `prototipo/src/pages/AssinantePage/`: `AssinantePage.tsx`, `Stepper.tsx`, `ConsentimentoStep.tsx`, `UsoStep.tsx`, `GraficoDiasKm.tsx`, `RecargaStep.tsx`, `ResultadoStep.tsx`, `AssinantePage.module.css` (compartilhado pelos passos), `GraficoDiasKm.module.css`
- Modify: `prototipo/src/App.tsx`, `prototipo/src/App.test.tsx`
- Test: `prototipo/src/pages/AssinantePage/AssinantePage.test.tsx`

**Interfaces:**
- Consumes: `assinante`, `clienteTelemetria` (Task 3); `modelosEletricos`, `tarifas`, `imagemModelo` (Task 3); `recomendar`, `cobertura`, `PerfilRecarga`, `ResultadoRecomendacao`, `AvaliacaoModelo` (Task 3); `gastoEnergiaMensal` (Task 2); `formatarNumero`, `formatarReais`, `formatarReaisComSinal`, `formatarPct`, `asset` (Task 1); `useModo`, `useToast` (Task 6); `Button`, `SegmentedCards`, `VertenteTag` (Task 8).
- Produces: `AssinantePage()`; `GraficoDiasKm({ kmDiarios: number[]; linhas: { rotulo: string; km: number }[] })`.

- [ ] **Step 1: Escrever o teste (falhando)**

`prototipo/src/pages/AssinantePage/AssinantePage.test.tsx`:
```tsx
import { screen, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderComProviders } from '../../test/render'
import { AssinantePage } from './AssinantePage'

async function autorizarEEscolher(user: UserEvent, opcao: 'Em casa' | 'No trabalho' | 'Só na rua') {
  await user.click(screen.getByRole('button', { name: 'Autorizo' }))
  await user.click(screen.getByRole('radio', { name: opcao }))
}

describe('AssinantePage', () => {
  it('mostra o aviso do contrato e começa pelo consentimento', () => {
    renderComProviders(<AssinantePage />, '/#/assinante')
    expect(screen.getByRole('heading', { level: 1, name: 'Minha assinatura' })).toBeInTheDocument()
    expect(screen.getByText('87 dias')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /seu uso nos últimos 12 meses/i })).not.toBeInTheDocument()
  })

  it('"Agora não" encerra o fluxo e oferece renovar', async () => {
    const user = userEvent.setup()
    renderComProviders(<AssinantePage />, '/#/assinante')
    await user.click(screen.getByRole('button', { name: 'Agora não' }))
    expect(screen.queryByRole('heading', { name: /seu uso/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Renovar com meu carro atual' }))
    expect(screen.getByRole('status')).toHaveTextContent('Renovação registrada (protótipo).')
  })

  it('autorizado mostra o uso medido pela telemetria', async () => {
    const user = userEvent.setup()
    renderComProviders(<AssinantePage />, '/#/assinante')
    await user.click(screen.getByRole('button', { name: 'Autorizo' }))
    expect(screen.getByRole('heading', { name: /seu uso nos últimos 12 meses/i })).toBeInTheDocument()
    expect(screen.getByText('310 km')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /BYD Dolphin \(290 km\) cobre 99% dos dias/ })).toBeInTheDocument()
  })

  it('recarga em casa recomenda o Dolphin com R$ 240/mês', async () => {
    const user = userEvent.setup()
    renderComProviders(<AssinantePage />, '/#/assinante')
    await autorizarEEscolher(user, 'Em casa')
    expect(screen.getByRole('heading', { level: 3, name: 'BYD Dolphin' })).toBeInTheDocument()
    expect(screen.getByText('Cobre 99% dos seus dias')).toBeInTheDocument()
    expect(screen.getByText('Você economiza R$ 240/mês · R$ 2.880/ano')).toBeInTheDocument()
    const total = screen.getByRole('row', { name: /custo total por mês/i })
    expect(within(total).getByText('−R$ 240')).toBeInTheDocument()
    const mensalidade = screen.getByRole('row', { name: /mensalidade/i })
    expect(within(mensalidade).getByText('M + R$ 500')).toBeInTheDocument()
    expect(screen.getByText('Cobre só 92% dos seus dias (mínimo 95%)')).toBeInTheDocument()
  })

  it('recarga no trabalho recomenda o Dolphin com R$ 160/mês', async () => {
    const user = userEvent.setup()
    renderComProviders(<AssinantePage />, '/#/assinante')
    await autorizarEEscolher(user, 'No trabalho')
    expect(screen.getByText('Você economiza R$ 160/mês · R$ 1.920/ano')).toBeInTheDocument()
  })

  it('só na rua não recomenda elétrico e explica o motivo', async () => {
    const user = userEvent.setup()
    renderComProviders(<AssinantePage />, '/#/assinante')
    await autorizarEEscolher(user, 'Só na rua')
    expect(screen.getByText(/hoje um elétrico não compensa para a sua rotina/i)).toBeInTheDocument()
    expect(screen.queryByText(/você economiza/i)).not.toBeInTheDocument()
    const outros = screen.getByRole('list', { name: 'Outros modelos avaliados' })
    expect(within(outros).getAllByText('A economia com energia não cobre a diferença de mensalidade').length).toBeGreaterThan(0)
  })

  it('"Testar o Dolphin por 30 dias" leva ao formulário em modo proposta', async () => {
    const user = userEvent.setup()
    renderComProviders(<AssinantePage />, '/?modo=atual#/assinante')
    await autorizarEEscolher(user, 'Em casa')
    await user.click(screen.getByRole('button', { name: 'Testar o Dolphin por 30 dias' }))
    expect(window.location.hash).toBe('#/?teste=1')
    expect(window.location.search).toBe('?modo=proposta')
  })
})
```

Acrescente em `prototipo/src/App.test.tsx`, dentro do `describe('App')`:
```tsx
  it('#/assinante mostra a tela do assinante e troca o switch por um link de volta', () => {
    renderComProviders(<App />, '/#/assinante')
    expect(screen.getByRole('heading', { level: 1, name: 'Minha assinatura' })).toBeInTheDocument()
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '← Página do modelo' })).toHaveAttribute('href', '#/')
  })
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test -- src/pages/AssinantePage src/App.test.tsx`
Expected: FAIL — `Failed to resolve import "./AssinantePage"` e o novo caso do App falha.

- [ ] **Step 3: GraficoDiasKm**

`prototipo/src/pages/AssinantePage/GraficoDiasKm.tsx`:
```tsx
import { cobertura } from '../../lib/recomendacao'
import { formatarPct } from '../../lib/formato'
import styles from './GraficoDiasKm.module.css'

interface Linha {
  rotulo: string
  km: number
}

interface Props {
  kmDiarios: number[]
  linhas: Linha[]
}

const LARGURA = 730
const ALTURA = 200
const TOPO = 8

export function GraficoDiasKm({ kmDiarios, linhas }: Props) {
  const ordenados = [...kmDiarios].sort((a, b) => b - a)
  const linhasDesc = [...linhas].sort((a, b) => b.km - a.km)
  const maxKm = Math.max(350, ...ordenados)
  const y = (km: number) => ALTURA - (km / maxKm) * (ALTURA - TOPO)
  const largura = LARGURA / Math.max(1, ordenados.length)

  const classeBarra = (km: number) => {
    if (linhasDesc.length > 0 && km > linhasDesc[0].km) return styles.acimaDeTodas
    if (linhasDesc.some((l) => km > l.km)) return styles.acimaDeAlguma
    return styles.dentro
  }

  const resumo = linhasDesc
    .map((l) => `${l.rotulo} (${l.km} km) cobre ${formatarPct(cobertura(kmDiarios, l.km))} dos dias`)
    .join('; ')

  return (
    <figure className={styles.figura}>
      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        preserveAspectRatio="none"
        className={styles.svg}
        role="img"
        aria-label={`Quilômetros por dia nos últimos 12 meses, do dia mais longo ao mais curto. ${resumo}.`}
      >
        {ordenados.map((km, i) => (
          <rect
            key={i}
            x={i * largura}
            y={y(km)}
            width={Math.max(largura - 0.4, 0.6)}
            height={ALTURA - y(km)}
            className={classeBarra(km)}
          />
        ))}
        {linhasDesc.map((l, i) => (
          <line
            key={l.rotulo}
            x1={0}
            x2={LARGURA}
            y1={y(l.km)}
            y2={y(l.km)}
            vectorEffect="non-scaling-stroke"
            className={i === 0 ? styles.linhaPrincipal : styles.linhaSecundaria}
          />
        ))}
      </svg>
      <figcaption className={styles.legenda}>
        <p>Cada barra é um dia dos últimos 12 meses, do mais longo ao mais curto.</p>
        <ul>
          {linhasDesc.map((l, i) => (
            <li key={l.rotulo}>
              <span className={i === 0 ? styles.marcaPrincipal : styles.marcaSecundaria} aria-hidden="true" />
              {l.rotulo} · autonomia real {l.km} km: cobre {formatarPct(cobertura(kmDiarios, l.km))} dos seus dias
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  )
}
```

`prototipo/src/pages/AssinantePage/GraficoDiasKm.module.css`:
```css
.figura { margin-top: 16px; }

.svg {
  display: block;
  width: 100%;
  height: 160px;
  background: var(--c-bg);
  border-radius: var(--r-main);
}

.dentro { fill: var(--c-primary-low); }
.acimaDeAlguma { fill: var(--c-warning-high); }
.acimaDeTodas { fill: var(--c-critical); }

.linhaPrincipal { stroke: var(--c-secondary); stroke-width: 2; }
.linhaSecundaria { stroke: var(--c-text-high); stroke-width: 1.5; stroke-dasharray: 6 4; }

.legenda { margin-top: 8px; font: 400 12px/160% var(--font); color: var(--c-text-low); }
.legenda ul { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
.legenda li { display: flex; align-items: center; gap: 8px; color: var(--c-text); }

.marcaPrincipal,
.marcaSecundaria { display: inline-block; width: 20px; height: 0; border-top: 2px solid var(--c-secondary); }
.marcaSecundaria { border-top: 2px dashed var(--c-text-high); }
```

- [ ] **Step 4: Passos da tela**

`prototipo/src/pages/AssinantePage/Stepper.tsx`:
```tsx
import styles from './AssinantePage.module.css'

const PASSOS = ['Consentimento', 'Seu uso', 'Recarga', 'Resultado']

export function Stepper({ passoAtual }: { passoAtual: number }) {
  return (
    <ol className={styles.stepper} aria-label="Etapas da recomendação">
      {PASSOS.map((p, i) => {
        const n = i + 1
        const classe = n < passoAtual ? styles.passoFeito : n === passoAtual ? styles.passoAtual : styles.passo
        return (
          <li key={p} className={classe} aria-current={n === passoAtual ? 'step' : undefined}>
            <span className={styles.numeroPasso}>{n}</span>
            <span className={styles.nomePasso}>{p}</span>
          </li>
        )
      })}
    </ol>
  )
}
```

`prototipo/src/pages/AssinantePage/ConsentimentoStep.tsx`:
```tsx
import { ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import styles from './AssinantePage.module.css'

export type Consentimento = 'pendente' | 'autorizado' | 'recusado'

interface Props {
  estado: Consentimento
  onAutorizar: () => void
  onRecusar: () => void
}

export function ConsentimentoStep({ estado, onAutorizar, onRecusar }: Props) {
  return (
    <section className={styles.cartao} aria-labelledby="passo-consentimento">
      <h2 id="passo-consentimento" className={styles.tituloPasso}>
        <ShieldCheck size={24} aria-hidden="true" /> 1. Consentimento
      </h2>
      <p>
        Podemos usar os dados de telemetria do seu carro para calcular uma recomendação de elétrico? Usamos só para
        esta finalidade.
      </p>
      {estado === 'pendente' ? (
        <div className={styles.botoes}>
          <Button onClick={onAutorizar}>Autorizo</Button>
          <Button variante="outlineDark" onClick={onRecusar}>Agora não</Button>
        </div>
      ) : (
        <p className={styles.status}>
          {estado === 'autorizado'
            ? 'Você autorizou o uso da telemetria para esta recomendação.'
            : 'Você preferiu não compartilhar a telemetria.'}
        </p>
      )}
    </section>
  )
}
```

`prototipo/src/pages/AssinantePage/UsoStep.tsx`:
```tsx
import { Gauge } from 'lucide-react'
import { clienteTelemetria } from '../../data/assinante'
import { modelosEletricos } from '../../data/telemetria'
import { formatarNumero } from '../../lib/formato'
import styles from './AssinantePage.module.css'
import { GraficoDiasKm } from './GraficoDiasKm'

const linhasDoGrafico = modelosEletricos
  .filter((m) => m.id === 'dolphin' || m.id === 'dolphin-mini')
  .map((m) => ({ rotulo: m.nome, km: m.autonomiaRealKm }))

export function UsoStep() {
  const dias = clienteTelemetria.kmDiarios
  const maior = Math.max(...dias)
  const viagensLongasMes = Math.round(dias.filter((km) => km > 150).length / 12)
  return (
    <section className={styles.cartao} aria-labelledby="passo-uso">
      <h2 id="passo-uso" className={styles.tituloPasso}>
        <Gauge size={24} aria-hidden="true" /> 2. Seu uso nos últimos 12 meses
      </h2>
      <dl className={styles.numeros}>
        <div>
          <dt>km por mês</dt>
          <dd>{formatarNumero(clienteTelemetria.kmMes)} km</dd>
        </div>
        <div>
          <dt>Maior distância em um dia</dt>
          <dd>{maior} km</dd>
        </div>
        <div>
          <dt>Viagens longas (mais de 150 km)</dt>
          <dd>~{viagensLongasMes} por mês</dd>
        </div>
        <div>
          <dt>Consumo real</dt>
          <dd>{clienteTelemetria.kmPorLitro} km/l</dd>
        </div>
      </dl>
      <GraficoDiasKm kmDiarios={dias} linhas={linhasDoGrafico} />
    </section>
  )
}
```

`prototipo/src/pages/AssinantePage/RecargaStep.tsx`:
```tsx
import { PlugZap } from 'lucide-react'
import { SegmentedCards } from '../../components/ui/SegmentedCards'
import type { PerfilRecarga } from '../../lib/recomendacao'
import styles from './AssinantePage.module.css'

interface Props {
  valor: PerfilRecarga | null
  onChange: (v: PerfilRecarga) => void
}

export function RecargaStep({ valor, onChange }: Props) {
  return (
    <section className={styles.cartao} aria-labelledby="passo-recarga">
      <h2 id="passo-recarga" className={styles.tituloPasso}>
        <PlugZap size={24} aria-hidden="true" /> 3. Onde você pode recarregar?
      </h2>
      <SegmentedCards
        nome="recarga-assinante"
        rotulo="Escolha a opção mais comum na sua rotina"
        compacto
        valor={valor}
        onChange={onChange}
        opcoes={[
          { valor: 'casa', titulo: 'Em casa' },
          { valor: 'trabalho', titulo: 'No trabalho' },
          { valor: 'rua', titulo: 'Só na rua' },
        ]}
      />
    </section>
  )
}
```

`prototipo/src/pages/AssinantePage/ResultadoStep.tsx`:
```tsx
import { Sparkles } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { imagemModelo } from '../../data/telemetria'
import { asset } from '../../lib/asset'
import { gastoEnergiaMensal } from '../../lib/economia'
import { formatarNumero, formatarPct, formatarReais, formatarReaisComSinal } from '../../lib/formato'
import type { AvaliacaoModelo, PerfilRecarga, ResultadoRecomendacao } from '../../lib/recomendacao'
import { useModo } from '../../modo/ModoContext'
import styles from './AssinantePage.module.css'

interface Props {
  resultado: ResultadoRecomendacao
  perfil: PerfilRecarga
  kmMes: number
}

export const MSG_RENOVACAO = 'Renovação registrada (protótipo).'

function nomeCurto(nome: string) {
  return nome.replace(/^BYD /, '')
}

function Recomendacao({ r, kmMes, custoKmComb }: { r: AvaliacaoModelo; kmMes: number; custoKmComb: number }) {
  const { setModo } = useModo()
  const toast = useToast()
  const gastoComb = gastoEnergiaMensal(kmMes, custoKmComb)
  const gastoElet = gastoEnergiaMensal(kmMes, r.custoKmEletrico)
  const delta = r.modelo.deltaMensalidade
  const imagem = imagemModelo[r.modelo.id]

  const testar = () => {
    setModo('proposta')
    window.location.hash = '#/?teste=1'
  }

  return (
    <div className={styles.recomendacao}>
      <p className={styles.rotuloRecomendado}>
        <Sparkles size={16} aria-hidden="true" /> Recomendado para você
      </p>
      <h3 className={styles.nomeModelo}>{r.modelo.nome}</h3>
      {imagem && <img src={asset(imagem)} alt={r.modelo.nome} className={styles.imagemModelo} />}
      <p className={styles.cobertura}>Cobre {formatarPct(r.cobertura)} dos seus dias</p>

      <div className={styles.tabelaWrap}>
        <table className={styles.tabela}>
          <caption className="visually-hidden">Comparação do custo mensal entre o carro atual e o elétrico recomendado</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Combustão (atual)</th>
              <th scope="col">Elétrico (recomendado)</th>
              <th scope="col">Diferença</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Gasto mensal com energia ({formatarNumero(kmMes)} km)</th>
              <td>{formatarReais(gastoComb)}</td>
              <td>{formatarReais(gastoElet)}</td>
              <td>{formatarReaisComSinal(gastoElet - gastoComb)}</td>
            </tr>
            <tr>
              <th scope="row">Mensalidade</th>
              <td>M</td>
              <td>M + {formatarReais(delta)}</td>
              <td>{formatarReaisComSinal(delta)}</td>
            </tr>
            <tr className={styles.linhaTotal}>
              <th scope="row">Custo total por mês</th>
              <td>M + {formatarReais(gastoComb)}</td>
              <td>M + {formatarReais(gastoElet + delta)}</td>
              <td><strong>{formatarReaisComSinal(gastoElet + delta - gastoComb)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.economia}>
        Você economiza {formatarReais(r.economiaLiquida)}/mês · {formatarReais(r.economiaLiquida * 12)}/ano
      </p>

      <div className={styles.botoes}>
        <Button onClick={testar}>Testar o {nomeCurto(r.modelo.nome)} por 30 dias</Button>
        <Button variante="outlineDark" onClick={() => toast(MSG_RENOVACAO)}>Renovar com carro a combustão</Button>
      </div>
      <p className={styles.nota}>Se não se adaptar no mês de teste, você renova com carro a combustão, sem multa.</p>
    </div>
  )
}

export function ResultadoStep({ resultado, perfil, kmMes }: Props) {
  const toast = useToast()
  const r = resultado.recomendado
  const outros = resultado.avaliados.filter((a) => a !== r)

  return (
    <section className={styles.cartao} aria-labelledby="passo-resultado">
      <h2 id="passo-resultado" className={styles.tituloPasso}>4. Resultado</h2>
      {r ? (
        <Recomendacao r={r} kmMes={kmMes} custoKmComb={resultado.custoKmCombustao} />
      ) : (
        <div className={styles.semRecomendacao}>
          <p>
            {perfil === 'rua'
              ? 'Hoje um elétrico não compensa para a sua rotina: com recarga pública, a economia não cobre a diferença de mensalidade. Renove com carro a combustão, sem multa.'
              : 'Hoje um elétrico não compensa para a sua rotina. Renove com carro a combustão, sem multa.'}
          </p>
          <Button onClick={() => toast(MSG_RENOVACAO)}>Renovar com carro a combustão</Button>
        </div>
      )}

      <h3 className={styles.subtitulo} id="outros-modelos">Outros modelos avaliados</h3>
      <ul className={styles.outros} aria-label="Outros modelos avaliados">
        {outros.map((a) => (
          <li key={a.modelo.id} className={styles.outro}>
            <strong>{a.modelo.nome}</strong>
            {a.motivosExclusao.length > 0 ? (
              <ul className={styles.motivos}>
                {a.motivosExclusao.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : (
              <span> · elegível, economia de {formatarReais(a.economiaLiquida)}/mês</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

`prototipo/src/pages/AssinantePage/AssinantePage.tsx`:
```tsx
import { Car, Timer } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { VertenteTag } from '../../components/ui/VertenteTag'
import { assinante, clienteTelemetria } from '../../data/assinante'
import { modelosEletricos, tarifas } from '../../data/telemetria'
import { recomendar, type PerfilRecarga } from '../../lib/recomendacao'
import styles from './AssinantePage.module.css'
import { ConsentimentoStep, type Consentimento } from './ConsentimentoStep'
import { RecargaStep } from './RecargaStep'
import { MSG_RENOVACAO, ResultadoStep } from './ResultadoStep'
import { Stepper } from './Stepper'
import { UsoStep } from './UsoStep'

export function AssinantePage() {
  const toast = useToast()
  const [consentimento, setConsentimento] = useState<Consentimento>('pendente')
  const [recarga, setRecarga] = useState<PerfilRecarga | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const resultado = useMemo(
    () => (recarga ? recomendar(clienteTelemetria, recarga, modelosEletricos, tarifas) : null),
    [recarga],
  )

  const passoAtual = consentimento !== 'autorizado' ? 1 : recarga === null ? 3 : 4

  return (
    <main className={styles.pagina}>
      <div className={styles.container}>
        <VertenteTag n={3} />
        <p className={styles.saudacao}>Olá, {assinante.nome}</p>
        <h1 className={styles.titulo}>Minha assinatura</h1>

        <div className={styles.aviso}>
          <Timer size={24} aria-hidden="true" />
          <p>
            Seu contrato termina em <strong>{assinante.diasParaFimContrato} dias</strong>. Veja se um elétrico
            compensa na sua renovação.
          </p>
        </div>

        <div className={styles.carroAtual}>
          <Car size={32} aria-hidden="true" />
          <div>
            <p className={styles.rotuloCarro}>Seu carro atual</p>
            <p className={styles.nomeCarro}>
              {assinante.carroAtual} · {assinante.combustivel}
            </p>
          </div>
        </div>

        <Stepper passoAtual={passoAtual} />

        <ConsentimentoStep
          estado={consentimento}
          onAutorizar={() => setConsentimento('autorizado')}
          onRecusar={() => setConsentimento('recusado')}
        />

        {consentimento === 'recusado' && (
          <section className={styles.cartao} aria-label="Renovação">
            <p>Sem problema. Você pode renovar com o seu carro atual.</p>
            <div className={styles.botoes}>
              <Button onClick={() => toast(MSG_RENOVACAO)}>Renovar com meu carro atual</Button>
            </div>
          </section>
        )}

        {consentimento === 'autorizado' && (
          <>
            <UsoStep />
            <RecargaStep valor={recarga} onChange={setRecarga} />
            {resultado && recarga && <ResultadoStep resultado={resultado} perfil={recarga} kmMes={clienteTelemetria.kmMes} />}
          </>
        )}

        <p className={styles.privacidade}>
          A recomendação usa seus dados individuais com o seu consentimento. Os fatos públicos da página do modelo usam
          dados agregados e anônimos.
        </p>
      </div>
    </main>
  )
}
```

`prototipo/src/pages/AssinantePage/AssinantePage.module.css`:
```css
.pagina { padding: 32px 16px 96px; }
.container { display: flex; flex-direction: column; align-items: stretch; gap: 16px; max-width: 760px; margin: 0 auto; }
.container > :first-child { align-self: flex-start; }

.saudacao { font: 400 16px/24px var(--font); }
.titulo { font: 700 40px/130% var(--font); color: var(--c-secondary); }

.aviso {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: var(--r-soft);
  background: var(--c-warning-lower);
  color: var(--c-warning-contrast);
}

.carroAtual {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--r-soft);
  background: #fff;
  color: var(--c-icon);
}

.rotuloCarro { font: 400 12px/160% var(--font); color: var(--c-text-low); }
.nomeCarro { font: 700 16px/24px var(--font); color: var(--c-text-high); }

.stepper { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 8px 0; }

.passo,
.passoAtual,
.passoFeito {
  display: flex;
  align-items: center;
  gap: 8px;
  font: 600 12px/160% var(--font);
  color: var(--c-text-low);
}

.numeroPasso {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--c-border-low);
  background: #fff;
}

.passoAtual { color: var(--c-secondary); }
.passoAtual .numeroPasso { border-color: var(--c-secondary); background: var(--c-primary-lower); }
.passoFeito .numeroPasso { border-color: var(--c-secondary); background: var(--c-secondary); color: #fff; }

.cartao {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  border-radius: var(--r-card);
  background: #fff;
}

.tituloPasso {
  display: flex;
  align-items: center;
  gap: 8px;
  font: 700 20px/28px var(--font);
  color: var(--c-secondary);
}

.botoes { display: flex; flex-wrap: wrap; gap: 12px; }
.status { font: 600 14px/21px var(--font); color: var(--c-focus); }

.numeros { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.numeros dt { font: 400 12px/160% var(--font); color: var(--c-text-low); }
.numeros dd { font: 700 20px/28px var(--font); color: var(--c-text-high); }

.recomendacao { display: flex; flex-direction: column; gap: 12px; }

.rotuloRecomendado {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 2px 12px;
  border-radius: var(--r-pill);
  background: var(--c-primary);
  color: var(--c-primary-contrast);
  font: 600 12px/160% var(--font);
}

.nomeModelo { font: 700 32px/130% var(--font); color: var(--c-secondary); }
.imagemModelo { width: 100%; max-width: 420px; align-self: center; }
.cobertura { font: 600 16px/24px var(--font); }

.tabelaWrap { overflow-x: auto; }

.tabela { width: 100%; min-width: 520px; border-collapse: collapse; font: 400 14px/21px var(--font); }
.tabela th,
.tabela td { padding: 12px 8px; border-bottom: 1px solid var(--c-paper-border); text-align: left; }
.tabela thead th { font: 600 12px/160% var(--font); color: var(--c-text-low); }
.tabela tbody th { font-weight: 600; }
.linhaTotal th,
.linhaTotal td { border-bottom: 0; font-weight: 700; color: var(--c-text-high); }
.linhaTotal td:last-child { color: var(--c-secondary); }

.economia {
  padding: 16px 20px;
  border-radius: var(--r-soft);
  background: var(--c-primary-lower);
  color: var(--c-primary-contrast);
  font: 700 20px/28px var(--font);
}

.nota { font: 400 12px/160% var(--font); color: var(--c-text-low); }

.semRecomendacao {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  border-radius: var(--r-soft);
  background: var(--c-bg);
}

.subtitulo { margin-top: 8px; font: 700 16px/24px var(--font); color: var(--c-text-high); }
.outros { display: flex; flex-direction: column; gap: 12px; font: 400 14px/21px var(--font); }
.motivos { margin-top: 4px; padding-left: 18px; list-style: disc; color: var(--c-text-low); }

.privacidade { font: 400 12px/160% var(--font); color: var(--c-text-low); }

@media (max-width: 671px) {
  .titulo { font-size: 32px; }
  .cartao { padding: 20px 16px; }
  .numeros { grid-template-columns: 1fr 1fr; }
  .nomePasso { display: none; }
  .stepper { grid-template-columns: repeat(4, auto); justify-content: space-between; }
  .botoes > * { width: 100%; }
}
```

- [ ] **Step 5: Ligar a rota no App**

Em `prototipo/src/App.tsx`:

1. Adicione o import:
```tsx
import { AssinantePage } from './pages/AssinantePage/AssinantePage'
```

2. Troque `<ModeloPage params={params} />` por:
```tsx
      {rota === 'assinante' ? <AssinantePage /> : <ModeloPage params={params} />}
```

- [ ] **Step 6: Rodar para ver passar**

Run: `npm test && npm run build`
Expected: tudo verde.

- [ ] **Step 7: Commit**

```bash
git add prototipo/src
git commit -m "feat(prototipo): vertente 3B — tela do assinante com recomendação na renovação"
```

---

### Task 16: Deploy no GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `prototipo/README.md`

**Interfaces:**
- Consumes: scripts `test` e `build` de `prototipo/package.json` (Task 1).

- [ ] **Step 1: Criar o workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy do protótipo no GitHub Pages

on:
  push:
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    if: github.ref_name == github.event.repository.default_branch
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: prototipo
    steps:
      - name: Checkout
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
      - name: Set up Node
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7
        with:
          node-version: lts/*
          cache: npm
          cache-dependency-path: prototipo/package-lock.json
      - name: Install
        run: npm ci
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6
      - name: Upload artifact
        uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5
        with:
          path: prototipo/dist
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@368f82528645a54fb793d4d04e342629a3f51346 # v5
```

(As versões fixadas por SHA vêm do guia oficial de deploy estático do Vite 8.)

- [ ] **Step 2: README do protótipo**

`prototipo/README.md`:
````markdown
---
title: Protótipo BYD Dolphin — Localiza Assinatura
date: 2026-09-30
---

# Protótipo BYD Dolphin com as três vertentes

Protótipo navegável para o Ideathon Localiza. Reproduz a página do BYD Dolphin por assinatura e mostra a
proposta: mês de teste (V1), avaliações de assinantes (V2) e telemetria (V3).

Todos os números são fictícios. O protótipo não envia dados.

## Rodar localmente

```bash
npm install
npm run dev
```

## Testes e build

```bash
npm test
npm run build
npm run preview
```

## Links úteis no pitch

- Página atual: `?modo=atual`
- Proposta: `?modo=proposta`
- Tela do assinante (V3B): `#/assinante`
- Formulário já com mês de teste: `#/?teste=1`

## Publicação

O workflow `.github/workflows/deploy.yml` publica no GitHub Pages a cada push na branch padrão.
Ative uma vez em **Settings → Pages → Source: GitHub Actions**.
````

- [ ] **Step 3: Validar o build de produção com o base path**

Run (em `prototipo/`): `npm run build && npm run preview -- --port 4173`
Expected: servidor em `http://localhost:4173/hackatonLocaliza/`. Abrir no browser pane e confirmar que imagens, logo e fonte carregam (sem 404 no console). Encerrar o preview depois.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml prototipo/README.md
git commit -m "ci: deploy do protótipo no GitHub Pages"
```

- [ ] **Step 5: Avisar o usuário**

Informe que é preciso ativar **Settings → Pages → Source: GitHub Actions** no repositório `CaioKloppel/hackatonLocaliza` e fazer push para a branch padrão. Não faça push sem o usuário pedir.

---

### Task 17: Verificação visual e responsiva

**Files:**
- Modify: qualquer `.module.css` que precise de ajuste encontrado nesta verificação.

**Interfaces:**
- Consumes: app completo (Tasks 1–16).

- [ ] **Step 1: Subir o preview**

Crie `.claude/launch.json` na raiz do repo (se não existir):
```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "prototipo-preview",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["--prefix", "prototipo", "run", "preview", "--", "--port", "4173", "--strictPort"],
      "port": 4173
    }
  ]
}
```
Rode `npm run build` em `prototipo/` e depois `preview_start` com `name: "prototipo-preview"`. Navegue para `http://localhost:4173/hackatonLocaliza/`.

- [ ] **Step 2: Checar cada combinação**

Para cada largura **1391×853**, **768×1024** e **375×812** (`resize_window`):

1. `?modo=proposta#/`: screenshot do topo, do bloco "Dados reais da frota", de "Avaliações", de "Mês de teste" e do formulário.
2. `?modo=atual#/`: screenshot do topo e da coluna esquerda (sem os blocos novos).
3. `#/assinante`: clicar "Autorizo" e testar "Em casa", "No trabalho" e "Só na rua"; screenshot do resultado.

Em cada uma, rode no `javascript_tool`:
```js
({ largura: document.documentElement.clientWidth, rolagem: document.documentElement.scrollWidth })
```
Expected: `rolagem === largura` (sem scroll horizontal).

E `read_console_messages` com `onlyErrors: true`.
Expected: nenhum erro.

- [ ] **Step 3: Fluxos ponta a ponta no navegador**

1. Chip "Teste 30 dias antes de assinar" → rola até a seção V1.
2. Botão "Quero testar por 30 dias" da seção → formulário com "Mês de teste" marcado e foco no campo Nome.
3. Preencher dados de teste fictícios (Nome "Teste Protótipo", e-mail `teste@exemplo.com`, telefone `41999998888`, CPF `12345678901`, CEP `80000000`) → enviar → mensagem de sucesso do mês de teste. Nada é enviado à rede (conferir `read_network_requests`).
4. Filtros de avaliação "Cliente em teste" + "Rua" → estado vazio → "Limpar filtros".
5. Simulador: trocar para "Rua" e consumo `20` → mensagem de "não sai mais barata".
6. `#/assinante` → "Testar o Dolphin por 30 dias" → volta à página com o formulário em mês de teste.
7. Switch "Página atual / Proposta" alterna os blocos sem recarregar.

- [ ] **Step 4: Corrigir e repetir**

Para cada problema visual (sobreposição, corte de texto, alvo de toque < 44px, scroll horizontal), ajuste o CSS module do componente, rode `npm test && npm run build`, recarregue e tire novo screenshot. Restaure o viewport com `resize_window` preset `desktop` ao terminar e pare o preview.

- [ ] **Step 5: Commit**

```bash
git add prototipo/src .claude/launch.json
git commit -m "fix(prototipo): ajustes de layout responsivo após verificação visual"
```
Se nada precisou mudar, commite só o `.claude/launch.json` com a mensagem `chore: configuração de preview do protótipo`.
