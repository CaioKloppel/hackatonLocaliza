import { BadgeCheck, MessageSquareReply } from 'lucide-react'
import { Estrelas } from '../../components/ui/Estrelas'
import type { Avaliacao, LocalRecarga, TipoAvaliador, Uso } from '../../lib/filtroAvaliacoes'
import { formatarData } from '../../lib/formato'
import styles from './AvaliacaoCard.module.css'

const SELOS: Record<TipoAvaliador, string> = {
  assinante: 'Assinante verificado',
  teste: 'Cliente em teste',
  aluguel: 'Cliente de aluguel',
}
const USO: Record<Uso, string> = { cidade: 'Uso na cidade', estrada: 'Uso na estrada' }
const RECARGA: Record<LocalRecarga, string> = {
  casa: 'Recarrega em casa',
  trabalho: 'Recarrega no trabalho',
  rua: 'Recarrega na rua',
}

export function AvaliacaoCard({ avaliacao: a }: { avaliacao: Avaliacao }) {
  return (
    <article className={styles.card} aria-label={`Avaliação de ${a.nome}`}>
      <div className={styles.topo}>
        <div>
          <p className={styles.nome}>
            {a.nome} · {a.cidade}
          </p>
          <span className={a.tipo === 'assinante' ? styles.seloAssinante : styles.selo}>
            <BadgeCheck size={16} aria-hidden="true" />
            {SELOS[a.tipo]}
          </span>
        </div>
        <div className={styles.nota}>
          <Estrelas nota={a.nota} />
          <time dateTime={a.data} className={styles.data}>{formatarData(a.data)}</time>
        </div>
      </div>
      <ul className={styles.tags} aria-label="Perfil de quem avaliou">
        <li>{USO[a.uso]}</li>
        <li>{RECARGA[a.recarga]}</li>
        <li>{a.tempo}</li>
      </ul>
      <p className={styles.texto}>{a.texto}</p>
      {a.resposta && (
        <div className={styles.resposta}>
          <p className={styles.respostaTitulo}>
            <MessageSquareReply size={16} aria-hidden="true" />
            Resposta da Localiza
          </p>
          <p>{a.resposta}</p>
        </div>
      )}
    </article>
  )
}
