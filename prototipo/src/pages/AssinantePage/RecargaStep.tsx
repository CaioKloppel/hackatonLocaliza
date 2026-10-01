import { PlugZap } from 'lucide-react'
import { SegmentedCards } from '../../components/ui/SegmentedCards'
import type { PerfilRecarga } from '../../lib/recomendacao'
import styles from './AssinantePage.module.css'

interface Props {
  valor: PerfilRecarga | null
  onChange: (v: PerfilRecarga) => void
}

export function RecargaStep({ valor, onChange }: Props) {
  return (
    <section className={styles.cartao} aria-labelledby="passo-recarga">
      <h2 id="passo-recarga" className={styles.tituloPasso}>
        <PlugZap size={24} aria-hidden="true" /> 3. Onde você pode recarregar?
      </h2>
      <SegmentedCards
        nome="recarga-assinante"
        rotulo="Escolha a opção mais comum na sua rotina"
        compacto
        valor={valor}
        onChange={onChange}
        opcoes={[
          { valor: 'casa', titulo: 'Em casa' },
          { valor: 'trabalho', titulo: 'No trabalho' },
          { valor: 'rua', titulo: 'Só na rua' },
        ]}
      />
    </section>
  )
}
