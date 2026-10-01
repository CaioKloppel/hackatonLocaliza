---
title: Protótipo da página BYD Dolphin com as três vertentes
date: 2026-09-30
status: aprovado para plano
fontes:
  - Proposta-Localiza-Assinatura-Eletricos.md (Caio Kloppel, 2026-09-30)
  - localiza-byd-dolphin-page.json (spec de design extraída da página real)
---

# Protótipo da página BYD Dolphin com as três vertentes

## 1. Objetivo

Protótipo navegável para o pitch do Ideathon Localiza Assinatura. Reproduz fielmente a página
[BYD Dolphin por assinatura](https://assinatura.localiza.com/personalize-seu-plano/eletrico/byd-dolphin/000009%C3%8D)
e mostra como ela ficaria com as três vertentes da proposta:

| Vertente | Onde aparece no protótipo |
| --- | --- |
| 1. Mês de teste (30 dias) | Chip no título, escolha no formulário, seção "Como funciona" |
| 2. Avaliações de assinantes | Chip de nota no título, seção de avaliações com filtros por perfil |
| 3A. Telemetria: fatos por modelo | Seção "Dados reais da frota" com 5 fatos |
| 3B. Telemetria: recomendação | Simulador público na página + tela `#/assinante` de renovação |

**Público:** banca e mentores do Ideathon. **Sucesso:** a banca vê o antes/depois ao vivo, entende
cada vertente em poucos segundos, e o protótipo funciona sem falhas em PC e celular.

## 2. Restrições e decisões

- Site estático hospedado no GitHub Pages (repo `CaioKloppel/hackatonLocaliza`).
- Stack: **Vite + React + TypeScript + CSS Modules**, ícones `lucide-react`, testes com **Vitest**.
- Sem backend. Nenhum dado de formulário é enviado. Nenhuma chamada de rede em tempo de execução.
- Todos os dados são fictícios/ilustrativos e isso é dito na interface.
- **Regra de valores:** o protótipo **não mostra preço absoluto** da Localiza (mensalidade, aluguel).
  Mostra apenas economia (em % ou em R$ economizados). Na tabela da V3B a mensalidade aparece como
  `M` e `M + R$ 500` (diferença), igual ao .md.
- Mês de teste é de **30 dias** (versão do .md), não a de 7 dias de `docs/test-drive-de-rotina.md`.
- Imagens e logos são **copiados para o repo** (não hotlink). O download pede confirmação do usuário.
- Sem modo escuro (a página real não tem). Idioma único: pt-BR.

## 3. Arquitetura

```
hackatonLocaliza/
├── docs/superpowers/specs/            esta spec
├── .github/workflows/deploy.yml       build de prototipo/ → GitHub Pages
└── prototipo/
    ├── index.html
    ├── vite.config.ts                 base: '/hackatonLocaliza/'
    ├── public/assets/                 imagens, logos, SVGs decorativos, favicon
    └── src/
        ├── main.tsx, App.tsx          roteamento por hash
        ├── styles/tokens.css          tokens LDS como CSS vars
        ├── styles/global.css          reset, fonte Inter, fundo decorativo
        ├── data/                      mocks tipados
        │   ├── dolphin.ts             conteúdo do veículo, itens de série, incluso, adicionais
        │   ├── relacionados.ts        5 modelos do carrossel
        │   ├── avaliacoes.ts          resumo + ~10 avaliações
        │   ├── telemetria.ts          fatos da frota (V3A) + modelos elegíveis (V3B)
        │   └── assinante.ts           assinante fictício + km diários de 12 meses
        ├── lib/
        │   ├── economia.ts            custo por km, economia de energia, economia líquida
        │   ├── recomendacao.ts        regras da V3B
        │   ├── mascaras.ts            telefone, CPF/CNPJ, CEP
        │   └── filtroAvaliacoes.ts    filtro por perfil
        ├── modo/ModoContext.tsx       'atual' | 'proposta'
        ├── hooks/useHashRoute.ts
        ├── components/layout/         PrototypeBar, Header, Footer, FloatingWhatsApp, Toast
        ├── components/ui/             Button, Accordion, Input, Select, Checkbox, Chip,
        │                              Estrelas, VertenteTag, SegmentedCards
        ├── pages/ModeloPage/          Breadcrumb, TitleBlock, VehicleCard, ColorPicker,
        │                              ItensDeSerie, ListaComIcones, QuoteForm, RelatedCarousel
        ├── features/mes-de-teste/     MesDeTesteSection, OpcaoInicioForm
        ├── features/avaliacoes/       AvaliacoesSection, ResumoNotas, FiltrosPerfil, AvaliacaoCard
        ├── features/telemetria/       DadosFrotaSection, FatoCard, SaudeBateriaChart,
        │                              SimuladorEconomia
        └── pages/AssinantePage/       Stepper, ConsentimentoStep, UsoStep, GraficoDiasKm,
                                       RecargaStep, ResultadoStep
```

### 3.1 Rotas

Hook `useHashRoute` lê `location.hash`. Duas rotas:

- `#/` (ou vazio): página do modelo.
- `#/assinante`: tela de renovação (V3B).

O hook também devolve parâmetros após `?` dentro do hash. `#/?teste=1` faz a página do modelo
marcar "Mês de teste" no formulário, rolar até ele e depois limpar o parâmetro com
`history.replaceState`. É o único parâmetro de hash usado.

Sem react-router. Hash evita 404 no GitHub Pages.

### 3.2 Modo Atual ↔ Proposta

- `ModoContext` com valor `'atual' | 'proposta'`. Padrão: `'proposta'`.
- Valor inicial vem de `?modo=atual|proposta` na URL. O toggle atualiza a query string com
  `history.replaceState`, então o link copiado abre no mesmo modo.
- `modo === 'atual'`: renderiza só a página de hoje (sem chips novos, sem blocos novos, formulário
  original).
- `modo === 'proposta'`: adiciona os blocos novos, cada um com `<VertenteTag n={1|2|3} />`.
- Em `#/assinante` o toggle fica oculto (a tela só existe na proposta) e a barra mostra
  "← Página do modelo".

### 3.3 Componentes de layout

- **PrototypeBar:** faixa de 40px acima do header, fundo `#262626`, texto branco 12–14px. Conteúdo:
  "Protótipo · Ideathon Localiza", switch acessível "Página atual / Proposta" e link
  "Tela do assinante (V3B)". Abaixo de 672px mostra só o switch.
- **Header:** fiel ao .json (88px, nav, logo central, CTA "Solicitar orçamento", botão de usuário).
  No modo proposta, o botão de usuário leva a `#/assinante`. Abaixo de 1200px: hamburger + logo + CTA
  + usuário (como na página real).
- **VertenteTag:** pill pequena na paleta `info` do LDS (fundo `#d8effd`, texto `#09547c`), texto
  "Vertente 1 · Mês de teste", "Vertente 2 · Avaliações", "Vertente 3 · Telemetria".
- **Toast:** links sem destino (footer, nav, "Ver carro", WhatsApp) mostram
  "Link desativado no protótipo".

### 3.4 Deploy

- Workflow `.github/workflows/deploy.yml`: dispara em `push` e `workflow_dispatch`; o job só roda se
  `github.ref_name == github.event.repository.default_branch`.
- Passos: checkout → setup Node → `npm ci` em `prototipo/` → `npm test` → `npm run build` →
  `actions/upload-pages-artifact` (path `prototipo/dist`) → `actions/deploy-pages`.
- Ação manual única do usuário: Settings → Pages → Source: **GitHub Actions**.

## 4. Página do modelo (`#/`)

### 4.1 Ordem das seções (modo proposta)

```
PrototypeBar
Header (sticky)
Breadcrumb + "Imagens ilustrativas"
Título "BYD Dolphin" + "EV 44KW Elétrico AT"
  └─ [novo] chips: "★ 4,6 · 128 avaliações" (→ #avaliacoes)
                   "Teste 30 dias antes de assinar" (→ #mes-de-teste)
┌─ coluna esquerda (660px) ──────────────┐  ┌─ coluna direita (437px, sticky) ─┐
│ VehicleCard                             │  │ QuoteForm                        │
│ Acordeão: Itens de série                │  │  └─ [V1] "Como quer começar?"    │
│ [V3] Dados reais da frota + simulador   │  │                                  │
│ [V2] Avaliações de assinantes           │  │                                  │
│ [V1] Mês de teste: como funciona        │  │                                  │
│ Acordeão: Incluso na assinatura         │  │                                  │
│ Acordeão: Adicionais                    │  └──────────────────────────────────┘
└─────────────────────────────────────────┘
Divisor
Carrossel de modelos relacionados
Botão "Voltar para a listagem"
Footer
Botão flutuante "Fale com um consultor"
```

A ordem dos blocos novos segue a narrativa **Conheça → Ouça quem usa → Experimente**, que corresponde
aos atributos de Rogers: vantagem relativa (V3), observabilidade (V2), testabilidade (V1).

Os blocos novos usam o mesmo padrão visual dos acordeões existentes: card branco, itens separados
por `1px #e6e6e6`, padding `24px 40px`, título 16px/700 `#018444` com ícone à esquerda. Abertos por
padrão.

### 4.2 Partes existentes (fidelidade)

Seguem o .json (`components` e `content`) sem alteração: breadcrumb, título, VehicleCard com
gradiente verde e seletor de cor, acordeão de itens de série com busca e contador, Incluso na
assinatura (12 itens, ícone circular `#9aef65`), Adicionais (5 itens, ícone `#018444`), formulário
com máscaras e botão desabilitado até válido, carrossel, footer e botão flutuante com badge.

Detalhes:

- **Seletor de cor:** troca o swatch ativo e o nome. A imagem não muda (só há uma foto).
- **Busca de itens de série:** filtro em tempo real, sem diferenciar acentos e maiúsculas; o contador
  mostra o total filtrado.
- **Carrossel:** CSS scroll-snap + setas + dots, sem Swiper. 3 cards ≥1200px, 2 entre 672 e 1199px,
  1 com a ponta do próximo aparecendo <672px. Swipe nativo no celular. O chip "Entrega rápida"
  aparece no primeiro modelo, como no .json.
- **Formulário:** validação por campo, só de formato. Nome com ≥ 2 caracteres, e-mail com regex
  simples, telefone com 11 dígitos, CPF (11) ou CNPJ (14) só por quantidade de dígitos, CEP com 8
  dígitos. Os checkboxes são opcionais. O texto legal é mantido. A linha do reCAPTCHA é removida
  (seria falsa no protótipo).

### 4.3 Vertente 1: mês de teste

**No formulário** (só no modo proposta), acima de "Período de assinatura":

- `SegmentedCards` "Como quer começar?" com duas opções: **Assinar agora** e
  **Mês de teste · 30 dias**. Padrão: "Assinar agora".
- Com "Mês de teste" marcado:
  - aparece a caixa informativa (fundo `#f2f2f2`, raio 16px): "Use um Dolphin da frota por 30 dias
    pagando a 1ª mensalidade. Decida até o dia 25. Se desistir, devolve sem multa. A cor e a versão
    do carro de teste podem variar.";
  - o botão de envio muda para **"Quero testar por 30 dias"**.
- Envio de formulário válido: o card do formulário troca para um estado de sucesso. Com mês de teste:
  "Pronto! Um consultor vai te chamar para configurar seu 0 km e agendar a retirada do carro de
  teste." Sem mês de teste: "Pronto! Logo entraremos em contato." Botão "Voltar ao formulário"
  restaura o form preenchido.

**Seção "Mês de teste: experimente antes de assinar"** (`id="mes-de-teste"`):

- Linha do tempo com 6 passos (horizontal ≥672px, vertical abaixo):
  1. Interesse: você escolhe a configuração do 0 km com um consultor.
  2. Crédito e contrato: com cláusula de desistência sem multa.
  3. Retirada: um carro do mesmo modelo na frota de aluguel.
  4. Apoio: tutorial de recarga, mapa de eletropostos e contatos nos dias 3, 15 e 25.
  5. Decisão: até o dia 25.
  6. Resultado: chega o 0 km (o carro de teste fica com você até a entrega) ou devolve sem multa.
- Destaque de economia: **"Até 73% mais barato que alugar um elétrico por 30 dias"**, com a linha
  "Você paga só a 1ª mensalidade do plano escolhido, e ela já conta no contrato." e a fonte em letra
  pequena (Ekko Green, diárias coletadas em maio de 2026).
- Regras em letra pequena: vale uma vez por CPF; franquia de km igual à do plano; o mês conta no prazo
  do contrato.
- Botão **"Quero testar por 30 dias"**: marca "Mês de teste" no formulário, rola até ele e foca o
  primeiro campo vazio.

O chip "Teste 30 dias antes de assinar" no título rola até esta seção.

## 5. Vertente 3A: dados reais da frota (`id="dados-frota"`)

Título "Dados reais da frota Localiza". Grade de 5 cards (2 colunas ≥672px, 1 abaixo). Cada card
mostra a dúvida em destaque e o fato abaixo:

| Dúvida | Fato (mock) | Visual |
| --- | --- | --- |
| "O carro chega aonde eu preciso?" | Autonomia real média: cidade 305 km · estrada 245 km | dois números |
| "A bateria vai estragar?" | Saúde média da bateria: 96% após 24 meses | mini gráfico SVG: 0m 100%, 6m 99%, 12m 98%, 18m 97%, 24m 96% |
| "Vou economizar de verdade?" | Custo por km em energia 74% menor que na gasolina | número em % |
| "Vou ficar sem carga no dia a dia?" | Em 97% dos dias, os assinantes rodaram menos que a autonomia | número em % |
| "Recarregar vai tomar meu tempo?" | Assinante típico recarrega cerca de 2 vezes por semana | número |

O 74% é coerente com as premissas: R$ 0,13/km contra R$ 0,50/km.

Rodapé: "Base: 412 BYD Dolphin da frota Localiza · jan. a ago. de 2026 · dados agregados e
anônimos · valores ilustrativos do protótipo."

### 5.1 Simulador público (parte da V3B na página)

Dentro da mesma seção, card "Quanto você economizaria com energia?":

- Entradas:
  - km por mês: slider de 500 a 4.000, passo 100, padrão 2.000, com o valor visível;
  - consumo do seu carro atual (km/l): número de 6 a 20, padrão 12;
  - onde você recarregaria: segmentado Casa | Trabalho | Rua, padrão Casa.
- Saída: **"Economia estimada: R$ X/mês · R$ Y/ano"**, usando `economiaEnergiaMensal` (sem diferença de
  mensalidade). Se o resultado for ≤ 0: "Com esse perfil, a energia não sai mais barata que a
  gasolina."
- "Ver premissas" (recolhível): gasolina R$ 6,00/l; energia residencial R$ 0,80/kWh; trabalho
  R$ 1,00/kWh; recarga pública R$ 2,00/kWh; eficiência do Dolphin 6 km/kWh. Os valores de trabalho e
  de recarga pública são ilustrativos.
- Link "Já é assinante de carro a combustão? Veja sua recomendação →" leva a `#/assinante`.

## 6. Vertente 2: avaliações de assinantes (`id="avaliacoes"`)

### 6.1 Resumo

- Nota geral **4,6** com estrelas e o texto "128 avaliações verificadas".
- Distribuição (barras): 5★ 95 · 4★ 22 · 3★ 6 · 2★ 3 · 1★ 2 (média 4,60).
- Notas por atributo (barras 0–5): autonomia real 4,5; facilidade de recarga 4,1; conforto 4,7;
  economia no dia a dia 4,8; atendimento Localiza 4,6.

O resumo é estático: representa as 128 avaliações, não os ~10 mocks da lista.

### 6.2 Filtros por perfil

Título "Encontre alguém com a sua rotina". Chips multi-seleção em 3 grupos:

- Uso: Cidade · Estrada
- Recarrega em: Casa · Trabalho · Rua
- Tipo: Assinante · Cliente em teste · Cliente de aluguel

Lógica: **OU** dentro do grupo, **E** entre grupos. Nenhum chip marcado mostra todas. Contador
"Mostrando X de Y". Estado vazio: "Ainda não há avaliações com esse perfil." com botão
"Limpar filtros".

### 6.3 Lista

- Começa com 3 avaliações; "Ver mais avaliações" adiciona 3 por clique. Ordem: mais recentes.
- Card: primeiro nome + cidade; selo ("Assinante verificado", "Cliente em teste" ou
  "Cliente de aluguel"); estrelas + data; tags de perfil (uso, recarga, tempo de assinatura); texto.
- Pelo menos 2 avaliações com nota 2 ou 3 e bloco aninhado **"Resposta da Localiza"** mostrando como o
  problema foi resolvido (ex.: recarga pública lenta para quem recarrega na rua; demora no
  atendimento).
- ~10 mocks cobrindo todas as combinações de filtro relevantes, com pelo menos 1 de cada tipo.

### 6.4 Nota de transparência

Texto pequeno ao fim da seção: "Publicamos avaliações positivas e negativas. A moderação remove só
ofensas, dados pessoais e conteúdo fora do tema. Quem avalia autoriza a publicação do primeiro nome e
da cidade (LGPD). Não oferecemos incentivo para avaliar."

## 7. Vertente 3B: tela do assinante (`#/assinante`)

Mesmo Header e Footer. Título "Minha assinatura", saudação ao assinante fictício ("Olá, Mariana") e
aviso **"Seu contrato termina em 87 dias"**. Card do carro atual: "Hatch 1.0 Turbo · combustão", com
ícone (sem foto).

### 7.1 Stepper (4 passos, revelados em sequência)

1. **Consentimento (LGPD):** "Podemos usar os dados de telemetria do seu carro para calcular uma
   recomendação de elétrico? Usamos só para esta finalidade." Botões: "Autorizo" e "Agora não". Com
   "Agora não", a tela mostra só "Renovar com meu carro atual" e para.
2. **Seu uso nos últimos 12 meses** (telemetria do cliente):
   - km por mês: 2.000; maior distância em um dia: 310 km; viagens longas (>150 km): cerca de 2 por
     mês (calculado dos km diários); consumo real: 12 km/l;
   - `GraficoDiasKm`: gráfico SVG com uma barra por dia (365), ordenadas do dia mais longo ao mais
     curto, e linhas horizontais da autonomia real do Dolphin (290 km) e do Dolphin Mini (190 km).
     Barras acima das linhas mudam de cor. A legenda mostra o % de dias cobertos por cada modelo.
     (Um histograma em faixas esconderia os poucos dias longos, que são justamente o ponto.)
3. **Onde você pode recarregar?** Segmentado: Em casa · No trabalho · Só na rua.
4. **Resultado:** recalcula ao trocar a opção do passo 3.

### 7.2 Resultado

**Com recomendação** (casa ou trabalho):

- "Recomendado para você: **BYD Dolphin**", com foto e "Cobre 99% dos seus dias".
- Tabela (valores calculados pela `lib`; abaixo, o caso "casa"):

  | Item | Combustão (atual) | Elétrico (recomendado) | Diferença |
  | --- | --- | --- | --- |
  | Gasto mensal com energia (2.000 km) | R$ 1.000 | R$ 260 | −R$ 740 |
  | Mensalidade | M | M + R$ 500 | +R$ 500 |
  | Custo total por mês | M + R$ 1.000 | M + R$ 760 | **−R$ 240** |

- Destaque: **"Você economiza R$ 240/mês · R$ 2.880/ano"**.
- "Outros modelos avaliados", com o motivo de cada exclusão.
- Botões: **"Testar o Dolphin por 30 dias"** (leva a `#/?teste=1` com modo proposta, ou seja,
  "Mês de teste" já marcado no form) e "Renovar com carro a combustão". O segundo mostra a confirmação "Renovação
  registrada (protótipo)."
- Nota: "Se não se adaptar no mês de teste, você renova com carro a combustão, sem multa."

**Sem recomendação** ("Só na rua"): "Hoje um elétrico não compensa para a sua rotina: com recarga
pública, a economia não cobre a diferença de mensalidade. Renove com carro a combustão, sem multa."
A lista "Outros modelos avaliados" continua visível, com os motivos.

Nota de privacidade no rodapé da tela: "A recomendação usa seus dados individuais com o seu
consentimento. Os fatos públicos da página do modelo usam dados agregados e anônimos."

## 8. Lógica (`lib/`)

### 8.1 `economia.ts`

```ts
custoKmCombustao(precoLitro: number, kmPorLitro: number): number   // arredonda a centavos
custoKmEletrico(tarifaKWh: number, kmPorKWh: number): number       // arredonda a centavos
economiaEnergiaMensal(kmMes, custoKmComb, custoKmElet): number     // kmMes × (comb − elet)
economiaLiquidaMensal(kmMes, custoKmComb, custoKmElet, deltaMensalidade): number
```

O custo por km é arredondado a centavos, como no .md (0,80 ÷ 6 → R$ 0,13), para o exemplo resultar
em R$ 240. A economia final é arredondada a reais para exibição.

### 8.2 `recomendacao.ts`

```ts
type PerfilRecarga = 'casa' | 'trabalho' | 'rua'
type Categoria = 1 | 2 | 3   // 1 hatch compacto, 2 hatch, 3 SUV

interface ModeloEletrico {
  id: string; nome: string; categoria: Categoria
  autonomiaRealKm: number; kmPorKWh: number; deltaMensalidade: number
}

interface Cliente {
  kmMes: number; kmDiarios: number[]; kmPorLitro: number
  precoGasolina: number; categoria: Categoria
}

interface Avaliacao {
  modelo: ModeloEletrico
  cobertura: number          // 0..1
  economiaLiquida: number
  motivosExclusao: string[]  // vazio = elegível
}

recomendar(cliente, perfil, modelos, tarifas, margem = 100):
  { recomendado: Avaliacao | null; avaliados: Avaliacao[] }
```

Regras (todas precisam passar):

1. `cobertura = dias com km ≤ autonomiaRealKm ÷ total de dias ≥ 0,95`.
   Motivo: "Cobre só X% dos seus dias (mínimo 95%)".
2. `modelo.categoria ≥ cliente.categoria`. Motivo: "Categoria inferior ao seu carro atual".
3. A tarifa vem do perfil de recarga (`casa` 0,80; `trabalho` 1,00; `rua` 2,00).
4. `economiaLiquida ≥ margem` (R$ 100). Motivo: "Economia abaixo da margem de segurança" (positiva,
   mas menor que a margem) ou "A economia com energia não cobre a diferença de mensalidade" (≤ 0).

Entre os elegíveis, recomenda o de **maior economia líquida**. Sem elegíveis, `recomendado = null`.

### 8.3 Mocks da V3B (`data/telemetria.ts`, `data/assinante.ts`)

| Modelo | Categoria | Autonomia real | km/kWh | Δ mensalidade |
| --- | --- | --- | --- | --- |
| BYD Dolphin Mini | 1 | 190 km | 7 | +R$ 100 |
| Geely EX2 | 1 | 230 km | 6,5 | +R$ 300 |
| BYD Dolphin | 2 | 290 km | 6 | +R$ 500 |
| Geely EX5 | 3 | 380 km | 5 | +R$ 1.200 |

A autonomia real de 290 km do Dolphin é a média ponderada do uso misto (majoritariamente cidade)
entre os 305 km de cidade e os 245 km de estrada mostrados na V3A.

Cliente: categoria 2, 2.000 km/mês, 12 km/l, gasolina R$ 6,00. `kmDiarios` tem 365 valores
determinísticos (construídos explicitamente ou por PRNG com semente fixa) com estas propriedades:
máximo de 310 km; exatamente 3 dias acima de 290 km (cobertura do Dolphin ≈ 99,2%); exatamente 29 dias
acima de 190 km (cobertura do Mini ≈ 92,1%); soma anual ≈ 24.000 km.

Resultados esperados:

| Perfil | Dolphin | EX5 | Mini / EX2 | Recomendado |
| --- | --- | --- | --- | --- |
| casa | cobre 99%, economia R$ 240 ✓ | economia negativa ✗ | categoria inferior ✗ (Mini também < 95%) | Dolphin, R$ 240 |
| trabalho | 0,17/km → R$ 160 ✓ | negativa ✗ | categoria ✗ | Dolphin, R$ 160 |
| rua | 0,33/km → −R$ 160 ✗ | negativa ✗ | categoria ✗ | nenhum |

### 8.4 `mascaras.ts` e `filtroAvaliacoes.ts`

- `mascaraTelefone` → `(99) 99999-9999`; `mascaraDocumento` → CPF `999.999.999-99` até 11 dígitos,
  CNPJ `99.999.999/9999-99` com 12–14; `mascaraCep` → `99999-999`. Todas ignoram caracteres não
  numéricos e limitam o tamanho.
- `filtrarAvaliacoes(lista, filtros)`: OU dentro do grupo, E entre grupos; filtros vazios retornam
  tudo.

## 9. Responsivo

Breakpoints do .json: xs 360, sm 672, md 1200.

| Largura | Layout |
| --- | --- |
| ≥ 1200px | Container de 1152px; 2 colunas (660 + 437, gap 48); form sticky com scroll interno; header com nav completa; carrossel com 3 cards |
| 672–1199px | 1 coluna (máx. 660px, centralizada); form ao fim da coluna; header com hamburger; carrossel com 2 cards; linha do tempo V1 horizontal |
| < 672px | Gutter de 16px; título 32px; stats, fatos e campos do form em 1 coluna (100%); linha do tempo vertical; carrossel com 1 card e a ponta do próximo; PrototypeBar só com o switch; botão flutuante compacto (ícone + badge) |

- Alvos de toque ≥ 44px. Sem scroll horizontal da página em 360px.
- Os chips do título e os botões da V1 levam ao form em qualquer largura (rolagem suave, respeitando
  `prefers-reduced-motion`).

## 10. Acessibilidade

- Acordeões com `button` + `aria-expanded` + `aria-controls`.
- Switch Atual/Proposta com `role="switch"` + `aria-checked`.
- `SegmentedCards` como `radiogroup`.
- Chips de filtro com `aria-pressed`.
- Foco visível: anel de 2px `#005c3a`.
- Gráficos SVG com `role="img"` e `aria-label` descrevendo o dado.
- Estrelas com texto alternativo ("Nota 4,6 de 5").
- Contraste AA nos textos novos. VertenteTag `#09547c` sobre `#d8effd` passa.

## 11. Assets (copiados para `prototipo/public/assets/`)

Baixados das URLs do .json com confirmação prévia do usuário:

- logo positivo e logo negativo (se a URL do negativo falhar, usar o positivo com
  `filter: brightness(0) invert(1)` no footer);
- imagem principal do Dolphin;
- 5 imagens dos modelos relacionados;
- `favicon.ico`.

O fundo decorativo (`linhas.svg`) é desenhado no próprio protótipo: as SVGs originais
(`graph_forms*.svg`) só são servidas pelo otimizador de imagens do Next.js, não diretamente. Os logos
respondem 403 para `curl` e são extraídos pelo navegador; se falhar, usa-se um logo SVG de texto como
fallback. A fonte Inter é self-hosted via `@fontsource/inter`.

O formato de cada imagem é detectado pelo content-type, e a extensão é salva de acordo.

## 12. Testes e verificação

**Vitest (unitário, lógica pura):**

- `economia`: caso do .md (2.000 km; R$ 6,00 e 12 km/l; R$ 0,80/kWh e 6 km/kWh; Δ R$ 500) resulta em
  custo/km 0,50 e 0,13, energia 1.000 e 260, economia líquida **240**.
- `recomendacao`: casa → Dolphin com 240; trabalho → Dolphin com 160; rua → `null`; Mini excluído por
  cobertura e categoria; EX5 excluído por economia; cobertura do Dolphin ≥ 0,99.
- `assinante` (dados): `kmDiarios` tem 365 valores, máximo 310, 3 acima de 290, 29 acima de 190.
- `mascaras`: telefone, CPF, CNPJ e CEP com entradas parciais e com lixo.
- `filtroAvaliacoes`: OU dentro do grupo, E entre grupos, vazio retorna tudo.

**Verificação visual** (browser pane, build de produção via `vite preview` com o base path):

- Larguras 375, 768 e 1391px.
- Página do modelo nos dois modos; tela do assinante nos 3 perfis de recarga.
- Fluxos: toggle de modo (inclusive via `?modo=atual`), chips → âncoras, V1 → form com mês de teste,
  envio válido → sucesso, filtros → estado vazio → limpar, assinante → "Testar 30 dias" → form
  pré-marcado.
- Console sem erros; nenhum scroll horizontal.

## 13. Fora de escopo

- Backend, envio real de formulário, reCAPTCHA, analytics.
- Páginas de outros modelos ("Ver carro" e "Tenho interesse" do carrossel mostram o toast).
- Imagens por cor do veículo.
- Modo escuro, internacionalização.
- Preços absolutos da Localiza em qualquer tela.
