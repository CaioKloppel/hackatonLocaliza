import { CircleCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { WhatsAppIcon } from '../../components/icons/Marcas'
import { Button } from '../../components/ui/Button'
import { CampoCheckbox, CampoSelect, CampoTexto } from '../../components/ui/Campos'
import { MSG_DESATIVADO, useToast } from '../../components/ui/Toast'
import { useInicio, type Inicio } from '../../features/mes-de-teste/InicioContext'
import { OpcaoInicioForm } from '../../features/mes-de-teste/OpcaoInicioForm'
import { mascaraCep, mascaraDocumento, mascaraTelefone } from '../../lib/mascaras'
import { validarOrcamento, type CampoValidado, type DadosOrcamento } from '../../lib/validacao'
import { useModo } from '../../modo/ModoContext'
import styles from './QuoteForm.module.css'

const PERIODOS = ['12 Meses', '18 Meses', '24 Meses', '36 Meses', '48 Meses']
const FRANQUIAS = ['500 Km', '1000 Km', '1500 Km', '2000 Km', '2500 Km']

const INICIAL: DadosOrcamento = {
  periodo: '48 Meses',
  franquia: '500 Km',
  nome: '',
  email: '',
  telefone: '',
  documento: '',
  cep: '',
  whatsapp: false,
  marketing: false,
}

const TEXTO_LEGAL =
  'A Localiza trata seus dados com segurança e transparência. Ao clicar em Solicitar orçamento, você autoriza a Localiza a tratar suas informações para contato, análise da solicitação, validação do serviço na sua região e, por meio de empresas parceiras, consultar o Sistema de Informações de Crédito para fins de análise de crédito e risco, nos termos da Resolução CMN nº 5.037, de 29/09/2022. Saiba mais sobre como tratamos seus dados em nosso Aviso de Privacidade.'

export function QuoteForm() {
  const { modo } = useModo()
  const { inicio, setInicio } = useInicio()
  const toast = useToast()
  const inicioEfetivo: Inicio = modo === 'proposta' ? inicio : 'agora'

  const [dados, setDados] = useState<DadosOrcamento>(INICIAL)
  const [tocados, setTocados] = useState<ReadonlySet<CampoValidado>>(new Set())
  const [enviado, setEnviado] = useState(false)

  const erros = validarOrcamento(dados)
  const valido = Object.keys(erros).length === 0

  const mudar = <K extends keyof DadosOrcamento>(campo: K, valor: DadosOrcamento[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }))
  const tocar = (c: CampoValidado) => setTocados((t) => new Set(t).add(c))
  const erroDe = (c: CampoValidado) => (tocados.has(c) ? erros[c] : undefined)

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (valido) setEnviado(true)
  }

  return (
    <div id="orcamento" className={styles.card}>
      {enviado ? (
        <div role="status" className={styles.sucesso}>
          <CircleCheck size={48} aria-hidden="true" className={styles.sucessoIcone} />
          <h2 className={styles.titulo}>Pronto!</h2>
          <p>
            {inicioEfetivo === 'teste'
              ? 'Um consultor vai te chamar para configurar seu 0 km e agendar a retirada do carro de teste.'
              : 'Logo entraremos em contato.'}
          </p>
          <Button variante="outlineDark" onClick={() => setEnviado(false)}>
            Voltar ao formulário
          </Button>
        </div>
      ) : (
        <form onSubmit={enviar} noValidate aria-labelledby="orcamento-titulo">
          <h2 id="orcamento-titulo" className={styles.titulo}>
            Preencha seus dados
          </h2>
          <p className={styles.subtitulo}>Logo entraremos em contato.</p>

          <div className={styles.whatsapp}>
            <span>Se preferir entre em contato pelo Whatsapp</span>
            <button
              type="button"
              className={styles.whatsappBotao}
              aria-label="Falar pelo WhatsApp"
              onClick={() => toast(MSG_DESATIVADO)}
            >
              <WhatsAppIcon size={24} />
            </button>
          </div>

          {modo === 'proposta' && <OpcaoInicioForm valor={inicio} onChange={setInicio} />}

          <div className={styles.grade}>
            <CampoSelect
              id="periodo"
              rotulo="Período de assinatura"
              opcoes={PERIODOS}
              value={dados.periodo}
              onChange={(e) => mudar('periodo', e.target.value)}
            />
            <CampoSelect
              id="franquia"
              rotulo="Franquia mensal"
              opcoes={FRANQUIAS}
              value={dados.franquia}
              onChange={(e) => mudar('franquia', e.target.value)}
            />
            <CampoTexto
              id="nome"
              rotulo="Nome"
              placeholder="Digite o seu nome"
              autoComplete="name"
              className={styles.inteiro}
              value={dados.nome}
              onChange={(e) => mudar('nome', e.target.value)}
              onBlur={() => tocar('nome')}
              erro={erroDe('nome')}
            />
            <CampoTexto
              id="email"
              type="email"
              rotulo="E-mail"
              placeholder="Digite o seu e-mail"
              autoComplete="email"
              value={dados.email}
              onChange={(e) => mudar('email', e.target.value)}
              onBlur={() => tocar('email')}
              erro={erroDe('email')}
            />
            <CampoTexto
              id="telefone"
              type="tel"
              rotulo="Telefone"
              placeholder="Digite o seu número"
              inputMode="numeric"
              autoComplete="tel-national"
              value={dados.telefone}
              onChange={(e) => mudar('telefone', mascaraTelefone(e.target.value))}
              onBlur={() => tocar('telefone')}
              erro={erroDe('telefone')}
            />
            <CampoTexto
              id="documento"
              rotulo="CPF ou CNPJ"
              placeholder="Digite somente números"
              inputMode="numeric"
              value={dados.documento}
              onChange={(e) => mudar('documento', mascaraDocumento(e.target.value))}
              onBlur={() => tocar('documento')}
              erro={erroDe('documento')}
            />
            <CampoTexto
              id="cep"
              rotulo="CEP"
              placeholder="Digite seu CEP"
              inputMode="numeric"
              autoComplete="postal-code"
              value={dados.cep}
              onChange={(e) => mudar('cep', mascaraCep(e.target.value))}
              onBlur={() => tocar('cep')}
              erro={erroDe('cep')}
            />
          </div>

          <div className={styles.opcoes}>
            <CampoCheckbox
              id="whatsapp-optin"
              rotulo="Pode me chamar no WhatsApp"
              checked={dados.whatsapp}
              onChange={(e) => mudar('whatsapp', e.target.checked)}
            />
            <CampoCheckbox
              id="marketing-optin"
              rotulo="Aceito receber e-mail e SMS promocionais da Localiza"
              checked={dados.marketing}
              onChange={(e) => mudar('marketing', e.target.checked)}
            />
          </div>

          <div className={styles.rodape}>
            <Button type="submit" disabled={!valido} className={styles.enviar}>
              {inicioEfetivo === 'teste' ? 'Quero testar por 30 dias' : 'Solicitar orçamento'}
            </Button>
          </div>

          <p className={styles.legal}>{TEXTO_LEGAL}</p>
        </form>
      )}
    </div>
  )
}
