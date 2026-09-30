# Test Drive de Rotina — brainstorming e formalização

> Evolução da parte 2 ("Entrada segura") da proposta **Elétrico sem risco** — Ideathon Localiza Assinatura · PoliWeek PUCPR 2026.
>
> **Nota de confidencialidade:** os números marcados como confidenciais no PDF original **não** foram copiados para este arquivo. Onde eles fazem falta, aparece `[dado confidencial — ver PDF]`.

---

## 0. TL;DR

**Ideia:** antes de assinar, o cliente vive **7 dias com um elétrico na rotina real dele** (casa → trabalho → mercado → fim de semana), com entrega em casa, carregador portátil e acompanhamento pela telemetria. No fim, recebe um **Relatório da Sua Semana Elétrica** com os números *dele* (km, gasto real de energia × gasolina, recargas, menor carga atingida). Se assinar, **o valor do teste é 100% abatido** e o contrato vem com uma **Garantia de Adaptação de 90 dias** (troca por híbrido ou combustão sem multa).

**Frase de pitch:** *"Não pedimos que você confie no elétrico. Pedimos 7 dias — e mostramos os seus números."*

---

## 1. O que o PDF já tem de bom (manter)

| Ponto forte | Por quê importa |
|---|---|
| Ataca o **momento da desistência** ("percebe risco na troca") | É onde a própria Localiza diz que o funil quebra |
| Usa **ativos que a Localiza já tem** (telemetria, agências, frota BYD) | Baixo custo de implementação, argumento de "só a Localiza consegue" |
| Separa **antes / na decisão / depois** | Estrutura clara para o pitch |
| Admite o que **não** resolve (preço, sem garagem) | Credibilidade com a banca |

## 2. O que mudou desde o PDF (pesquisa na internet)

1. **A premissa "contrato mínimo de 12 meses" ficou desatualizada.** Em set/2026 a Localiza Meoo virou **Localiza Assinatura** e lançou planos de **3, 6 e 9 meses** (além dos 12–48). Nos planos < 12 meses os carros são **da frota já existente** (não 0 km) e a mensalidade é **mais cara**, porque diluem preparação e desmobilização em menos meses. Um estudo da própria empresa apontou que **73% dos consumidores** têm forte interesse em contratos de menos de um ano. ([InfoMoney](https://www.infomoney.com.br/consumo/localiza-meoo-vira-localiza-assinatura-e-lanca-planos-a-partir-de-3-meses/), [Autos Segredos](https://www.autossegredos.com.br/mercado/localiza/localiza-assinatura-meoo-muda-nome-planos-3-meses/))
   - ➜ **Consequência para a ideia:** "entrada segura = contrato curto" a Localiza **já fez**. O diferencial precisa ser outro: **um teste barato e curto que gera evidência pessoal**, e **segurança dentro do contrato longo** (que é onde o elétrico 0 km está).
2. **A multa atual é o que o cliente teme.** Rescisão antecipada: 30% das parcelas restantes (12 m), 25% (18 m), 20% (24 m), 15% (36 m), 10% (48 m); há reclamações recorrentes de "multa abusiva" no Reclame Aqui. ([Reclame Aqui](https://www.reclameaqui.com.br/localiza-meoo/cobranca-abusiva-de-multa-por-rescisao-antecipada-de-contrato-de-carro-por-assinatura-localiza_6jSPewi6QCEXNGax/))
   - ➜ A Garantia de Adaptação troca o medo da multa por uma regra clara e positiva.
3. **O consumidor está recuando.** A preferência por combustão subiu de **35% para 49%** e a de 100% elétrico ficou estável em **9%** (EY, jun/2026). 39% adiam a compra, principalmente por infraestrutura de recarga. ([EY](https://www.ey.com/pt_br/newsroom/2026/06/aumenta-preferencia-consumidor-veiculo-combustao-estudo-ey), [Automotive Business](https://www.automotivebusiness.com.br/noticias/carros-eletricos-no-brasil-consumidor-adia-compra-pesquisa-ey))
   - ➜ Argumento novo: não basta o cliente *querer*; ele precisa de **prova** para não voltar ao combustão.
4. **Experiência prática converte.** Entre donos de híbrido/elétrico, **35%** dizem que o interesse surgiu depois de um test drive (pesquisa citada por [O Tempo, set/2026](https://www.otempo.com.br/autotempo/2026/9/23/carros-hibridos-e-eletricos-ja-sao-os-preferidos-dos-brasileiros-aponta-pesquisa) — *confirmar fonte primária*). Programas "try before you buy" nos EUA e Austrália usam janelas de **30 dias a 6 semanas**. ([GoAuto](https://premium.goauto.com.au/try-before-you-buy-for-ev-shoppers/), [Fox56](https://fox56news.com/news/kentucky/try-before-you-buy-how-you-can-test-drive-an-electric-car-in-kentucky-for-up-to-6-weeks/))
5. **A frota para o teste já existe.** Acordo Localiza × BYD: **10 mil** elétricos e híbridos em 2 anos (Song Plus, Song Pro, Dolphin, Dolphin Mini), para aluguel diário, assinatura, frotas e seminovos. O presidente da BYD Brasil disse que o acordo permite ao motorista **"testar a tecnologia no dia a dia antes de decidir"**. Eletrificados ainda são ~2% de uma frota de 630 mil+. ([Diário do Comércio](https://diariodocomercio.com.br/negocios/localiza-byd-10-mil-veiculos-eletricos/), [Canal VE](https://canalve.com.br/localiza-compra-10-mil-carros-eletricos-hibridos-byd/))
6. **Referências de preço:** aluguel diário de elétrico ~R$ 150–350; assinatura BYD de ~R$ 2.700 a ~R$ 5.000/mês; wallbox residencial custa R$ 3.000–8.000 instalado. ([Moura](https://www.moura.com.br/blog/aluguel-de-carro-eletrico), [Vrum](https://www.vrum.com.br/bom-negocio/2026/03/7367187-carro-eletrico-por-assinatura-vale-a-pena-veja-os-custos-e-vantagens.html), [Seu Posto](https://www.seuposto.com/guia-definitivo-2026-como-escolher-o-carregador-de-carro-eletrico-ideal-para-sua-casa-empresa-ou-condominio))
7. **Revenda é o risco da Localiza.** Elétricos ano 2023 desvalorizaram **46,1%** até ago/2026, contra 26,1% dos híbridos e 19,6% dos a combustão; o laudo de saúde da bateria (SoH) virou item obrigatório no usado. ([InfoMoney](https://www.infomoney.com.br/minhas-financas/carros-usados-seguem-em-alta-em-2026-mas-eletricos-ampliam-desvalorizacao/), [O Tempo](https://www.otempo.com.br/autotempo/2026/9/24/carro-eletrico-usado-vale-a-pena-veja-bateria-garantia-e-custos-de-manutencao))

## 3. Divergência — formatos de test drive considerados

| # | Formato | Prós | Contras | Veredito |
|---|---|---|---|---|
| A | Test drive tradicional (30 min na agência) | Barato | Não testa recarga nem rotina — é justamente o que gera medo | ❌ |
| B | Aluguel diário comum de elétrico | Já existe | 1–2 dias não mostra rotina; cliente devolve sem aprender nada; sem ponte para a assinatura | ❌ sozinho |
| C | **7 dias em casa + relatório de telemetria** | Cobre uma semana inteira (dias úteis + fim de semana); gera prova personalizada; usa frota de aluguel | Custo operacional de entrega/coleta | ✅ **núcleo** |
| D | 30 dias pago | Mais evidência | Já compete com o plano de 3 meses; caro para quem só está em dúvida | ⚠️ opcional |
| E | **Garantia de Adaptação 90 dias no contrato** | Remove o medo da multa no contrato 0 km | Custo de troca a medir | ✅ **complemento** |
| F | Test drive de estrada (1 viagem longa guiada) | Ataca medo de autonomia em viagem | Nicho | ➕ add-on do C |
| G | "Assinante embaixador" (vizinho com elétrico mostra a rotina) | Prova social, custo ~zero | Difícil escalar/controlar | 💡 fase futura |
| H | Simulador digital sem carro | Escala infinita | Não gera confiança sozinho | ✅ já é a parte 1 (comparador) |

**Convergência:** C + E, com F como opcional. O comparador (parte 1) vira a **porta de entrada** para o teste, e a recarga operada (parte 3) é o que o cliente **experimenta** durante o teste.

## 4. Formalização — Test Drive de Rotina

### 4.1 Jornada

```
Comparador (app/site)
   └─ "Seu uso cabe num elétrico. Quer provar por 7 dias?"
        │
Dia 0  Entrega em casa: BYD da frota de aluguel + carregador portátil (tomada comum)
       + 15 min de onboarding (recarga, app, regenerativa, onde carregar perto)
Dia 1–7  Rotina real. Telemetria acompanha. Push diário curto:
         "Hoje: 42 km · R$ 5,10 de energia · teria gasto R$ 20 com gasolina"
         Alerta proativo se a carga cair abaixo de 20%
Dia 3  Check-in humano (WhatsApp/Liza): "alguma dúvida?"
Dia 7  Coleta em casa + Relatório da Sua Semana Elétrica + oferta personalizada
        │
        ├─ Assina (≥ 12 meses, 0 km) → valor do teste abatido 100%
        │     + Garantia de Adaptação 90 dias + visita técnica do wallbox agendada
        ├─ Quer mais prazo → plano de 3 meses com o mesmo carro (frota existente)
        └─ Não é agora → relatório fica salvo; se o motivo for "sem garagem",
              entra na lista do futuro plano "sem garagem"
```

### 4.2 O Relatório da Sua Semana Elétrica (o coração da ideia)

É o que transforma "teste" em **decisão**. Gerado automaticamente a partir da telemetria:

- **Km rodados** na semana e projeção mensal.
- **Custo de energia real** × custo equivalente em gasolina/etanol (referência: R$ 11–14 vs. ~R$ 48 a cada 100 km — [Vrum, ago/2026](https://www.vrum.com.br/avaliacoes/2026/08/7484820-quanto-custa-rodar-100-km-com-carro-eletrico-em-2026.html)).
- **Menor nível de bateria** atingido → "Você nunca ficou abaixo de 38%. Sua autonomia sobrou."
- **Onde carregou** (casa × público) e quanto tempo levou.
- **Projeção 12 meses**: mensalidade da assinatura − economia de combustível − IPVA/seguro/manutenção que já estão inclusos.
- **Recomendação de plano e modelo** (ex.: "Dolphin Mini atende 100% da sua semana").

> Exemplo ilustrativo: 1.000 km/mês → ~R$ 480 de gasolina × ~R$ 125 de energia em casa = **~R$ 355/mês de economia**, ~R$ 4.300/ano.

### 4.3 Regras propostas

| Regra | Proposta | Motivo |
|---|---|---|
| Quem pode | Leads com proposta/simulação de assinatura aberta; 1 teste por CPF | Evita uso como "aluguel barato" |
| Preço | Taxa simbólica (ex.: R$ 299–499 a validar) ou diária promocional | Filtra curioso sem intenção; vira crédito |
| Abatimento | 100% do valor pago vira desconto na 1ª mensalidade se assinar em até 15 dias | Cria urgência e remove custo percebido |
| Km | Franquia de ~1.000 km na semana | Suficiente para rotina + 1 viagem |
| Carro | Frota de aluguel BYD (não 0 km) | Custo marginal baixo; carro volta para aluguel |
| Recarga | Carregador portátil incluso; 1ª recarga pública paga pela Localiza | Testa recarga sem investimento em wallbox |
| Garantia de Adaptação | Nos primeiros 90 dias do contrato, **1 troca** por híbrido ou combustão da mesma faixa, **sem multa**; mensalidade ajusta ao novo modelo | Resolve o medo da multa (30% das parcelas restantes) |
| Condição da garantia | Carro sem avarias além do uso normal; km dentro da franquia | Protege a Localiza |

### 4.4 Por que a Localiza aguenta o custo (hipóteses a validar)

- O carro do teste **já existe** na frota de aluguel; custo marginal ≈ preparação + entrega/coleta + ociosidade de 7 dias.
- O elétrico devolvido na Garantia de Adaptação pode ir para os **planos de 3–9 meses** (que já usam frota existente) ou para o aluguel — **não precisa ir para revenda**, o que evita a desvalorização de 46%.
- Ordem de grandeza: um contrato de 12 meses a ~R$ 3.500/mês ≈ **R$ 42 mil** de receita. Se o teste custa ~R$ 1.000–1.500 de operação, ele se paga em receita se converter **1 em cada ~30** testes. *(Receita, não margem — a margem real precisa vir da Localiza.)*
- Taxa de troca esperada baixa: quem troca depois de 7 dias de teste + relatório já filtrou a maior parte da incerteza.

## 5. Como resolve as dores do desafio

| Dor | Como o Test Drive de Rotina resolve |
|---|---|
| Conversão de elétrico muito menor que de combustão `[dado confidencial — ver PDF]` | Troca argumento genérico por **prova pessoal** no momento da desistência |
| Insegurança sobre autonomia/recarga | O cliente **vê** a menor carga da semana e onde carregou |
| Dificuldade de comparar custo | Relatório com o gasto **real** dele × gasolina |
| Medo de ficar preso num contrato | Garantia de Adaptação de 90 dias, 1 troca sem multa |
| Transformar curiosidade em experimentação | É literalmente "mais do que um test-drive" |
| Onboarding em recarga | Onboarding acontece **antes** de assinar, com suporte ativo |

## 6. Piloto (3 meses) e métricas

**Desenho:** 1–2 cidades com BYD na frota de aluguel (ex.: Curitiba + BH). Leads que chegam ao comparador são sorteados em 3 grupos:

| Grupo | Oferta |
|---|---|
| Controle | Jornada atual |
| B | Test Drive de Rotina (7 dias + relatório) |
| C | Test Drive de Rotina + Garantia de Adaptação 90 dias |

**Métricas:**
- Primária: **conversão lead → contrato de elétrico** por grupo.
- Secundárias: % que aceita o teste; % teste → contrato; taxa de uso da Garantia de Adaptação; NPS de 30 dias; custo por contrato convertido; ocorrências de "carro sem carga".
- Aprendizado: motivos de não conversão (sem garagem? preço? autonomia?) — vira backlog de produto.

**Critério de sucesso (proposta):** grupo C com conversão ≥ 2× o controle e custo por contrato abaixo do CAC atual `[a obter com a Localiza]`.

## 7. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Uso do teste como aluguel barato | Só para leads com proposta; 1 por CPF; taxa não-zero; franquia de km |
| Cliente sem garagem tem experiência ruim | É informação honesta: o relatório mostra; oferecer 1ª recarga pública paga e lista de espera do plano "sem garagem" |
| Canibalizar aluguel mensal / plano de 3 meses | Teste é curto (7 dias) e amarrado à conversão em contrato ≥ 12 meses |
| Excesso de trocas na Garantia de Adaptação | 1 troca; mesma faixa; só nos 90 primeiros dias; medir no piloto |
| LGPD na telemetria | Consentimento explícito no aceite do teste; relatório só para o próprio cliente |
| CDC (arrependimento de 7 dias em contratação online) | A garantia é **mais ampla** que o mínimo legal — vira argumento de marketing, não conflito |

## 8. Perguntas para os mentores da Localiza

1. Os BYD da frota de aluguel podem ser alocados para testes de 7 dias com entrega em casa? Qual o custo de entrega/coleta?
2. Qual o custo real de uma troca de carro no meio do contrato (preparação, logística, reprecificação)?
3. Qual o CAC atual de um contrato de assinatura de elétrico?
4. Os planos de 3–9 meses já incluem elétricos? Qual a diferença de mensalidade vs. 12 meses?
5. A telemetria dos BYD já entrega SoC (nível de carga) e eventos de recarga em tempo real?
6. Existe restrição regulatória/seguro para carregador portátil em residência do cliente?

## 9. Encaixe no PDF original

- **Parte 1 (Comparador)** → passa a terminar com o CTA "Prove por 7 dias".
- **Parte 2 (Entrada segura)** → reescrita como **Test Drive de Rotina + Garantia de Adaptação 90 dias**, e cita explicitamente os novos planos de 3–9 meses como alternativa já existente (mostra que o time está atualizado).
- **Parte 3 (Recarga operada)** → o cliente experimenta ela **durante** o teste, não só depois.
- **Seção "Por que a Localiza"** → acrescentar: acordo BYD (10 mil carros para aluguel **e** assinatura), 70 mil assinantes com crescimento de 14% a/a, e a declaração da BYD sobre "testar no dia a dia antes de decidir".

---

## Fontes

- PDF "Elétrico sem risco" (proposta do time, PoliWeek PUCPR 2026)
- [InfoMoney — Localiza Meoo vira Localiza Assinatura e lança planos a partir de 3 meses](https://www.infomoney.com.br/consumo/localiza-meoo-vira-localiza-assinatura-e-lanca-planos-a-partir-de-3-meses/)
- [Autos Segredos — Localiza troca nome do Meoo e amplia planos](https://www.autossegredos.com.br/mercado/localiza/localiza-assinatura-meoo-muda-nome-planos-3-meses/)
- [Movenews — Localiza Meoo cinco anos, rumo a 100 mil carros](https://www.movenews.com.br/localiza-meoo-celebra-cinco-anos-no-brasil-e-mira-a-marca-de-100-mil-carros-por-assinatura/)
- [Reclame Aqui — multa por rescisão antecipada](https://www.reclameaqui.com.br/localiza-meoo/cobranca-abusiva-de-multa-por-rescisao-antecipada-de-contrato-de-carro-por-assinatura-localiza_6jSPewi6QCEXNGax/)
- [Diário do Comércio — Localiza × BYD, 10 mil veículos](https://diariodocomercio.com.br/negocios/localiza-byd-10-mil-veiculos-eletricos/)
- [Canal VE — Localiza compra 10 mil carros BYD](https://canalve.com.br/localiza-compra-10-mil-carros-eletricos-hibridos-byd/)
- [EY — Aumenta preferência por combustão (jun/2026)](https://www.ey.com/pt_br/newsroom/2026/06/aumenta-preferencia-consumidor-veiculo-combustao-estudo-ey)
- [Automotive Business — consumidor adia compra de elétrico (EY)](https://www.automotivebusiness.com.br/noticias/carros-eletricos-no-brasil-consumidor-adia-compra-pesquisa-ey)
- [O Tempo — híbridos e elétricos preferidos (set/2026)](https://www.otempo.com.br/autotempo/2026/9/23/carros-hibridos-e-eletricos-ja-sao-os-preferidos-dos-brasileiros-aponta-pesquisa)
- [O Tempo — elétrico usado, bateria e garantia (set/2026)](https://www.otempo.com.br/autotempo/2026/9/24/carro-eletrico-usado-vale-a-pena-veja-bateria-garantia-e-custos-de-manutencao)
- [InfoMoney — elétricos ampliam desvalorização](https://www.infomoney.com.br/minhas-financas/carros-usados-seguem-em-alta-em-2026-mas-eletricos-ampliam-desvalorizacao/)
- [Vrum — custo de rodar 100 km com elétrico (ago/2026)](https://www.vrum.com.br/avaliacoes/2026/08/7484820-quanto-custa-rodar-100-km-com-carro-eletrico-em-2026.html)
- [Vrum — elétrico por assinatura vale a pena?](https://www.vrum.com.br/bom-negocio/2026/03/7367187-carro-eletrico-por-assinatura-vale-a-pena-veja-os-custos-e-vantagens.html)
- [Moura — aluguel de carro elétrico, preços](https://www.moura.com.br/blog/aluguel-de-carro-eletrico)
- [Seu Posto — custo de wallbox](https://www.seuposto.com/guia-definitivo-2026-como-escolher-o-carregador-de-carro-eletrico-ideal-para-sua-casa-empresa-ou-condominio)
- [GoAuto — try before you buy para EV](https://premium.goauto.com.au/try-before-you-buy-for-ev-shoppers/)
- [Fox56 — test drive de elétrico por até 6 semanas (Kentucky)](https://fox56news.com/news/kentucky/try-before-you-buy-how-you-can-test-drive-an-electric-car-in-kentucky-for-up-to-6-weeks/)
