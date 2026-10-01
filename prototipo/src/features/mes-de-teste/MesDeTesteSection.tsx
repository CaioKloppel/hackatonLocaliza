import { CalendarCheck, Car, Headset, KeyRound, MessageCircle, Signature } from 'lucide-react'
import { Accordion } from '../../components/ui/Accordion'
import { Button } from '../../components/ui/Button'
import { VertenteTag } from '../../components/ui/VertenteTag'
import { useInicio } from './InicioContext'
import styles from './MesDeTesteSection.module.css'

const PASSOS = [
  { titulo: 'Interesse', texto: 'Você escolhe a configuração do 0 km com um consultor.', icone: MessageCircle },
  { titulo: 'Crédito e contrato', texto: 'Com cláusula de desistência sem multa.', icone: Signature },
  { titulo: 'Retirada', texto: 'Um carro do mesmo modelo na frota de aluguel.', icone: KeyRound },
  { titulo: 'Apoio', texto: 'Tutorial de recarga, mapa de eletropostos e contatos nos dias 3, 15 e 25.', icone: Headset },
  { titulo: 'Decisão', texto: 'Você decide até o dia 25.', icone: CalendarCheck },
  { titulo: 'Resultado', texto: 'Chega o 0 km (o carro de teste fica com você até a entrega) ou você devolve sem multa.', icone: Car },
]

export function MesDeTesteSection() {
  const { escolherTesteERolar } = useInicio()
  return (
    <Accordion
      id="mes-de-teste"
      titulo="Mês de teste: experimente antes de assinar"
      icone={<CalendarCheck size={20} />}
      tag={<VertenteTag />}
      abertoInicial={false}
    >
      <ol className={styles.linhaDoTempo}>
        {PASSOS.map(({ titulo, texto, icone: Icone }, i) => (
          <li key={titulo} className={styles.passo}>
            <span className={styles.marcador} aria-hidden="true">
              <Icone size={20} />
            </span>
            <div>
              <h3 className={styles.titulo}>
                {i + 1}. {titulo}
              </h3>
              <p className={styles.texto}>{texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.destaque}>
        <p className={styles.destaqueNumero}>Até 73% mais barato</p>
        <p>
          que alugar um elétrico por 30 dias. Você paga só a 1ª mensalidade do plano escolhido, e ela já conta no
          contrato.
        </p>
        <p className={styles.fonte}>Comparação com diárias de aluguel de elétricos coletadas em maio de 2026 (Ekko Green).</p>
      </div>

      <ul className={styles.regras}>
        <li>Vale uma vez por CPF.</li>
        <li>A franquia de km é a mesma do plano escolhido.</li>
        <li>O mês de teste conta no prazo do contrato.</li>
      </ul>

      <Button onClick={escolherTesteERolar}>Quero testar por 30 dias</Button>
    </Accordion>
  )
}
