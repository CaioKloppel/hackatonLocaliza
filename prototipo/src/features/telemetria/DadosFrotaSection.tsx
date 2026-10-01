import { BatteryCharging, BatteryFull, Gauge, HandCoins, PlugZap, Route } from 'lucide-react'
import { Accordion } from '../../components/ui/Accordion'
import { VertenteTag } from '../../components/ui/VertenteTag'
import { fatosFrota } from '../../data/telemetria'
import styles from './DadosFrotaSection.module.css'
import { FatoCard } from './FatoCard'
import { SaudeBateriaChart } from './SaudeBateriaChart'
import { SimuladorEconomia } from './SimuladorEconomia'

export function DadosFrotaSection() {
  const f = fatosFrota
  const ultimo = f.saudeBateria[f.saudeBateria.length - 1]
  return (
    <Accordion id="dados-frota" titulo="Dados reais da frota Localiza" icone={<Gauge size={20} />} tag={<VertenteTag n={3} />}>
      <div className={styles.grade}>
        <FatoCard pergunta="O carro chega aonde eu preciso?" icone={Route}>
          <p className={styles.duplo}>
            <span><strong className={styles.numero}>{f.autonomiaCidadeKm} km</strong> na cidade</span>
            <span><strong className={styles.numero}>{f.autonomiaEstradaKm} km</strong> na estrada</span>
          </p>
          <p className={styles.legenda}>Autonomia real média</p>
        </FatoCard>
        <FatoCard pergunta="A bateria vai estragar?" icone={BatteryFull}>
          <p><strong className={styles.numero}>{ultimo.pct}%</strong> de saúde média após {ultimo.meses} meses</p>
          <SaudeBateriaChart pontos={f.saudeBateria} />
        </FatoCard>
        <FatoCard pergunta="Vou economizar de verdade?" icone={HandCoins}>
          <p><strong className={styles.numero}>{f.reducaoCustoKmPct}% menor</strong></p>
          <p className={styles.legenda}>custo por km em energia, comparado à gasolina</p>
        </FatoCard>
        <FatoCard pergunta="Vou ficar sem carga no dia a dia?" icone={BatteryCharging}>
          <p><strong className={styles.numero}>{f.diasAbaixoAutonomiaPct}% dos dias</strong></p>
          <p className={styles.legenda}>os assinantes rodaram menos que a autonomia</p>
        </FatoCard>
        <FatoCard pergunta="Recarregar vai tomar meu tempo?" icone={PlugZap}>
          <p><strong className={styles.numero}>~{f.recargasPorSemana}× por semana</strong></p>
          <p className={styles.legenda}>é quanto recarrega um assinante típico</p>
        </FatoCard>
      </div>
      <p className={styles.base}>
        Base: {f.baseCarros} BYD Dolphin da frota Localiza · {f.periodo} · dados agregados e anônimos · valores
        ilustrativos do protótipo.
      </p>
      <SimuladorEconomia />
    </Accordion>
  )
}
