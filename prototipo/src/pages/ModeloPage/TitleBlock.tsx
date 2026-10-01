import { CalendarCheck, Star } from 'lucide-react'
import type { MouseEvent } from 'react'
import { resumoAvaliacoes } from '../../data/avaliacoes'
import { dolphin } from '../../data/dolphin'
import { formatarNota } from '../../lib/formato'
import { rolarPara } from '../../lib/rolagem'
import { useModo } from '../../modo/ModoContext'
import styles from './TitleBlock.module.css'

function irPara(id: string) {
  return (e: MouseEvent) => {
    e.preventDefault()
    rolarPara(id)
  }
}

export function TitleBlock() {
  const { modo } = useModo()
  return (
    <div className={styles.bloco}>
      <p className={styles.nota}>Imagens ilustrativas</p>
      <h1 className={styles.titulo}>{dolphin.nome}</h1>
      <p className={styles.versao}>{dolphin.versao}</p>
      {modo === 'proposta' && (
        <div className={styles.chips}>
          <a href="#avaliacoes" className={styles.chip} onClick={irPara('avaliacoes')}>
            <Star size={16} aria-hidden="true" className={styles.estrela} />
            {formatarNota(resumoAvaliacoes.media)} · {resumoAvaliacoes.total} avaliações
          </a>
          <a href="#mes-de-teste" className={styles.chip} onClick={irPara('mes-de-teste')}>
            <CalendarCheck size={16} aria-hidden="true" className={styles.chipIcone} />
            Teste 30 dias antes de assinar
          </a>
        </div>
      )}
    </div>
  )
}
