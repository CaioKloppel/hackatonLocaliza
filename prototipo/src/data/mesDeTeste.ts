import type { DiaDeUso } from '../lib/relatorioMes'

/** Cliente fictícia no mês de teste (a mesma das avaliações, "Cliente em teste"). */
export const clienteEmTeste = {
  nome: 'Fernanda',
  cidade: 'Porto Alegre (RS)',
  modelo: 'BYD Dolphin',
  diaAtual: 25,
  diasDoTeste: 30,
  kmPorLitroCarroAnterior: 12,
}

/** 25 dias de uso medidos pela telemetria. O dia 13 teve uma viagem até a serra. */
export const diasDeTeste: DiaDeUso[] = [
  { dia: 1, km: 42, menorCargaPct: 78 },
  { dia: 2, km: 48, menorCargaPct: 63 },
  { dia: 3, km: 51, menorCargaPct: 46, recarga: { local: 'casa', kWh: 28 } },
  { dia: 4, km: 39, menorCargaPct: 74 },
  { dia: 5, km: 30, menorCargaPct: 64 },
  { dia: 6, km: 28, menorCargaPct: 55, recarga: { local: 'casa', kWh: 24 } },
  { dia: 7, km: 45, menorCargaPct: 70 },
  { dia: 8, km: 47, menorCargaPct: 56 },
  { dia: 9, km: 53, menorCargaPct: 41, recarga: { local: 'trabalho', kWh: 16 } },
  { dia: 10, km: 44, menorCargaPct: 62 },
  { dia: 11, km: 40, menorCargaPct: 50 },
  { dia: 12, km: 32, menorCargaPct: 47, recarga: { local: 'casa', kWh: 26 } },
  { dia: 13, km: 210, menorCargaPct: 31, recarga: { local: 'rua', kWh: 18 } },
  { dia: 14, km: 46, menorCargaPct: 52, recarga: { local: 'casa', kWh: 30 } },
  { dia: 15, km: 49, menorCargaPct: 68 },
  { dia: 16, km: 52, menorCargaPct: 53 },
  { dia: 17, km: 43, menorCargaPct: 44, recarga: { local: 'casa', kWh: 24 } },
  { dia: 18, km: 38, menorCargaPct: 69 },
  { dia: 19, km: 26, menorCargaPct: 61 },
  { dia: 20, km: 31, menorCargaPct: 52, recarga: { local: 'trabalho', kWh: 14 } },
  { dia: 21, km: 47, menorCargaPct: 66 },
  { dia: 22, km: 50, menorCargaPct: 51 },
  { dia: 23, km: 44, menorCargaPct: 43, recarga: { local: 'casa', kWh: 24 } },
  { dia: 24, km: 41, menorCargaPct: 67 },
  { dia: 25, km: 36, menorCargaPct: 55 },
]
