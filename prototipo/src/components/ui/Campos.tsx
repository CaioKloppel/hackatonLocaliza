import { ChevronDown } from 'lucide-react'
import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import styles from './Campos.module.css'

interface CampoTextoProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  rotulo: string
  erro?: string
}

export function CampoTexto({ id, rotulo, erro, className, type = 'text', ...resto }: CampoTextoProps) {
  const erroId = `${id}-erro`
  return (
    <div className={[styles.campo, className ?? ''].join(' ')}>
      <label htmlFor={id} className={styles.rotulo}>{rotulo}</label>
      <input
        id={id}
        type={type}
        className={erro ? styles.inputErro : styles.input}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? erroId : undefined}
        {...resto}
      />
      {erro && <span id={erroId} className={styles.erro}>{erro}</span>}
    </div>
  )
}

interface CampoSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  rotulo: string
  opcoes: string[]
}

export function CampoSelect({ id, rotulo, opcoes, className, ...resto }: CampoSelectProps) {
  return (
    <div className={[styles.campo, className ?? ''].join(' ')}>
      <label htmlFor={id} className={styles.rotulo}>{rotulo}</label>
      <div className={styles.selectWrap}>
        <select id={id} className={styles.select} {...resto}>
          {opcoes.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={20} aria-hidden="true" className={styles.chevron} />
      </div>
    </div>
  )
}

interface CampoCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  rotulo: string
}

export function CampoCheckbox({ id, rotulo, ...resto }: CampoCheckboxProps) {
  return (
    <label htmlFor={id} className={styles.checkbox}>
      <input id={id} type="checkbox" className={styles.caixa} {...resto} />
      <span>{rotulo}</span>
    </label>
  )
}
