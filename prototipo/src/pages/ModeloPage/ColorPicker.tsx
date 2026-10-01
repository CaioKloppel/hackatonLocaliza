import type { CSSProperties } from 'react'
import type { CorVeiculo } from '../../data/dolphin'
import styles from './ColorPicker.module.css'

interface Props {
  cores: CorVeiculo[]
  selecionada: CorVeiculo
  onChange: (c: CorVeiculo) => void
}

export function ColorPicker({ cores, selecionada, onChange }: Props) {
  return (
    <div className={styles.picker}>
      <div role="radiogroup" aria-label="Cor do veículo" className={styles.swatches}>
        {cores.map((c) => {
          const ativa = c.nome === selecionada.nome
          return (
            <button
              key={c.nome}
              type="button"
              role="radio"
              aria-checked={ativa}
              aria-label={c.nome}
              className={styles.alvo}
              onClick={() => onChange(c)}
            >
              <span className={ativa ? styles.swatchAtivo : styles.swatch} style={{ '--cor': c.hex } as CSSProperties} />
            </button>
          )
        })}
      </div>
      <p className={styles.nome}>{selecionada.nome}</p>
    </div>
  )
}
