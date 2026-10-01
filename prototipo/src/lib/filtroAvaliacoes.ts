export type Uso = 'cidade' | 'estrada'
export type LocalRecarga = 'casa' | 'trabalho' | 'rua'
export type TipoAvaliador = 'assinante' | 'teste' | 'aluguel'

export interface Avaliacao {
  id: string
  nome: string
  cidade: string
  tipo: TipoAvaliador
  uso: Uso
  recarga: LocalRecarga
  tempo: string
  nota: number
  /** ISO yyyy-mm-dd */
  data: string
  texto: string
  resposta?: string
}

export interface FiltrosAvaliacao {
  uso: Uso[]
  recarga: LocalRecarga[]
  tipo: TipoAvaliador[]
}

export const FILTROS_VAZIOS: FiltrosAvaliacao = { uso: [], recarga: [], tipo: [] }

function passa<T>(selecionados: T[], valor: T): boolean {
  return selecionados.length === 0 || selecionados.includes(valor)
}

export function filtrarAvaliacoes(lista: Avaliacao[], f: FiltrosAvaliacao): Avaliacao[] {
  return lista.filter((a) => passa(f.uso, a.uso) && passa(f.recarga, a.recarga) && passa(f.tipo, a.tipo))
}

export function ordenarRecentes(lista: Avaliacao[]): Avaliacao[] {
  return [...lista].sort((a, b) => b.data.localeCompare(a.data))
}

export function alternarFiltro(f: FiltrosAvaliacao, grupo: keyof FiltrosAvaliacao, valor: string): FiltrosAvaliacao {
  const atual = f[grupo] as string[]
  const novo = atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor]
  return { ...f, [grupo]: novo } as FiltrosAvaliacao
}

export function temFiltroAtivo(f: FiltrosAvaliacao): boolean {
  return f.uso.length > 0 || f.recarga.length > 0 || f.tipo.length > 0
}
