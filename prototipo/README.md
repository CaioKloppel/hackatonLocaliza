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
