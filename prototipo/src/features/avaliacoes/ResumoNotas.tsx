import { Estrelas } from '../../components/ui/Estrelas'
import type { ResumoAvaliacoes } from '../../data/avaliacoes'
import { formatarNota } from '../../lib/formato'
import styles from './ResumoNotas.module.css'

export function ResumoNotas({ resumo }: { resumo: ResumoAvaliacoes }) {
  return (
    <div className={styles.resumo}>
      <div className={styles.geral}>
        <p className={styles.media}>{formatarNota(resumo.media)}</p>
        <Estrelas nota={resumo.media} tamanho={20} />
        <p className={styles.total}>{resumo.total} avaliações verificadas</p>
      </div>
      <ul className={styles.barras} aria-label="Distribuição das notas">
        {resumo.distribuicao.map((d) => (
          <li key={d.estrelas} className={styles.linha}>
            <span className={styles.rotuloCurto}>{d.estrelas}★</span>
            <span className={styles.trilho} aria-hidden="true">
              <span className={styles.preenchido} style={{ width: `${(d.qtd / resumo.total) * 100}%` }} />
            </span>
            <span className={styles.qtd}>{d.qtd}</span>
          </li>
        ))}
      </ul>
      <ul className={styles.barras} aria-label="Notas por atributo">
        {resumo.atributos.map((a) => (
          <li key={a.rotulo} className={styles.linhaAtributo}>
            <span>{a.rotulo}</span>
            <span className={styles.trilho} aria-hidden="true">
              <span className={styles.preenchido} style={{ width: `${(a.nota / 5) * 100}%` }} />
            </span>
            <span className={styles.qtd}>{formatarNota(a.nota)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
