import {
  Car,
  Disc,
  FileText,
  Hammer,
  Headset,
  Monitor,
  PiggyBank,
  Puzzle,
  RectangleHorizontal,
  Satellite,
  Settings,
  Settings2,
  ShieldCheck,
  ShieldPlus,
  Smartphone,
  Sun,
  Truck,
  Users,
  Volume2,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export interface Destaque {
  rotulo: string
  icone: LucideIcon
}

export interface CorVeiculo {
  nome: string
  hex: string
  imagem: string
}

export interface ItemComIcone {
  titulo: string
  descricao: string
  negrito?: string
  icone: LucideIcon
}

export const dolphin = {
  nome: 'BYD Dolphin',
  versao: 'EV 44KW Elétrico AT',
  categoria: 'Eletrico',
  destaques: [
    { rotulo: "Multimídia 12.8'' pol", icone: Monitor },
    { rotulo: 'Automático', icone: Settings2 },
    { rotulo: 'Elétrico', icone: Zap },
    { rotulo: '5 Lugares', icone: Users },
  ] satisfies Destaque[],
  cores: [
    { nome: 'Cheese White', hex: '#f7f7f2', imagem: 'assets/carros/byd-dolphin.webp' },
    { nome: 'Obsidian Black', hex: '#0a0a0a', imagem: 'assets/carros/byd-dolphin-obsidian-black.webp' },
    { nome: 'Time Grey', hex: '#6a6e73', imagem: 'assets/carros/byd-dolphin-time-grey.webp' },
  ] satisfies CorVeiculo[],
}

export const itensDeSerie: string[] = [
  'Tipo de carroceria: Hatch',
  'Número de portas: 4',
  'Número de passageiros: 5',
  'Veículo importado',
  'Tipo de motorização: Elétrico',
  'Capacidade da bateria: 44.9 kWh',
  'Autonomia elétrica: 291 km',
  'Tipo de câmbio: Automático',
  'Número de marchas: 1',
  'Comprimento: 4125 mm',
  'Entre-eixos: 2700 mm',
  'Especificação do pneu: 195/60 R16',
  'Especificação da roda: Luz de rodagem diurna (DRL) de LED',
  'Revestimento: Bancos com revestimento de material premium sustentável',
  'Ajustes do banco: Ajuste elétrico do banco do motorista (6 posições), Ajuste elétrico do banco do passageiro dianteiro (4 posições), Ajuste elétrico no banco do motorista (6 posições)',
  'Zonas de climatização: 1',
  'Tamanho da tela multimídia: 12.8',
  'Quantidade de airbags: 6',
  'Tipo de farol: full LED',
]

export const inclusoNaAssinatura: ItemComIcone[] = [
  { titulo: 'Emplacamento e documentação', icone: FileText, descricao: 'A gente cuida de tudo: emplacamento, taxas de licenciamento, IPVA e documentação.' },
  { titulo: 'Manutenção preventiva', icone: Wrench, descricao: 'A gente te avisa da revisão e agenda tudo com os parceiros certos, para manter seu carro sempre pronto pra você.' },
  { titulo: 'Manutenção corretiva', icone: Settings, descricao: 'As peças que se desgastam naturalmente são trocadas no tempo certo: sem surpresas e sem interrupções no seu dia a dia.' },
  { titulo: 'Troca de pneus', icone: Disc, descricao: 'Trocas e cuidados por desgaste natural já incluídos dentro da quilometragem do contrato, para você rodar sempre com segurança.' },
  { titulo: 'Sistema de som', icone: Volume2, descricao: 'Seu carro chega completo e pronto para acompanhar o ritmo da sua rotina.' },
  { titulo: 'Insufilm', icone: Sun, descricao: 'Padrão Localiza: ajudamos você a escolher e instalar a versão que melhor funciona para o seu uso.' },
  { titulo: 'Assistência 24h', icone: Headset, descricao: 'Precisou, ligou! Nosso atendimento especializado resolve todo tipo de emergência.' },
  { titulo: 'Reparo de avarias', icone: Hammer, descricao: 'Se o carro tiver qualquer dano, nossos parceiros podem te ajudar. Para isso, é importante nos contatar na hora, ok?' },
  { titulo: 'Proteção para terceiros', icone: ShieldCheck, descricao: 'Dirija com tranquilidade. Cliente Localiza Assinatura tem proteção por danos físicos e materiais a terceiros inclusa na assinatura.' },
  { titulo: 'Reboque', icone: Truck, descricao: 'Aconteceu algum imprevisto?\nMandamos um guincho até você, onde quer que esteja! Nossa cobertura é nacional.' },
  { titulo: 'Aplicativo Localiza Assinatura', icone: Smartphone, descricao: 'Com nosso aplicativo, você controla seu plano e seu carro de forma simples e segura, onde estiver.' },
  { titulo: 'Clube de Benefícios', icone: PiggyBank, descricao: 'Programa exclusivo: aproveite vantagens incríveis em lojas, estacionamentos, pedágios, hospedagens', negrito: 'e muito mais!' },
]

export const adicionais: ItemComIcone[] = [
  { titulo: 'Acessórios customizados', icone: Puzzle, descricao: 'Personalize seu veículo com acessórios e itens adicionais para deixá-lo do seu jeito e atender às suas necessidades do dia a dia.' },
  { titulo: 'Carro reserva', icone: Car, descricao: 'Mais praticidade para sua rotina com um veículo disponível enquanto o seu estiver em manutenção ou reparo.' },
  { titulo: 'Telemetria', icone: Satellite, descricao: 'Mais controle e eficiência na gestão do veículo com acompanhamento de localização, quilometragem e muito mais.' },
  { titulo: 'Escolha o final da placa', icone: RectangleHorizontal, descricao: 'Caso tenha preferência pelo final da sua placa, principalmente se residir em regiões de rodízio, disponibilizamos essa possibilidade de escolha.' },
  { titulo: 'Proteção especial', icone: ShieldPlus, descricao: 'Você tem opção de fazer um upgrade no pacote de proteção aumentando a cobertura ou reduzindo o valor pre fixado de danos.' },
]
