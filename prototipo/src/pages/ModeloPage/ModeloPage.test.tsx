import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderComProviders } from '../../test/render'
import { ModeloPage } from './ModeloPage'

describe('ModeloPage — conteúdo existente', () => {
  it('mostra título, versão e formulário', () => {
    renderComProviders(<ModeloPage params={new URLSearchParams()} />)
    expect(screen.getByRole('heading', { level: 1, name: 'BYD Dolphin' })).toBeInTheDocument()
    expect(screen.getByText('EV 44KW Elétrico AT')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Preencha seus dados' })).toBeInTheDocument()
  })

  it('busca de itens de série ignora acentos e atualiza o contador', async () => {
    const user = userEvent.setup()
    renderComProviders(<ModeloPage params={new URLSearchParams()} />)
    await user.click(screen.getByRole('button', { name: /itens de série/i }))
    const secao = document.getElementById('itens-de-serie')!
    const lista = () => within(secao).queryAllByRole('listitem')
    expect(lista()).toHaveLength(19)
    expect(within(secao).getByText('19')).toBeInTheDocument()

    await user.type(within(secao).getByRole('searchbox'), 'ELETRIC')
    expect(lista()).toHaveLength(3)
    expect(within(secao).getByText('3')).toBeInTheDocument()

    await user.clear(within(secao).getByRole('searchbox'))
    await user.type(within(secao).getByRole('searchbox'), 'xyz')
    expect(lista()).toHaveLength(0)
    expect(within(secao).getByText('Nenhum item encontrado.')).toBeInTheDocument()
  })

  it('seletor de cor troca a cor ativa, o nome e a foto', async () => {
    const user = userEvent.setup()
    renderComProviders(<ModeloPage params={new URLSearchParams()} />)
    const grupo = screen.getByRole('radiogroup', { name: 'Cor do veículo' })
    expect(within(grupo).getAllByRole('radio').map((r) => r.getAttribute('aria-label'))).toEqual([
      'Cheese White',
      'Obsidian Black',
      'Time Grey',
    ])
    expect(screen.getByRole('img', { name: /BYD Dolphin na cor Cheese White/ })).toHaveAttribute('src', expect.stringMatching(/byd-dolphin.webp$/))
    await user.click(within(grupo).getByRole('radio', { name: 'Obsidian Black' }))
    expect(within(grupo).getByRole('radio', { name: 'Obsidian Black' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('Obsidian Black', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /BYD Dolphin na cor Obsidian Black/ })).toHaveAttribute('src', expect.stringMatching(/byd-dolphin-obsidian-black.webp$/))
    await user.click(within(grupo).getByRole('radio', { name: 'Time Grey' }))
    expect(screen.getByRole('img', { name: /BYD Dolphin na cor Time Grey/ })).toHaveAttribute('src', expect.stringMatching(/byd-dolphin-time-grey.webp$/))
  })

  it('lista incluso (12) e adicionais (5)', async () => {
    renderComProviders(<ModeloPage params={new URLSearchParams()} />)
    await userEvent.setup().click(screen.getByRole('button', { name: /^adicionais$/i }))
    expect(within(document.getElementById('incluso')!).getAllByRole('heading', { level: 3 })).toHaveLength(12)
    expect(within(document.getElementById('adicionais')!).getAllByRole('heading', { level: 3 })).toHaveLength(5)
    expect(screen.getByText('e muito mais!').tagName).toBe('STRONG')
  })

  it('carrossel mostra 5 modelos e links desativados avisam', async () => {
    const user = userEvent.setup()
    renderComProviders(<ModeloPage params={new URLSearchParams()} />)
    const carrossel = screen.getByRole('region', { name: /outros modelos/i })
    expect(within(carrossel).getAllByRole('article')).toHaveLength(5)
    expect(within(carrossel).getAllByText('Entrega rápida')).toHaveLength(1)
    await user.click(within(carrossel).getAllByRole('button', { name: 'Tenho Interesse' })[0])
    expect(screen.getByRole('status')).toHaveTextContent('Link desativado no protótipo')
  })
it('na proposta, as seções seguem a ordem combinada', () => {
    renderComProviders(<ModeloPage params={new URLSearchParams()} />)
    const ordem = ['itens-de-serie', 'incluso', 'dados-frota', 'mes-de-teste', 'adicionais', 'avaliacoes']
    const posicoes = ordem.map((id) => [...document.querySelectorAll('section[id]')].findIndex((s) => s.id === id))
    expect(posicoes.every((p) => p >= 0)).toBe(true)
    expect([...posicoes].sort((a, b) => a - b)).toEqual(posicoes)
  })
it('ao entrar, só "Incluso na assinatura" começa aberto', () => {
    renderComProviders(<ModeloPage params={new URLSearchParams()} />)
    const expandido = (nome: RegExp) => screen.getByRole('button', { name: nome }).getAttribute('aria-expanded')
    expect(expandido(/incluso na assinatura/i)).toBe('true')
    for (const nome of [/itens de série/i, /dados reais da frota/i, /mês de teste: experimente/i, /^adicionais$/i, /avaliações de assinantes/i]) {
      expect(expandido(nome)).toBe('false')
    }
  })
})
