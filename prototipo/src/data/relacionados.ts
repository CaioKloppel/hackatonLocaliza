import { AirVent, Monitor, Settings2, Users, Zap } from 'lucide-react'
import type { Destaque } from './dolphin'

export interface ModeloRelacionado {
  nome: string
  versao: string
  categoria: string
  destaques: Destaque[]
  imagem: string
  entregaRapida?: boolean
}

const comuns = (tela: string): Destaque[] => [
  { rotulo: `Multimídia ${tela}'' pol`, icone: Monitor },
  { rotulo: 'Automático', icone: Settings2 },
  { rotulo: 'Ar-condicionado', icone: AirVent },
  { rotulo: 'Elétrico', icone: Zap },
  { rotulo: '5 Lugares', icone: Users },
]

export const relacionados: ModeloRelacionado[] = [
  { nome: 'BYD Dolphin Mini', versao: '30KW Elétrico AT', categoria: 'Eletrico | Hatch', destaques: comuns('10.1'), imagem: 'assets/carros/byd-dolphin-mini-30kw.webp', entregaRapida: true },
  { nome: 'Geely EX2', versao: 'Geely EX2 PRO AT 39KW', categoria: 'Eletrico | Hatch', destaques: comuns('14.6'), imagem: 'assets/carros/geely-ex2-pro.webp' },
  { nome: 'Geely EX2', versao: 'Geely EX2 MAX AT 39KW', categoria: 'Eletrico | Hatch', destaques: comuns('14.6'), imagem: 'assets/carros/geely-ex2-max.webp' },
  { nome: 'BYD Dolphin Mini', versao: '38KW Elétrico AT', categoria: 'Eletrico | Hatch', destaques: comuns('10.1'), imagem: 'assets/carros/byd-dolphin-mini-38kw.webp' },
  { nome: 'Geely EX5', versao: 'Geely EX5 PRO Elétrico 60 KW', categoria: 'Eletrico | SUV', destaques: comuns('15.4'), imagem: 'assets/carros/geely-ex5-pro.webp' },
]
