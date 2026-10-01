import { custoKmCombustao, custoKmEletrico, economiaLiquidaMensal } from './economia'
import { formatarPct } from './formato'

export type PerfilRecarga = 'casa' | 'trabalho' | 'rua'
/** 1 = hatch compacto, 2 = hatch, 3 = SUV */
export type Categoria = 1 | 2 | 3
export type Tarifas = Record<PerfilRecarga, number>

export interface ModeloEletrico {
  id: string
  nome: string
  categoria: Categoria
  autonomiaRealKm: number
  kmPorKWh: number
  deltaMensalidade: number
}

export interface Cliente {
  kmMes: number
  kmDiarios: number[]
  kmPorLitro: number
  precoGasolina: number
  categoria: Categoria
}

export interface AvaliacaoModelo {
  modelo: ModeloEletrico
  cobertura: number
  custoKmEletrico: number
  economiaLiquida: number
  motivosExclusao: string[]
}

export interface ResultadoRecomendacao {
  recomendado: AvaliacaoModelo | null
  avaliados: AvaliacaoModelo[]
  custoKmCombustao: number
}

export const COBERTURA_MINIMA = 0.95
export const MARGEM_SEGURANCA = 100

export function cobertura(kmDiarios: number[], autonomiaKm: number): number {
  if (kmDiarios.length === 0) return 0
  return kmDiarios.filter((km) => km <= autonomiaKm).length / kmDiarios.length
}

export function recomendar(
  cliente: Cliente,
  perfil: PerfilRecarga,
  modelos: ModeloEletrico[],
  tarifas: Tarifas,
  margem: number = MARGEM_SEGURANCA,
): ResultadoRecomendacao {
  const custoComb = custoKmCombustao(cliente.precoGasolina, cliente.kmPorLitro)

  const avaliados = modelos.map((modelo): AvaliacaoModelo => {
    const cob = cobertura(cliente.kmDiarios, modelo.autonomiaRealKm)
    const custoElet = custoKmEletrico(tarifas[perfil], modelo.kmPorKWh)
    const economia = economiaLiquidaMensal(cliente.kmMes, custoComb, custoElet, modelo.deltaMensalidade)

    const motivos: string[] = []
    if (cob < COBERTURA_MINIMA) motivos.push(`Cobre só ${formatarPct(cob)} dos seus dias (mínimo 95%)`)
    if (modelo.categoria < cliente.categoria) motivos.push('Categoria inferior ao seu carro atual')
    if (economia <= 0) motivos.push('A economia com energia não cobre a diferença de mensalidade')
    else if (economia < margem) motivos.push('Economia abaixo da margem de segurança')

    return { modelo, cobertura: cob, custoKmEletrico: custoElet, economiaLiquida: economia, motivosExclusao: motivos }
  })

  const elegiveis = avaliados
    .filter((a) => a.motivosExclusao.length === 0)
    .sort((a, b) => b.economiaLiquida - a.economiaLiquida)

  return { recomendado: elegiveis[0] ?? null, avaliados, custoKmCombustao: custoComb }
}
