import { Car, Timer } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { VertenteTag } from '../../components/ui/VertenteTag'
import { assinante, clienteTelemetria } from '../../data/assinante'
import { modelosEletricos, tarifas } from '../../data/telemetria'
import { recomendar, type PerfilRecarga } from '../../lib/recomendacao'
import styles from './AssinantePage.module.css'
import { ConsentimentoStep, type Consentimento } from './ConsentimentoStep'
import { RecargaStep } from './RecargaStep'
import { MSG_RENOVACAO, ResultadoStep } from './ResultadoStep'
import { Stepper } from './Stepper'
import { UsoStep } from './UsoStep'

export function AssinantePage() {
  const toast = useToast()
  const [consentimento, setConsentimento] = useState<Consentimento>('pendente')
  const [recarga, setRecarga] = useState<PerfilRecarga | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const resultado = useMemo(
    () => (recarga ? recomendar(clienteTelemetria, recarga, modelosEletricos, tarifas) : null),
    [recarga],
  )

  const passoAtual = consentimento !== 'autorizado' ? 1 : recarga === null ? 3 : 4

  return (
    <main className={styles.pagina}>
      <div className={styles.container}>
        <VertenteTag n={3} />
        <p className={styles.saudacao}>Olá, {assinante.nome}</p>
        <h1 className={styles.titulo}>Minha assinatura</h1>

        <div className={styles.aviso}>
          <Timer size={24} aria-hidden="true" />
          <p>
            Seu contrato termina em <strong>{assinante.diasParaFimContrato} dias</strong>. Veja se um elétrico
            compensa na sua renovação.
          </p>
        </div>

        <div className={styles.carroAtual}>
          <Car size={32} aria-hidden="true" />
          <div>
            <p className={styles.rotuloCarro}>Seu carro atual</p>
            <p className={styles.nomeCarro}>
              {assinante.carroAtual} · {assinante.combustivel}
            </p>
          </div>
        </div>

        <Stepper passoAtual={passoAtual} />

        <ConsentimentoStep
          estado={consentimento}
          onAutorizar={() => setConsentimento('autorizado')}
          onRecusar={() => setConsentimento('recusado')}
        />

        {consentimento === 'recusado' && (
          <section className={styles.cartao} aria-label="Renovação">
            <p>Sem problema. Você pode renovar com o seu carro atual.</p>
            <div className={styles.botoes}>
              <Button onClick={() => toast(MSG_RENOVACAO)}>Renovar com meu carro atual</Button>
            </div>
          </section>
        )}

        {consentimento === 'autorizado' && (
          <>
            <UsoStep />
            <RecargaStep valor={recarga} onChange={setRecarga} />
            {resultado && recarga && <ResultadoStep resultado={resultado} perfil={recarga} kmMes={clienteTelemetria.kmMes} />}
          </>
        )}

        <p className={styles.privacidade}>
          A recomendação usa seus dados individuais com o seu consentimento. Os fatos públicos da página do modelo usam
          dados agregados e anônimos.
        </p>
      </div>
    </main>
  )
}
