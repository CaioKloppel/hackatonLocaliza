import type { PerfilRecarga, Tarifas } from './recomendacao'

export interface DiaDeUso {
  dia: number
  km: number
  /** Menor nível de bateria atingido no dia (0–100). */
  menorCargaPct: number
  recarga?: { local: PerfilRecarga; kWh: number }
}

export interface OpcoesRelatorio {
  autonomiaKm: number
  tarifas: Tarifas
  precoGasolina: number
  /** Consumo do carro a combustão que o cliente usava antes. */
  kmPorLitro: number
}

export interface RelatorioMes {
  dias: number
  kmTotal: number
  kmMediaDia: number
  diaMaiorUso: { dia: number; km: number }
  recargas: Record<PerfilRecarga, number>
  totalRecargas: number
  diasAcimaAutonomia: number[]
  menorCarga: { dia: number; pct: number }
  gastoEnergia: number
  gastoCombustivel: number
  economia: number
  economiaProjetada30: number
}

/** Consolida o uso do mês de teste num relatório (o "seu mês em números" do dia 25). */
export function consolidarMes(dias: DiaDeUso[], opcoes: OpcoesRelatorio): RelatorioMes {
  if (dias.length === 0) throw new RangeError('O relatório precisa de pelo menos um dia de uso')

  const kmTotal = dias.reduce((soma, d) => soma + d.km, 0)
  const maior = dias.reduce((a, b) => (b.km > a.km ? b : a))
  const menor = dias.reduce((a, b) => (b.menorCargaPct < a.menorCargaPct ? b : a))

  const recargas: Record<PerfilRecarga, number> = { casa: 0, trabalho: 0, rua: 0 }
  let custoEnergia = 0
  for (const d of dias) {
    if (!d.recarga) continue
    recargas[d.recarga.local] += 1
    custoEnergia += d.recarga.kWh * opcoes.tarifas[d.recarga.local]
  }

  const gastoEnergia = Math.round(custoEnergia)
  const gastoCombustivel = Math.round((kmTotal / opcoes.kmPorLitro) * opcoes.precoGasolina)
  const economia = gastoCombustivel - gastoEnergia

  return {
    dias: dias.length,
    kmTotal,
    kmMediaDia: Math.round(kmTotal / dias.length),
    diaMaiorUso: { dia: maior.dia, km: maior.km },
    recargas,
    totalRecargas: recargas.casa + recargas.trabalho + recargas.rua,
    diasAcimaAutonomia: dias.filter((d) => d.km > opcoes.autonomiaKm).map((d) => d.dia),
    menorCarga: { dia: menor.dia, pct: menor.menorCargaPct },
    gastoEnergia,
    gastoCombustivel,
    economia,
    economiaProjetada30: Math.round((economia / dias.length) * 30),
  }
}
