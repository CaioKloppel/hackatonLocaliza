import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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
  it('#/assinante mostra a tela do assinante e troca o switch por um link de volta', () => {
    renderComProviders(<App />, '/#/assinante')
    expect(screen.getByRole('heading', { level: 1, name: 'Minha assinatura' })).toBeInTheDocument()
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '← Página do modelo' })).toHaveAttribute('href', '#/')
  })
it('link ?modo=atual#/assinante força o modo proposta', () => {
    renderComProviders(<App />, '/?modo=atual#/assinante')
    expect(window.location.search).toBe('?modo=proposta')
    expect(screen.getByRole('button', { name: 'Área do assinante' })).toBeInTheDocument()
  })

  it('"Solicitar orçamento" do header na tela do assinante leva ao formulário', async () => {
    const user = userEvent.setup()
    renderComProviders(<App />, '/#/assinante')
    vi.mocked(window.scrollTo).mockClear()
    await user.click(screen.getAllByRole('button', { name: 'Solicitar orçamento' })[0])
    expect(await screen.findByRole('heading', { level: 1, name: 'BYD Dolphin' })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/')
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
it('#/relatorio abre o relatório do dia 25 em modo proposta', () => {
    renderComProviders(<App />, '/?modo=atual#/relatorio')
    expect(screen.getByRole('button', { name: /seu mês em números está pronto/i })).toBeInTheDocument()
    expect(window.location.search).toBe('?modo=proposta')
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
  })

  it('barra do protótipo tem link para o relatório do dia 25', () => {
    renderComProviders(<App />)
    expect(screen.getByRole('link', { name: 'Relatório do dia 25 (V1)' })).toHaveAttribute('href', '#/relatorio')
  })
})
