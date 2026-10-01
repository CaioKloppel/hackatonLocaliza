import type { ModeloEletrico, Tarifas } from '../lib/recomendacao'

/** Valores ilustrativos do protótipo. Trabalho e rua são estimativas. */
export const tarifas: Tarifas = { casa: 0.8, trabalho: 1.0, rua: 2.0 }
export const PRECO_GASOLINA = 6
export const EFICIENCIA_DOLPHIN = 6

export const modelosEletricos: ModeloEletrico[] = [
  { id: 'dolphin-mini', nome: 'BYD Dolphin Mini', categoria: 1, autonomiaRealKm: 190, kmPorKWh: 7, deltaMensalidade: 100 },
  { id: 'geely-ex2', nome: 'Geely EX2', categoria: 1, autonomiaRealKm: 230, kmPorKWh: 6.5, deltaMensalidade: 300 },
  { id: 'dolphin', nome: 'BYD Dolphin', categoria: 2, autonomiaRealKm: 290, kmPorKWh: 6, deltaMensalidade: 500 },
  { id: 'geely-ex5', nome: 'Geely EX5', categoria: 3, autonomiaRealKm: 380, kmPorKWh: 5, deltaMensalidade: 1200 },
]

export const imagemModelo: Record<string, string> = {
  'dolphin-mini': 'assets/carros/byd-dolphin-mini-38kw.webp',
  'geely-ex2': 'assets/carros/geely-ex2-pro.webp',
  dolphin: 'assets/carros/byd-dolphin.webp',
  'geely-ex5': 'assets/carros/geely-ex5-pro.webp',
}

export interface PontoSaude {
  meses: number
  pct: number
}

export interface FatosFrota {
  baseCarros: number
  periodo: string
  autonomiaCidadeKm: number
  autonomiaEstradaKm: number
  saudeBateria: PontoSaude[]
  reducaoCustoKmPct: number
  diasAbaixoAutonomiaPct: number
  recargasPorSemana: number
}

export const fatosFrota: FatosFrota = {
  baseCarros: 412,
  periodo: 'jan. a ago. de 2026',
  autonomiaCidadeKm: 305,
  autonomiaEstradaKm: 245,
  saudeBateria: [
    { meses: 0, pct: 100 },
    { meses: 6, pct: 99 },
    { meses: 12, pct: 98 },
    { meses: 18, pct: 97 },
    { meses: 24, pct: 96 },
  ],
  reducaoCustoKmPct: 74,
  diasAbaixoAutonomiaPct: 97,
  recargasPorSemana: 2,
}
