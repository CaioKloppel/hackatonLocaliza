import { ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import styles from './AssinantePage.module.css'

export type Consentimento = 'pendente' | 'autorizado' | 'recusado'

interface Props {
  estado: Consentimento
  onAutorizar: () => void
  onRecusar: () => void
}

export function ConsentimentoStep({ estado, onAutorizar, onRecusar }: Props) {
  return (
    <section className={styles.cartao} aria-labelledby="passo-consentimento">
      <h2 id="passo-consentimento" className={styles.tituloPasso}>
        <ShieldCheck size={24} aria-hidden="true" /> 1. Consentimento
      </h2>
      <p>
        Podemos usar os dados de telemetria do seu carro para calcular uma recomendação de elétrico? Usamos só para
        esta finalidade.
      </p>
      {estado === 'pendente' ? (
        <div className={styles.botoes}>
          <Button onClick={onAutorizar}>Autorizo</Button>
          <Button variante="outlineDark" onClick={onRecusar}>Agora não</Button>
        </div>
      ) : (
        <p className={styles.status}>
          {estado === 'autorizado'
            ? 'Você autorizou o uso da telemetria para esta recomendação.'
            : 'Você preferiu não compartilhar a telemetria.'}
        </p>
      )}
    </section>
  )
}
