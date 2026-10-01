import { Cookie, Lock } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { asset } from '../../lib/asset'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YoutubeIcon } from '../icons/Marcas'
import { Button } from '../ui/Button'
import { MSG_DESATIVADO, useToast } from '../ui/Toast'
import styles from './Footer.module.css'

const COLUNAS = [
  { titulo: 'Assinatura', links: ['Carros', 'Comparativo', 'Calcular Assinatura', 'Blog', 'Central de ajuda', 'Benefícios'] },
  { titulo: 'Localiza', links: ['Aluguel de carros', 'Seminovos', 'Aluguel de frotas', 'Carros para aplicativo (Zarp)'] },
]

export function Footer() {
  const toast = useToast()
  const [logoFalhou, setLogoFalhou] = useState(false)
  const desativado = (e: MouseEvent) => {
    e.preventDefault()
    toast(MSG_DESATIVADO)
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.conteudo}>
        <div className={styles.marca}>
          <img
            src={asset(logoFalhou ? 'assets/marca/logo-positivo.svg' : 'assets/marca/logo-negativo.svg')}
            alt="Localiza Assinatura"
            className={logoFalhou ? styles.logoInvertido : styles.logo}
            onError={() => setLogoFalhou(true)}
          />
          <p className={styles.tagline}>A melhor e mais completa solução de carro por assinatura do país.</p>
        </div>
        {COLUNAS.map((c) => (
          <nav key={c.titulo} aria-label={c.titulo}>
            <h2 className={styles.tituloColuna}>{c.titulo}</h2>
            <ul className={styles.links}>
              {c.links.map((l) => (
                <li key={l}><a href="#/" onClick={desativado}>{l}</a></li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className={styles.tituloColuna}>Contatos</h2>
          <Button variante="secondary" tamanho="sm" icone={<WhatsAppIcon size={20} />} onClick={() => toast(MSG_DESATIVADO)}>
            Atendimento Whatsapp
          </Button>
          <ul className={styles.contatos}>
            <li>Whatsapp: <strong>31 3003-4774</strong></li>
            <li>Central de vendas: <strong>0800 979 3003</strong></li>
            <li>Central de atendimento: <strong>0800 099 1001</strong></li>
          </ul>
        </div>
      </div>
      <div className={styles.barra}>
        <div className={styles.barraEsquerda}>
          <span>© Localiza - Todos os direitos reservados.</span>
          <a href="#/" onClick={desativado}><strong>Aviso de privacidade</strong></a>
          <a href="#/" onClick={desativado} className={styles.cookies}>
            <Cookie size={16} aria-hidden="true" /> Preferências de Cookies
          </a>
        </div>
        <div className={styles.barraDireita}>
          <span className={styles.seguro}>
            <Lock size={16} aria-hidden="true" /> Site seguro — Proteção e criptografia garantidos
          </span>
          <a href="#/" onClick={desativado} aria-label="Instagram"><InstagramIcon /></a>
          <a href="#/" onClick={desativado} aria-label="Facebook"><FacebookIcon /></a>
          <a href="#/" onClick={desativado} aria-label="YouTube"><YoutubeIcon /></a>
        </div>
      </div>
    </footer>
  )
}
