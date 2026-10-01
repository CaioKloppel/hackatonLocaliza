import type { Avaliacao } from '../lib/filtroAvaliacoes'

export interface ResumoAvaliacoes {
  media: number
  total: number
  distribuicao: { estrelas: number; qtd: number }[]
  atributos: { rotulo: string; nota: number }[]
}

export const resumoAvaliacoes: ResumoAvaliacoes = {
  media: 4.6,
  total: 128,
  distribuicao: [
    { estrelas: 5, qtd: 95 },
    { estrelas: 4, qtd: 22 },
    { estrelas: 3, qtd: 6 },
    { estrelas: 2, qtd: 3 },
    { estrelas: 1, qtd: 2 },
  ],
  atributos: [
    { rotulo: 'Autonomia real', nota: 4.5 },
    { rotulo: 'Facilidade de recarga', nota: 4.1 },
    { rotulo: 'Conforto', nota: 4.7 },
    { rotulo: 'Economia no dia a dia', nota: 4.8 },
    { rotulo: 'Atendimento Localiza', nota: 4.6 },
  ],
}

export const avaliacoes: Avaliacao[] = [
  {
    id: 'a1', nome: 'Rafael', cidade: 'Curitiba (PR)', tipo: 'assinante', uso: 'cidade', recarga: 'casa',
    tempo: '8 meses de assinatura', nota: 5, data: '2026-09-12',
    texto: 'Carrego na garagem à noite e nunca mais pensei em posto. No dia a dia de cidade a bateria sobra: raramente uso mais de 40% da carga.',
  },
  {
    id: 'a2', nome: 'Juliana', cidade: 'São Paulo (SP)', tipo: 'assinante', uso: 'estrada', recarga: 'trabalho',
    tempo: '1 ano de assinatura', nota: 4, data: '2026-09-03',
    texto: 'Faço São Paulo–Campinas duas vezes por semana e chego com folga. Tirei uma estrela porque o carregador do prédio do trabalho vive ocupado.',
  },
  {
    id: 'a3', nome: 'Carlos', cidade: 'Belo Horizonte (MG)', tipo: 'assinante', uso: 'cidade', recarga: 'rua',
    tempo: '5 meses de assinatura', nota: 3, data: '2026-08-28',
    texto: 'O carro é ótimo, mas recarregar só na rua cansa: já esperei 40 minutos por um carregador livre no shopping.',
    resposta: 'Carlos, obrigado pelo relato. Enviamos pelo app o mapa de eletropostos com disponibilidade em tempo real e agendamos uma conversa com nosso time para avaliar um carregador no seu condomínio. Seguimos acompanhando.',
  },
  {
    id: 'a4', nome: 'Fernanda', cidade: 'Porto Alegre (RS)', tipo: 'teste', uso: 'cidade', recarga: 'casa',
    tempo: 'Mês de teste · dia 18', nota: 5, data: '2026-09-20',
    texto: 'Eu tinha medo da autonomia. Em 18 dias de rotina real, a menor carga que vi foi 35%. Já decidi assinar.',
  },
  {
    id: 'a5', nome: 'Thiago', cidade: 'Rio de Janeiro (RJ)', tipo: 'aluguel', uso: 'estrada', recarga: 'rua',
    tempo: 'Alugou por 7 dias', nota: 4, data: '2026-08-15',
    texto: 'Aluguei para subir a serra até Petrópolis. Subida tranquila e a regeneração na descida devolveu carga. Precisei planejar uma parada para recarregar.',
  },
  {
    id: 'a6', nome: 'Patrícia', cidade: 'Curitiba (PR)', tipo: 'assinante', uso: 'cidade', recarga: 'trabalho',
    tempo: '2 anos de assinatura', nota: 5, data: '2026-07-30',
    texto: 'Dois anos e a bateria continua como no primeiro dia. O conforto e o silêncio fazem falta quando dirijo outro carro.',
  },
  {
    id: 'a7', nome: 'André', cidade: 'São Paulo (SP)', tipo: 'assinante', uso: 'cidade', recarga: 'casa',
    tempo: '3 meses de assinatura', nota: 2, data: '2026-09-08',
    texto: 'Demoraram 12 dias para agendar a instalação do carregador residencial. Enquanto isso, dependi de recarga pública.',
    resposta: 'André, você tem razão: o prazo ficou acima do nosso padrão de 5 dias úteis. Revisamos o processo com o parceiro de instalação e devolvemos na sua fatura o valor das recargas públicas do período.',
  },
  {
    id: 'a8', nome: 'Luciana', cidade: 'Belo Horizonte (MG)', tipo: 'teste', uso: 'estrada', recarga: 'casa',
    tempo: 'Mês de teste · dia 25', nota: 4, data: '2026-09-25',
    texto: 'Fiz BH–Ouro Preto ida e volta sem recarregar. O tutorial de recarga no app ajudou muito na primeira semana.',
  },
  {
    id: 'a9', nome: 'Marcos', cidade: 'Porto Alegre (RS)', tipo: 'aluguel', uso: 'cidade', recarga: 'rua',
    tempo: 'Alugou por 3 dias', nota: 5, data: '2026-08-05',
    texto: 'Aluguei só para experimentar e virei fã. O gasto com energia ficou muito abaixo do que eu gastaria de gasolina.',
  },
  {
    id: 'a10', nome: 'Beatriz', cidade: 'Rio de Janeiro (RJ)', tipo: 'assinante', uso: 'estrada', recarga: 'casa',
    tempo: '10 meses de assinatura', nota: 5, data: '2026-06-18',
    texto: 'Pego estrada quase todo fim de semana. A autonomia real bate com o que a Localiza mostra na página.',
  },
]
