import { WhatsAppIcon } from '../icons/Marcas'
import { MSG_DESATIVADO, useToast } from '../ui/Toast'
import styles from './FloatingWhatsApp.module.css'

export function FloatingWhatsApp() {
  const toast = useToast()
  return (
    <button type="button" className={styles.botao} onClick={() => toast(MSG_DESATIVADO)}>
      <WhatsAppIcon size={24} />
      <span className={styles.rotulo}>Fale com um consultor</span>
      <span className={styles.badge} aria-label="1 nova mensagem">1</span>
    </button>
  )
}
