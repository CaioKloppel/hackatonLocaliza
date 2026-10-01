import { useState } from 'react'
import { dolphin } from '../../data/dolphin'
import { asset } from '../../lib/asset'
import { ColorPicker } from './ColorPicker'
import styles from './VehicleCard.module.css'

export function VehicleCard() {
  const [cor, setCor] = useState(dolphin.cores[0])
  return (
    <article className={styles.card} aria-label={`${dolphin.nome} ${dolphin.versao}`}>
      <div className={styles.imagemArea}>
        <img src={asset(cor.imagem)} alt={`${dolphin.nome} na cor ${cor.nome}`} className={styles.imagem} />
      </div>
      <div className={styles.info}>
        <div>
          <p className={styles.categoria}>{dolphin.categoria}</p>
          <ul className={styles.destaques}>
            {dolphin.destaques.map(({ rotulo, icone: Icone }) => (
              <li key={rotulo}>
                <Icone size={16} aria-hidden="true" />
                {rotulo}
              </li>
            ))}
          </ul>
        </div>
        <ColorPicker cores={dolphin.cores} selecionada={cor} onChange={setCor} />
      </div>
    </article>
  )
}
