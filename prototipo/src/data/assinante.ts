import type { Cliente } from '../lib/recomendacao'
import { PRECO_GASOLINA } from './telemetria'

/** Semana típica de deslocamentos (média 50 km/dia). */
const SEMANA_TIPICA = [48, 52, 55, 50, 60, 40, 45]

/** 29 dias longos no ano: 3 acima de 290 km e 26 entre 200 e 280 km. */
const DIAS_LONGOS = [
  300, 200, 210, 220, 230, 240, 250, 260, 270, 280,
  305, 215, 225, 235, 245, 255, 265, 275, 205, 212,
  310, 228, 236, 244, 252, 268, 276, 218, 262,
]

function construirKmDiarios(): number[] {
  const dias: number[] = []
  let base = 0
  let longo = 0
  for (let i = 0; i < 365; i++) {
    if (longo < DIAS_LONGOS.length && i % 12 === 5) {
      dias.push(DIAS_LONGOS[longo++])
    } else {
      dias.push(SEMANA_TIPICA[base++ % SEMANA_TIPICA.length])
    }
  }
  return dias
}

export const kmDiarios: number[] = construirKmDiarios()

export const assinante = {
  nome: 'Mariana',
  diasParaFimContrato: 87,
  carroAtual: 'Hatch 1.0 Turbo',
  combustivel: 'combustão',
}

export const clienteTelemetria: Cliente = {
  kmMes: 2000,
  kmDiarios,
  kmPorLitro: 12,
  precoGasolina: PRECO_GASOLINA,
  categoria: 2,
}
