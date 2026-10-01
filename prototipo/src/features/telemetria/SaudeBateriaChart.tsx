import type { PontoSaude } from '../../data/telemetria'
import styles from './SaudeBateriaChart.module.css'

const LARGURA = 260
const ALTURA = 104
const MARGEM = 12
const BASE_GRAFICO = 76
const TOPO = 22
const PCT_MIN = 94
const PCT_MAX = 100

export function SaudeBateriaChart({ pontos }: { pontos: PontoSaude[] }) {
  const ultimoMes = pontos[pontos.length - 1]?.meses || 1
  const x = (meses: number) => MARGEM + (meses / ultimoMes) * (LARGURA - 2 * MARGEM)
  const y = (pct: number) => TOPO + ((PCT_MAX - pct) / (PCT_MAX - PCT_MIN)) * (BASE_GRAFICO - TOPO)
  const caminho = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.meses).toFixed(1)},${y(p.pct).toFixed(1)}`).join(' ')
  const descricao = pontos.map((p) => `${p.meses} meses: ${p.pct}%`).join('; ')

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      className={styles.grafico}
      role="img"
      aria-label={`Saúde média da bateria ao longo do tempo. ${descricao}`}
    >
      <line x1={MARGEM} x2={LARGURA - MARGEM} y1={BASE_GRAFICO} y2={BASE_GRAFICO} className={styles.eixo} />
      <path d={caminho} className={styles.linha} />
      {pontos.map((p) => (
        <g key={p.meses}>
          <circle cx={x(p.meses)} cy={y(p.pct)} r={3.5} className={styles.ponto} />
          <text x={x(p.meses)} y={y(p.pct) - 8} textAnchor="middle" className={styles.valor}>{p.pct}%</text>
          <text x={x(p.meses)} y={ALTURA - 8} textAnchor="middle" className={styles.rotulo}>{p.meses}m</text>
        </g>
      ))}
    </svg>
  )
}
