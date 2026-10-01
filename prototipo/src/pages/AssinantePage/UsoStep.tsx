import { Gauge } from 'lucide-react'
import { clienteTelemetria } from '../../data/assinante'
import { modelosEletricos } from '../../data/telemetria'
import { formatarNumero } from '../../lib/formato'
import styles from './AssinantePage.module.css'
import { GraficoDiasKm } from './GraficoDiasKm'

const linhasDoGrafico = modelosEletricos
  .filter((m) => m.id === 'dolphin' || m.id === 'dolphin-mini')
  .map((m) => ({ rotulo: m.nome, km: m.autonomiaRealKm }))

export function UsoStep() {
  const dias = clienteTelemetria.kmDiarios
  const maior = Math.max(...dias)
  const viagensLongasMes = Math.round(dias.filter((km) => km > 150).length / 12)
  return (
    <section className={styles.cartao} aria-labelledby="passo-uso">
      <h2 id="passo-uso" className={styles.tituloPasso}>
        <Gauge size={24} aria-hidden="true" /> 2. Seu uso nos últimos 12 meses
      </h2>
      <dl className={styles.numeros}>
        <div>
          <dt>km por mês</dt>
          <dd>{formatarNumero(clienteTelemetria.kmMes)} km</dd>
        </div>
        <div>
          <dt>Maior distância em um dia</dt>
          <dd>{maior} km</dd>
        </div>
        <div>
          <dt>Viagens longas (mais de 150 km)</dt>
          <dd>~{viagensLongasMes} por mês</dd>
        </div>
        <div>
          <dt>Consumo real</dt>
          <dd>{clienteTelemetria.kmPorLitro} km/l</dd>
        </div>
      </dl>
      <GraficoDiasKm kmDiarios={dias} linhas={linhasDoGrafico} />
    </section>
  )
}
