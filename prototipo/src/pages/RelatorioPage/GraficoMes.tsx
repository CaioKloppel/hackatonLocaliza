import type { DiaDeUso } from '../../lib/relatorioMes'
import styles from './GraficoMes.module.css'

interface Props {
  dias: DiaDeUso[]
  autonomiaKm: number
}

const LARGURA = 500
const ALTURA = 200
const TOPO = 8
const BASE = 176

const NOME_LOCAL = { casa: 'casa', trabalho: 'trabalho', rua: 'rua' } as const

export function GraficoMes({ dias, autonomiaKm }: Props) {
  const maxKm = Math.max(autonomiaKm + 30, ...dias.map((d) => d.km))
  const y = (km: number) => BASE - (km / maxKm) * (BASE - TOPO)
  const passo = LARGURA / Math.max(1, dias.length)
  const largura = passo * 0.7
  const recargas = dias.filter((d) => d.recarga)
  const resumo =
    `Quilômetros por dia nos ${dias.length} dias do teste, com a autonomia real de ${autonomiaKm} km. ` +
    `Recargas: ${recargas.map((d) => `dia ${d.dia} (${NOME_LOCAL[d.recarga!.local]})`).join(', ')}.`

  return (
    <figure className={styles.figura}>
      <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} preserveAspectRatio="none" className={styles.svg} role="img" aria-label={resumo}>
        {dias.map((d, i) => (
          <rect
            key={d.dia}
            x={i * passo + (passo - largura) / 2}
            y={y(d.km)}
            width={largura}
            height={BASE - y(d.km)}
            rx={2}
            className={d.km > autonomiaKm ? styles.barraAcima : styles.barra}
          />
        ))}
        {recargas.map((d) => (
          <circle
            key={`r${d.dia}`}
            cx={dias.indexOf(d) * passo + passo / 2}
            cy={BASE + 12}
            r={5}
            className={styles[`recarga_${d.recarga!.local}`]}
          />
        ))}
        <line x1={0} x2={LARGURA} y1={y(autonomiaKm)} y2={y(autonomiaKm)} vectorEffect="non-scaling-stroke" className={styles.linha} />
      </svg>
      <figcaption className={styles.legenda}>
        <span><i className={styles.marcaLinha} aria-hidden="true" /> Autonomia real do Dolphin ({autonomiaKm} km)</span>
        <span><i className={styles.ponto_casa} aria-hidden="true" /> Recarga em casa</span>
        <span><i className={styles.ponto_trabalho} aria-hidden="true" /> No trabalho</span>
        <span><i className={styles.ponto_rua} aria-hidden="true" /> Na rua</span>
      </figcaption>
    </figure>
  )
}
