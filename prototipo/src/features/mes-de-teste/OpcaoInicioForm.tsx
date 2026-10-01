import { Info } from 'lucide-react'
import { SegmentedCards } from '../../components/ui/SegmentedCards'
import { VertenteTag } from '../../components/ui/VertenteTag'
import type { Inicio } from './InicioContext'
import styles from './OpcaoInicioForm.module.css'

interface Props {
  valor: Inicio
  onChange: (v: Inicio) => void
}

export function OpcaoInicioForm({ valor, onChange }: Props) {
  return (
    <div className={styles.bloco}>
      <VertenteTag n={1} />
      <SegmentedCards
        nome="inicio"
        rotulo="Como quer começar?"
        valor={valor}
        onChange={onChange}
        opcoes={[
          { valor: 'agora', titulo: 'Assinar agora' },
          { valor: 'teste', titulo: 'Mês de teste', selo: '30 dias' },
        ]}
      />
      {valor === 'teste' && (
        <p className={styles.info}>
          <Info size={20} aria-hidden="true" className={styles.icone} />
          <span>
            Use um Dolphin da frota por 30 dias pagando a 1ª mensalidade. Decida até o dia 25. Se desistir, devolve
            sem multa. A cor e a versão do carro de teste podem variar.
          </span>
        </p>
      )}
    </div>
  )
}
