import { BatteryCharging, Fuel, PlugZap, Route } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { VertenteTag } from '../../components/ui/VertenteTag'
import { clienteEmTeste, diasDeTeste } from '../../data/mesDeTeste'
import { modelosEletricos, PRECO_GASOLINA, tarifas } from '../../data/telemetria'
import { formatarNumero, formatarReais } from '../../lib/formato'
import { consolidarMes } from '../../lib/relatorioMes'
import { DecisaoTeste } from './DecisaoTeste'
import { GraficoMes } from './GraficoMes'
import { NotificacaoDia25 } from './NotificacaoDia25'
import styles from './RelatorioPage.module.css'

const AUTONOMIA_DOLPHIN = modelosEletricos.find((m) => m.id === 'dolphin')!.autonomiaRealKm

const LOCAIS = [
  { chave: 'casa', rotulo: 'Casa' },
  { chave: 'trabalho', rotulo: 'Trabalho' },
  { chave: 'rua', rotulo: 'Rua' },
] as const

export function RelatorioPage() {
  const [aberto, setAberto] = useState(false)
  const c = clienteEmTeste

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [aberto])

  const r = useMemo(
    () =>
      consolidarMes(diasDeTeste, {
        autonomiaKm: AUTONOMIA_DOLPHIN,
        tarifas,
        precoGasolina: PRECO_GASOLINA,
        kmPorLitro: c.kmPorLitroCarroAnterior,
      }),
    [c.kmPorLitroCarroAnterior],
  )

  if (!aberto) {
    return (
      <main className={styles.pagina}>
        <div className={styles.container}>
          <VertenteTag n={1} />
          <NotificacaoDia25 nome={c.nome} onAbrir={() => setAberto(true)} />
        </div>
      </main>
    )
  }

  const sobrou = r.diasAcimaAutonomia.length === 0

  return (
    <main className={styles.pagina}>
      <div className={styles.container}>
        <VertenteTag n={1} />
        <p className={styles.saudacao}>Olá, {c.nome}</p>
        <h1 className={styles.titulo}>Seu mês em números</h1>
        <p className={styles.subtitulo}>
          Dia {c.diaAtual} de {c.diasDoTeste} do mês de teste · {c.modelo}
        </p>

        <div className={styles.grade}>
          <section className={styles.card} aria-labelledby="card-km">
            <h2 id="card-km" className={styles.tituloCard}>
              <Route size={20} aria-hidden="true" /> Km rodados
            </h2>
            <p className={styles.numero}>{formatarNumero(r.kmTotal)} km</p>
            <p className={styles.legenda}>Média de {r.kmMediaDia} km por dia</p>
            <p className={styles.destaque}>
              Maior uso: dia {r.diaMaiorUso.dia} · {r.diaMaiorUso.km} km
            </p>
          </section>

          <section className={styles.card} aria-labelledby="card-recargas">
            <h2 id="card-recargas" className={styles.tituloCard}>
              <PlugZap size={20} aria-hidden="true" /> Recargas
            </h2>
            <p className={styles.numero}>{r.totalRecargas} recargas</p>
            <ul className={styles.barras} aria-label="Recargas por local">
              {LOCAIS.map(({ chave, rotulo }) => (
                <li key={chave} className={styles.linhaBarra}>
                  <span>{rotulo}</span>
                  <span className={styles.trilho} aria-hidden="true">
                    <span
                      className={styles[`preenchido_${chave}`]}
                      style={{ width: `${(r.recargas[chave] / Math.max(1, r.totalRecargas)) * 100}%` }}
                    />
                  </span>
                  <span className={styles.qtd}>{r.recargas[chave]}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.card} aria-labelledby="card-autonomia">
            <h2 id="card-autonomia" className={styles.tituloCard}>
              <BatteryCharging size={20} aria-hidden="true" /> Autonomia
            </h2>
            {sobrou ? (
              <p className={styles.numeroMenor}>Sobrou em todos os {r.dias} dias</p>
            ) : (
              <p className={styles.numeroMenor}>
                Faltou em {r.diasAcimaAutonomia.length} {r.diasAcimaAutonomia.length === 1 ? 'dia' : 'dias'}: dia{' '}
                {r.diasAcimaAutonomia.join(', ')}
              </p>
            )}
            <p className={styles.legenda}>
              A menor carga foi {r.menorCarga.pct}%, no dia {r.menorCarga.dia}.
            </p>
          </section>

          <section className={styles.card} aria-labelledby="card-energia">
            <h2 id="card-energia" className={styles.tituloCard}>
              <Fuel size={20} aria-hidden="true" /> Energia × combustível
            </h2>
            <dl className={styles.comparacao}>
              <div>
                <dt>Você gastou de energia</dt>
                <dd className={styles.valorEnergia}>{formatarReais(r.gastoEnergia)}</dd>
              </div>
              <div>
                <dt>Gastaria de gasolina com os mesmos km</dt>
                <dd className={styles.valorCombustivel}>{formatarReais(r.gastoCombustivel)}</dd>
              </div>
            </dl>
            <p className={styles.economia}>Você economizou {formatarReais(r.economia)}</p>
            <p className={styles.legenda}>
              Em 30 dias, a economia chegaria a cerca de {formatarReais(r.economiaProjetada30)}.
            </p>
          </section>
        </div>

        <section className={styles.cartao} aria-labelledby="grafico-titulo">
          <h2 id="grafico-titulo" className={styles.tituloCartao}>Seus {r.dias} dias, dia a dia</h2>
          <GraficoMes dias={diasDeTeste} autonomiaKm={AUTONOMIA_DOLPHIN} />
        </section>

        <DecisaoTeste diasRestantes={c.diasDoTeste - c.diaAtual} />

        <p className={styles.privacidade}>
          Este relatório usa só os dados de telemetria do seu carro de teste, com o seu consentimento (LGPD). Gasolina a{' '}
          R$ 6,00/l e consumo de {c.kmPorLitroCarroAnterior} km/l do seu carro anterior. Valores ilustrativos do
          protótipo.
        </p>
      </div>
    </main>
  )
}
