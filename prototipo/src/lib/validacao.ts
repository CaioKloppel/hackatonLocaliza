import { somenteDigitos } from './mascaras'

export interface DadosOrcamento {
  periodo: string
  franquia: string
  nome: string
  email: string
  telefone: string
  documento: string
  cep: string
  whatsapp: boolean
  marketing: boolean
}

export type CampoValidado = 'nome' | 'email' | 'telefone' | 'documento' | 'cep'
export type ErrosOrcamento = Partial<Record<CampoValidado, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarOrcamento(d: DadosOrcamento): ErrosOrcamento {
  const erros: ErrosOrcamento = {}
  if (d.nome.trim().length < 2) erros.nome = 'Digite o seu nome.'
  if (!EMAIL.test(d.email.trim())) erros.email = 'Digite um e-mail válido.'
  if (somenteDigitos(d.telefone).length !== 11) erros.telefone = 'Digite o telefone com DDD (11 dígitos).'
  const doc = somenteDigitos(d.documento).length
  if (doc !== 11 && doc !== 14) erros.documento = 'Digite um CPF (11) ou CNPJ (14 dígitos).'
  if (somenteDigitos(d.cep).length !== 8) erros.cep = 'Digite um CEP com 8 dígitos.'
  return erros
}
