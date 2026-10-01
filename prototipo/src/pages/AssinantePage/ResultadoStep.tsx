import { Sparkles } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { imagemModelo } from '../../data/telemetria'
import { asset } from '../../lib/asset'
import { gastoEnergiaMensal } from '../../lib/economia'
import { formatarNumero, formatarPct, formatarReais, formatarReaisComSinal } from '../../lib/formato'
import type { AvaliacaoModelo, PerfilRecarga, ResultadoRecomendacao } from '../../lib/recomendacao'
import { useModo } from '../../modo/ModoContext'
import styles from './AssinantePage.module.css'

interface Props {
  resultado: ResultadoRecomendacao
  perfil: PerfilRecarga
  kmMes: number
}

export const MSG_RENOVACAO = 'Renovação registrada (protótipo).'

function nomeCurto(nome: string) {
  return nome.replace(/^BYD /, '')
}

function Recomendacao({ r, kmMes, custoKmComb }: { r: AvaliacaoModelo; kmMes: number; custoKmComb: number }) {
  const { setModo } = useModo()
  const toast = useToast()
  const gastoComb = gastoEnergiaMensal(kmMes, custoKmComb)
  const gastoElet = gastoEnergiaMensal(kmMes, r.custoKmEletrico)
  const delta = r.modelo.deltaMensalidade
  const imagem = imagemModelo[r.modelo.id]

  const testar = () => {
    setModo('proposta')
    window.location.hash = '#/?teste=1'
  }

  return (
    <div className={styles.recomendacao}>
      <p className={styles.rotuloRecomendado}>
        <Sparkles size={16} aria-hidden="true" /> Recomendado para você
      </p>
      <h3 className={styles.nomeModelo}>{r.modelo.nome}</h3>
      {imagem && <img src={asset(imagem)} alt={r.modelo.nome} className={styles.imagemModelo} />}
      <p className={styles.cobertura}>Cobre {formatarPct(r.cobertura)} dos seus dias</p>

      <div className={styles.tabelaWrap}>
        <table className={styles.tabela}>
          <caption className="visually-hidden">Comparação do custo mensal entre o carro atual e o elétrico recomendado</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Combustão (atual)</th>
              <th scope="col">Elétrico (recomendado)</th>
              <th scope="col">Diferença</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Gasto mensal com energia ({formatarNumero(kmMes)} km)</th>
              <td>{formatarReais(gastoComb)}</td>
              <td>{formatarReais(gastoElet)}</td>
              <td>{formatarReaisComSinal(gastoElet - gastoComb)}</td>
            </tr>
            <tr>
              <th scope="row">Mensalidade</th>
              <td>M</td>
              <td>M + {formatarReais(delta)}</td>
              <td>{formatarReaisComSinal(delta)}</td>
            </tr>
            <tr className={styles.linhaTotal}>
              <th scope="row">Custo total por mês</th>
              <td>M + {formatarReais(gastoComb)}</td>
              <td>M + {formatarReais(gastoElet + delta)}</td>
              <td><strong>{formatarReaisComSinal(gastoElet + delta - gastoComb)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.economia}>
        Você economiza {formatarReais(r.economiaLiquida)}/mês · {formatarReais(r.economiaLiquida * 12)}/ano
      </p>

      <div className={styles.botoes}>
        <Button onClick={testar}>Testar o {nomeCurto(r.modelo.nome)} por 30 dias</Button>
        <Button variante="outlineDark" onClick={() => toast(MSG_RENOVACAO)}>Renovar com carro a combustão</Button>
      </div>
      <p className={styles.nota}>Se não se adaptar no mês de teste, você renova com carro a combustão, sem multa.</p>
    </div>
  )
}

export function ResultadoStep({ resultado, perfil, kmMes }: Props) {
  const toast = useToast()
  const r = resultado.recomendado
  const outros = resultado.avaliados.filter((a) => a !== r)

  return (
    <section className={styles.cartao} aria-labelledby="passo-resultado">
      <h2 id="passo-resultado" className={styles.tituloPasso}>4. Resultado</h2>
      {r ? (
        <Recomendacao r={r} kmMes={kmMes} custoKmComb={resultado.custoKmCombustao} />
      ) : (
        <div className={styles.semRecomendacao}>
          <p>
            {perfil === 'rua'
              ? 'Hoje um elétrico não compensa para a sua rotina: com recarga pública, a economia não cobre a diferença de mensalidade. Renove com carro a combustão, sem multa.'
              : 'Hoje um elétrico não compensa para a sua rotina. Renove com carro a combustão, sem multa.'}
          </p>
          <Button onClick={() => toast(MSG_RENOVACAO)}>Renovar com carro a combustão</Button>
        </div>
      )}

      <h3 className={styles.subtitulo} id="outros-modelos">Outros modelos avaliados</h3>
      <ul className={styles.outros} aria-label="Outros modelos avaliados">
        {outros.map((a) => (
          <li key={a.modelo.id} className={styles.outro}>
            <strong>{a.modelo.nome}</strong>
            {a.motivosExclusao.length > 0 ? (
              <ul className={styles.motivos}>
                {a.motivosExclusao.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : (
              <span> · elegível, economia de {formatarReais(a.economiaLiquida)}/mês</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
