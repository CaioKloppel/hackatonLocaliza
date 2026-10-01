import { cobertura } from '../../lib/recomendacao'
import { formatarPct } from '../../lib/formato'
import styles from './GraficoDiasKm.module.css'

interface Linha {
  rotulo: string
  km: number
}

interface Props {
  kmDiarios: number[]
  linhas: Linha[]
}

const LARGURA = 730
const ALTURA = 200
const TOPO = 8

export function GraficoDiasKm({ kmDiarios, linhas }: Props) {
  const ordenados = [...kmDiarios].sort((a, b) => b - a)
  const linhasDesc = [...linhas].sort((a, b) => b.km - a.km)
  const maxKm = Math.max(350, ...ordenados)
  const y = (km: number) => ALTURA - (km / maxKm) * (ALTURA - TOPO)
  const largura = LARGURA / Math.max(1, ordenados.length)

  const classeBarra = (km: number) => {
    if (linhasDesc.length > 0 && km > linhasDesc[0].km) return styles.acimaDeTodas
    if (linhasDesc.some((l) => km > l.km)) return styles.acimaDeAlguma
    return styles.dentro
  }

  const resumo = linhasDesc
    .map((l) => `${l.rotulo} (${l.km} km) cobre ${formatarPct(cobertura(kmDiarios, l.km))} dos dias`)
    .join('; ')

  return (
    <figure className={styles.figura}>
      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        preserveAspectRatio="none"
        className={styles.svg}
        role="img"
        aria-label={`Quilômetros por dia nos últimos 12 meses, do dia mais longo ao mais curto. ${resumo}.`}
      >
        {ordenados.map((km, i) => (
          <rect
            key={i}
            x={i * largura}
            y={y(km)}
            width={Math.max(largura - 0.4, 0.6)}
            height={ALTURA - y(km)}
            className={classeBarra(km)}
          />
        ))}
        {linhasDesc.map((l, i) => (
          <line
            key={l.rotulo}
            x1={0}
            x2={LARGURA}
            y1={y(l.km)}
            y2={y(l.km)}
            vectorEffect="non-scaling-stroke"
            className={i === 0 ? styles.linhaPrincipal : styles.linhaSecundaria}
          />
        ))}
      </svg>
      <figcaption className={styles.legenda}>
        <p>Cada barra é um dia dos últimos 12 meses, do mais longo ao mais curto.</p>
        <ul>
          {linhasDesc.map((l, i) => (
            <li key={l.rotulo}>
              <span className={i === 0 ? styles.marcaPrincipal : styles.marcaSecundaria} aria-hidden="true" />
              {l.rotulo} · autonomia real {l.km} km: cobre {formatarPct(cobertura(kmDiarios, l.km))} dos seus dias
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  )
}
