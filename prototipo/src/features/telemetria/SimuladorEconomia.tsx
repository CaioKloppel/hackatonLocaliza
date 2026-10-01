import { useState } from 'react'
import { CampoTexto } from '../../components/ui/Campos'
import { SegmentedCards } from '../../components/ui/SegmentedCards'
import { EFICIENCIA_DOLPHIN, PRECO_GASOLINA, tarifas } from '../../data/telemetria'
import { custoKmCombustao, custoKmEletrico, economiaEnergiaMensal } from '../../lib/economia'
import { formatarNumero, formatarReais, formatarReaisCentavos } from '../../lib/formato'
import type { PerfilRecarga } from '../../lib/recomendacao'
import styles from './SimuladorEconomia.module.css'

const CONSUMO_MIN = 6
const CONSUMO_MAX = 20

export function lerConsumo(texto: string): number | null {
  const limpo = texto.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(limpo)) return null
  const valor = Number(limpo)
  return valor >= CONSUMO_MIN && valor <= CONSUMO_MAX ? valor : null
}

export function SimuladorEconomia() {
  const [kmMes, setKmMes] = useState(2000)
  const [consumoTexto, setConsumoTexto] = useState('12')
  const [recarga, setRecarga] = useState<PerfilRecarga>('casa')

  const consumo = lerConsumo(consumoTexto)
  const economia =
    consumo === null
      ? null
      : economiaEnergiaMensal(
          kmMes,
          custoKmCombustao(PRECO_GASOLINA, consumo),
          custoKmEletrico(tarifas[recarga], EFICIENCIA_DOLPHIN),
        )

  return (
    <section className={styles.simulador} aria-labelledby="simulador-titulo">
      <h3 id="simulador-titulo" className={styles.titulo}>Quanto você economizaria com energia?</h3>

      <div className={styles.campos}>
        <div className={styles.slider}>
          <label htmlFor="sim-km" className={styles.rotulo}>
            km por mês <span className={styles.valorSlider}>{formatarNumero(kmMes)} km</span>
          </label>
          <input
            id="sim-km"
            type="range"
            min={500}
            max={4000}
            step={100}
            value={kmMes}
            onChange={(e) => setKmMes(Number(e.target.value))}
          />
        </div>

        <CampoTexto
          id="sim-consumo"
          rotulo="Consumo do seu carro atual (km/l)"
          inputMode="decimal"
          value={consumoTexto}
          onChange={(e) => setConsumoTexto(e.target.value)}
          erro={consumo === null ? `Informe um consumo entre ${CONSUMO_MIN} e ${CONSUMO_MAX} km/l.` : undefined}
        />

        <SegmentedCards
          nome="sim-recarga"
          rotulo="Onde você recarregaria?"
          compacto
          valor={recarga}
          onChange={setRecarga}
          opcoes={[
            { valor: 'casa', titulo: 'Casa' },
            { valor: 'trabalho', titulo: 'Trabalho' },
            { valor: 'rua', titulo: 'Rua' },
          ]}
        />
      </div>

      <div className={styles.resultado} aria-live="polite">
        {economia !== null &&
          (economia > 0 ? (
            <>
              <p className={styles.rotuloResultado}>Economia estimada</p>
              <p className={styles.valor}>{formatarReais(economia)}/mês</p>
              <p className={styles.ano}>{formatarReais(economia * 12)}/ano</p>
            </>
          ) : (
            <p>Com esse perfil, a energia não sai mais barata que a gasolina.</p>
          ))}
      </div>

      <details className={styles.premissas}>
        <summary>Ver premissas</summary>
        <ul>
          <li>Gasolina: {formatarReaisCentavos(PRECO_GASOLINA)}/l</li>
          <li>Energia residencial: {formatarReaisCentavos(tarifas.casa)}/kWh</li>
          <li>Recarga no trabalho: {formatarReaisCentavos(tarifas.trabalho)}/kWh (ilustrativo)</li>
          <li>Recarga pública: {formatarReaisCentavos(tarifas.rua)}/kWh (ilustrativo)</li>
          <li>Eficiência do BYD Dolphin: {EFICIENCIA_DOLPHIN} km/kWh</li>
        </ul>
      </details>

      <a href="#/assinante" className={styles.link}>
        Já é assinante de carro a combustão? Veja sua recomendação →
      </a>
    </section>
  )
}
