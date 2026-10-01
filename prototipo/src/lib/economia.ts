export function arredondarCentavos(v: number): number {
  return Math.round((v + Number.EPSILON) * 100) / 100
}

function custoPorKm(preco: number, rendimento: number): number {
  if (!(rendimento > 0)) throw new RangeError('O rendimento (km por unidade) deve ser positivo')
  return arredondarCentavos(preco / rendimento)
}

/** R$ por km rodado com combustível, arredondado a centavos (como no .md). */
export function custoKmCombustao(precoLitro: number, kmPorLitro: number): number {
  return custoPorKm(precoLitro, kmPorLitro)
}

/** R$ por km rodado com energia elétrica, arredondado a centavos (como no .md). */
export function custoKmEletrico(tarifaKWh: number, kmPorKWh: number): number {
  return custoPorKm(tarifaKWh, kmPorKWh)
}

export function gastoEnergiaMensal(kmMes: number, custoKm: number): number {
  return Math.round(kmMes * custoKm)
}

export function economiaEnergiaMensal(kmMes: number, custoKmComb: number, custoKmElet: number): number {
  return Math.round(kmMes * (custoKmComb - custoKmElet))
}

export function economiaLiquidaMensal(
  kmMes: number,
  custoKmComb: number,
  custoKmElet: number,
  deltaMensalidade: number,
): number {
  return economiaEnergiaMensal(kmMes, custoKmComb, custoKmElet) - deltaMensalidade
}
