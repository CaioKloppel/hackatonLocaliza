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

    await user.type(within(secao).getByRole('searchbox'), 'ELETRIC')
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
