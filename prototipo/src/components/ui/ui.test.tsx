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
