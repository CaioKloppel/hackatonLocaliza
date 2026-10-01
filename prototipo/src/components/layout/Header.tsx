import { ChevronDown, Menu, User, X } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import type { Rota } from '../../hooks/useHashRoute'
import { asset } from '../../lib/asset'
import { rolarParaOrcamento } from '../../lib/rolagem'
import { useModo } from '../../modo/ModoContext'
import { Button } from '../ui/Button'
import { MSG_DESATIVADO, useToast } from '../ui/Toast'
import styles from './Header.module.css'

const LINKS = ['Carros', 'Comparativo', 'Calcular Assinatura']

export function Header({ rota }: { rota: Rota }) {
  const { modo } = useModo()
  const toast = useToast()
  const [menuAberto, setMenuAberto] = useState(false)

  const desativado = (e: MouseEvent) => {
    e.preventDefault()
    toast(MSG_DESATIVADO)
  }

  const solicitarOrcamento = () => {
    if (rota !== 'modelo') window.location.hash = '#/?orcamento=1'
    else rolarParaOrcamento()
  }

  const abrirUsuario = () => {
    if (modo === 'proposta') window.location.hash = '#/assinante'
    else toast(MSG_DESATIVADO)
  }

  return (
    <header className={styles.header}>
      <div className={styles.conteudo}>
        <div className={styles.esquerda}>
          <button
            type="button"
            className={styles.hamburger}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls="menu-movel"
            onClick={() => setMenuAberto((a) => !a)}
          >
            {menuAberto ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
          <nav className={styles.nav} aria-label="Principal">
            {LINKS.map((l) => (
              <a key={l} href="#/" className={styles.link} onClick={desativado}>{l}</a>
            ))}
            <a href="#/" className={styles.link} onClick={desativado}>
              Mais <ChevronDown size={16} aria-hidden="true" />
            </a>
          </nav>
        </div>
        <a href="#/" className={styles.logo}>
          <img src={asset('assets/marca/logo-positivo.svg')} alt="Localiza Assinatura" />
        </a>
        <div className={styles.acoes}>
          <Button tamanho="sm" className={styles.cta} onClick={solicitarOrcamento}>
            Solicitar orçamento
          </Button>
          <button
            type="button"
            className={styles.usuario}
            aria-label={modo === 'proposta' ? 'Área do assinante' : 'Entrar'}
            onClick={abrirUsuario}
          >
            <User size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
      {menuAberto && (
        <nav id="menu-movel" className={styles.menuMovel} aria-label="Menu">
          {[...LINKS, 'Mais'].map((l) => (
            <a key={l} href="#/" className={styles.linkMovel} onClick={desativado}>{l}</a>
          ))}
        </nav>
      )}
    </header>
  )
}
