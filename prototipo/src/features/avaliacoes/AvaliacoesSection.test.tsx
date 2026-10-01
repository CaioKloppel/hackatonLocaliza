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
