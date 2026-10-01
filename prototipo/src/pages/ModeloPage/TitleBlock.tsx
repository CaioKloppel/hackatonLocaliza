import { dolphin } from '../../data/dolphin'
import styles from './TitleBlock.module.css'

export function TitleBlock() {
  return (
    <div className={styles.bloco}>
      <p className={styles.nota}>Imagens ilustrativas</p>
      <h1 className={styles.titulo}>{dolphin.nome}</h1>
      <p className={styles.versao}>{dolphin.versao}</p>
    </div>
  )
}
