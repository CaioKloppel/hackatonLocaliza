import { screen } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { InicioProvider } from '../../features/mes-de-teste/InicioContext'
import { renderComProviders } from '../../test/render'
import { QuoteForm } from './QuoteForm'

function renderForm(url = '/') {
  return renderComProviders(
    <InicioProvider>
      <QuoteForm />
    </InicioProvider>,
    url,
  )
}

async function preencherValido(user: UserEvent) {
  await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
  await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
  await user.type(screen.getByLabelText('Telefone'), '41999998888')
  await user.type(screen.getByLabelText('CPF ou CNPJ'), '12345678901')
  await user.type(screen.getByLabelText('CEP'), '80000000')
}

describe('QuoteForm', () => {
  it('mantém o envio desabilitado até o formulário ficar válido', async () => {
    const user = userEvent.setup()
    renderForm()
    const enviar = screen.getByRole('button', { name: 'Solicitar orçamento' })
    expect(enviar).toBeDisabled()
    await preencherValido(user)
    expect(screen.getByLabelText('Telefone')).toHaveValue('(41) 99999-8888')
    expect(screen.getByLabelText('CPF ou CNPJ')).toHaveValue('123.456.789-01')
    expect(screen.getByLabelText('CEP')).toHaveValue('80000-000')
    expect(enviar).toBeEnabled()
  })

  it('nome só com espaços volta a desabilitar o envio', async () => {
    const user = userEvent.setup()
    renderForm()
    await preencherValido(user)
    await user.clear(screen.getByLabelText('Nome'))
    await user.type(screen.getByLabelText('Nome'), '   ')
    expect(screen.getByRole('button', { name: 'Solicitar orçamento' })).toBeDisabled()
  })

  it('mostra o erro só depois de sair do campo', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('E-mail'), 'ana@')
    expect(screen.queryByText('Digite um e-mail válido.')).not.toBeInTheDocument()
    await user.tab()
    expect(screen.getByText('Digite um e-mail válido.')).toBeInTheDocument()
  })

  it('no modo atual não mostra a escolha de início', () => {
    renderForm('/?modo=atual')
    expect(screen.queryByRole('group', { name: 'Como quer começar?' })).not.toBeInTheDocument()
  })

  it('mês de teste muda o botão e mostra a explicação', async () => {
    const user = userEvent.setup()
    renderForm()
    expect(screen.getByRole('radio', { name: /assinar agora/i })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: /mês de teste/i }))
    expect(screen.getByText(/decida até o dia 25/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quero testar por 30 dias' })).toBeDisabled()
  })

  it('envio válido mostra sucesso e "Voltar" restaura o formulário preenchido', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('radio', { name: /mês de teste/i }))
    await preencherValido(user)
    await user.click(screen.getByRole('button', { name: 'Quero testar por 30 dias' }))
    expect(screen.getByText(/agendar a retirada do carro de teste/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Voltar ao formulário' }))
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana Souza')
  })

  it('sem mês de teste o sucesso é o genérico', async () => {
    const user = userEvent.setup()
    renderForm()
    await preencherValido(user)
    await user.click(screen.getByRole('button', { name: 'Solicitar orçamento' }))
    expect(screen.getByText('Logo entraremos em contato.')).toBeInTheDocument()
  })
})
