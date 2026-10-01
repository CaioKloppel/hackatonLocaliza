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
