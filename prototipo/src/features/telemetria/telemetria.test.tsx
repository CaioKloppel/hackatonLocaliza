import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { fatosFrota } from '../../data/telemetria'
import { DadosFrotaSection } from './DadosFrotaSection'
import { SaudeBateriaChart } from './SaudeBateriaChart'
import { SimuladorEconomia } from './SimuladorEconomia'

describe('DadosFrotaSection', () => {
  it('mostra as 5 dúvidas, a base de dados e a tag da vertente', () => {
    render(<DadosFrotaSection />)
    fireEvent.click(screen.getByRole('button', { name: /dados reais da frota/i }))
    const secao = document.getElementById('dados-frota')!
    const perguntas = [
      'O carro chega aonde eu preciso?',
      'A bateria vai estragar?',
      'Vou economizar de verdade?',
      'Vou ficar sem carga no dia a dia?',
      'Recarregar vai tomar meu tempo?',
    ]
    for (const p of perguntas) {
      expect(within(secao).getByRole('heading', { level: 3, name: p })).toBeInTheDocument()
    }
    expect(within(secao).getByText(/412 BYD Dolphin da frota Localiza/)).toBeInTheDocument()
    expect(within(secao).getByText('Vertente 3 · Telemetria')).toBeInTheDocument()
  })
})

describe('SaudeBateriaChart', () => {
  it('descreve os pontos no rótulo acessível', () => {
    render(<SaudeBateriaChart pontos={fatosFrota.saudeBateria} />)
    expect(screen.getByRole('img', { name: /24 meses: 96%/ })).toBeInTheDocument()
  })
})

describe('SimuladorEconomia', () => {
  it('padrão (2.000 km, 12 km/l, casa) economiza R$ 740/mês', () => {
    render(<SimuladorEconomia />)
    expect(screen.getByText('R$ 740/mês')).toBeInTheDocument()
    expect(screen.getByText('R$ 8.880/ano')).toBeInTheDocument()
  })

  it('recarga na rua reduz para R$ 340/mês', async () => {
    const user = userEvent.setup()
    render(<SimuladorEconomia />)
    await user.click(screen.getByRole('radio', { name: 'Rua' }))
    expect(screen.getByText('R$ 340/mês')).toBeInTheDocument()
  })

  it('carro muito econômico + rua: avisa que não compensa', async () => {
    const user = userEvent.setup()
    render(<SimuladorEconomia />)
    const consumo = screen.getByLabelText('Consumo do seu carro atual (km/l)')
    await user.clear(consumo)
    await user.type(consumo, '20')
    await user.click(screen.getByRole('radio', { name: 'Rua' }))
    expect(screen.getByText(/a energia não sai mais barata/i)).toBeInTheDocument()
  })

  it('slider de km atualiza o valor', () => {
    render(<SimuladorEconomia />)
    fireEvent.change(screen.getByLabelText(/km por mês/i), { target: { value: '1000' } })
    expect(screen.getByText('R$ 370/mês')).toBeInTheDocument()
  })

  it.each(['', '0', 'abc', '25'])('consumo inválido "%s" mostra erro e nunca NaN', async (valor) => {
    const user = userEvent.setup()
    render(<SimuladorEconomia />)
    const consumo = screen.getByLabelText('Consumo do seu carro atual (km/l)')
    await user.clear(consumo)
    if (valor) await user.type(consumo, valor)
    expect(screen.getByText('Informe um consumo entre 6 e 20 km/l.')).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/NaN|Infinity/)
  })

  it('aceita vírgula decimal', async () => {
    const user = userEvent.setup()
    render(<SimuladorEconomia />)
    const consumo = screen.getByLabelText('Consumo do seu carro atual (km/l)')
    await user.clear(consumo)
    await user.type(consumo, '12,5')
    expect(screen.queryByText('Informe um consumo entre 6 e 20 km/l.')).not.toBeInTheDocument()
    expect(screen.getByText('R$ 700/mês')).toBeInTheDocument()
  })
})
