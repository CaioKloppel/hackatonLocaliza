import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ModeloPage } from '../../pages/ModeloPage/ModeloPage'
import { renderComProviders } from '../../test/render'

const semParams = new URLSearchParams()

describe('Vertente 1 na página do modelo', () => {
  it('proposta mostra chips e a seção com 6 passos', async () => {
    renderComProviders(<ModeloPage params={semParams} />)
    await userEvent.setup().click(screen.getByRole('button', { name: /mês de teste: experimente/i }))
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
    await user.click(screen.getByRole('button', { name: /mês de teste: experimente/i }))
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
it('#/?orcamento=1 não volta ao topo e limpa o hash', () => {
    vi.mocked(window.scrollTo).mockClear()
    renderComProviders(<ModeloPage params={new URLSearchParams('orcamento=1')} />, '/#/?orcamento=1')
    expect(window.scrollTo).not.toHaveBeenCalled()
    expect(window.location.hash).toBe('#/')
    expect(screen.getByRole('radio', { name: /assinar agora/i })).toBeChecked()
  })
it('chips do título abrem a seção fechada', async () => {
    const user = userEvent.setup()
    renderComProviders(<ModeloPage params={semParams} />)
    const gatilho = screen.getByRole('button', { name: /avaliações de assinantes/i })
    expect(gatilho).toHaveAttribute('aria-expanded', 'false')
    await user.click(screen.getByRole('link', { name: /4,6 · 128 avaliações/i }))
    expect(gatilho).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getByRole('link', { name: /teste 30 dias antes de assinar/i }))
    expect(screen.getByRole('button', { name: /mês de teste: experimente/i })).toHaveAttribute('aria-expanded', 'true')
  })
})
