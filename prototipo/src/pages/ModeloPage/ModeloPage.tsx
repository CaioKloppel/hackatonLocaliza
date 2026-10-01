import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { MSG_DESATIVADO, useToast } from '../../components/ui/Toast'
import { adicionais, inclusoNaAssinatura } from '../../data/dolphin'
import { AvaliacoesSection } from '../../features/avaliacoes/AvaliacoesSection'
import { InicioProvider, useInicio } from '../../features/mes-de-teste/InicioContext'
import { MesDeTesteSection } from '../../features/mes-de-teste/MesDeTesteSection'
import { DadosFrotaSection } from '../../features/telemetria/DadosFrotaSection'
import { limparParamsHash } from '../../hooks/useHashRoute'
import { asset } from '../../lib/asset'
import { rolarParaOrcamento } from '../../lib/rolagem'
import { useModo } from '../../modo/ModoContext'
import { Breadcrumb } from './Breadcrumb'
import { ItensDeSerie } from './ItensDeSerie'
import { ListaComIcones } from './ListaComIcones'
import styles from './ModeloPage.module.css'
import { QuoteForm } from './QuoteForm'
import { RelatedCarousel } from './RelatedCarousel'
import { TitleBlock } from './TitleBlock'
import { VehicleCard } from './VehicleCard'

function AplicarParametroTeste({ params }: { params: URLSearchParams }) {
  const { setInicio } = useInicio()
  const { setModo } = useModo()
  useEffect(() => {
    if (params.get('teste') === '1') {
      setModo('proposta')
      setInicio('teste')
      limparParamsHash()
      rolarParaOrcamento()
    } else if (params.get('orcamento') === '1') {
      limparParamsHash()
      rolarParaOrcamento()
    } else {
      window.scrollTo(0, 0)
    }
  }, [params, setInicio, setModo])
  return null
}

export function ModeloPage({ params }: { params: URLSearchParams }) {
  const toast = useToast()
  const { modo } = useModo()
  const proposta = modo === 'proposta'
  return (
    <InicioProvider>
      <AplicarParametroTeste params={params} />
      <main className={styles.pagina} style={{ backgroundImage: `url(${asset('assets/decor/linhas.svg')})` }}>
        <div className={styles.container}>
          <Breadcrumb />
          <TitleBlock />
          <div className={styles.colunas}>
            <div className={styles.esquerda}>
              <VehicleCard />
              <ItensDeSerie />
              <ListaComIcones
                id="incluso"
                titulo="Incluso na assinatura"
                itens={inclusoNaAssinatura}
                variante="incluso"
                rodape={
                  <>
                    <strong>Tenha uma assinatura completa, com a confiança Localiza</strong> para você dirigir um carro
                    0km com mais tranquilidade todos os dias.
                  </>
                }
                botao={{ rotulo: 'Quero assinar', variante: 'outline' }}
              />
              {proposta && (
                <>
                  <DadosFrotaSection />
                  <MesDeTesteSection />
                </>
              )}
              <ListaComIcones
                id="adicionais"
                titulo="Adicionais"
                itens={adicionais}
                variante="adicional"
                rodape="Personalize sua assinatura com os adicionais disponíveis e tenha um veículo ainda mais alinhado ao seu estilo de vida e às suas necessidades."
                botao={{ rotulo: 'Solicitar orçamento', variante: 'outlineDark' }}
                abertoInicial={false}
              />
              {proposta && <AvaliacoesSection />}
            </div>
            <aside className={styles.direita} aria-label="Solicitar orçamento">
              <QuoteForm />
            </aside>
          </div>
          <hr className={styles.divisor} />
          <RelatedCarousel />
          <div className={styles.voltar}>
            <Button variante="outlineDark" icone={<ArrowLeft size={20} aria-hidden="true" />} onClick={() => toast(MSG_DESATIVADO)}>
              Voltar para a listagem
            </Button>
          </div>
        </div>
      </main>
    </InicioProvider>
  )
}
