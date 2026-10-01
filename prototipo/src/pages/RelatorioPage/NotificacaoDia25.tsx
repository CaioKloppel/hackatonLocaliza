import { BellRing } from 'lucide-react'
import styles from './RelatorioPage.module.css'

interface Props {
  nome: string
  onAbrir: () => void
}

/** Simula a notificação push do app da assinatura no dia 25 do mês de teste. */
export function NotificacaoDia25({ nome, onAbrir }: Props) {
  return (
    <div className={styles.telaNotificacao}>
      <p className={styles.horario} aria-hidden="true">09:00</p>
      <p className={styles.dataTela} aria-hidden="true">Dia 25 do seu mês de teste</p>
      <button type="button" className={styles.notificacao} onClick={onAbrir}>
        <span className={styles.notificacaoIcone} aria-hidden="true">
          <BellRing size={20} />
        </span>
        <span className={styles.notificacaoTexto}>
          <span className={styles.notificacaoApp}>Localiza Assinatura · agora</span>
          <strong>{nome}, seu mês em números está pronto</strong>
          <span>Veja como o Dolphin se saiu na sua rotina antes de decidir. Toque para abrir.</span>
        </span>
      </button>
    </div>
  )
}
