const MENOS = '−'

export function formatarNumero(v: number): string {
  return Math.round(v).toLocaleString('pt-BR')
}

export function formatarReais(v: number): string {
  const r = Math.round(v)
  return r < 0 ? `${MENOS}R$ ${formatarNumero(-r)}` : `R$ ${formatarNumero(r)}`
}

export function formatarReaisComSinal(v: number): string {
  const r = Math.round(v)
  if (r === 0) return 'R$ 0'
  return `${r < 0 ? MENOS : '+'}R$ ${formatarNumero(Math.abs(r))}`
}

export function formatarReaisCentavos(v: number): string {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatarNota(v: number): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function formatarPct(fracao: number): string {
  return `${Math.floor(fracao * 100 + 1e-9)}%`
}

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}
