import { screen, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderComProviders } from '../../test/render'
import { RelatorioPage } from './RelatorioPage'

async function abrirRelatorio(user: UserEvent) {
  await user.click(screen.getByRole('button', { name: /seu mês em números está pronto/i }))
}

describe('RelatorioPage', () => {
  it('começa pela notificação do dia 25, com o relatório escondido', () => {
    renderComProviders(<RelatorioPage />, '/#/relatorio')
    expect(screen.getByRole('button', { name: /seu mês em números está pronto/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'Seu mês em números' })).not.toBeInTheDocument()
  })

  it('tocar na notificação mostra os números do mês', async () => {
    const user = userEvent.setup()
    renderComProviders(<RelatorioPage />, '/#/relatorio')
    await abrirRelatorio(user)
    expect(screen.getByRole('heading', { level: 1, name: 'Seu mês em números' })).toBeInTheDocument()
    expect(screen.getByText('1.212 km')).toBeInTheDocument()
    expect(screen.getByText(/dia 13 · 210 km/i)).toBeInTheDocument()
    expect(screen.getByText('9 recargas')).toBeInTheDocument()
    const recargas = screen.getByRole('list', { name: 'Recargas por local' })
    expect(within(recargas).getByText('Casa').parentElement).toHaveTextContent('6')
    expect(screen.getByText('Sobrou em todos os 25 dias')).toBeInTheDocument()
    expect(screen.getByText('R$ 191')).toBeInTheDocument()
    expect(screen.getByText('R$ 606')).toBeInTheDocument()
    expect(screen.getByText('Você economizou R$ 415')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /quilômetros por dia/i })).toBeInTheDocument()
  })

  it('"Quero meu 0 km" confirma o pedido', async () => {
    const user = userEvent.setup()
    renderComProviders(<RelatorioPage />, '/#/relatorio')
    await abrirRelatorio(user)
    await user.click(screen.getByRole('button', { name: 'Quero meu 0 km' }))
    expect(screen.getByText(/pedido do seu 0 km registrado/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Devolver sem multa' })).not.toBeInTheDocument()
  })

  it('"Devolver sem multa" pede o motivo antes de enviar', async () => {
    const user = userEvent.setup()
    renderComProviders(<RelatorioPage />, '/#/relatorio')
    await abrirRelatorio(user)
    await user.click(screen.getByRole('button', { name: 'Devolver sem multa' }))
    const enviar = screen.getByRole('button', { name: 'Enviar e agendar devolução' })
    expect(enviar).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: 'Recarga' }))
    await user.click(enviar)
    expect(screen.getByText(/obrigado pela resposta/i)).toBeInTheDocument()
  })
})
