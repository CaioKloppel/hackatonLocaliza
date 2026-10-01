import { CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { SegmentedCards } from '../../components/ui/SegmentedCards'
import styles from './RelatorioPage.module.css'

type Estado = 'decidindo' | 'assinou' | 'devolvendo' | 'devolveu'
type Motivo = 'recarga' | 'autonomia' | 'preco' | 'adaptacao' | 'outro'

const MOTIVOS: { valor: Motivo; titulo: string }[] = [
  { valor: 'recarga', titulo: 'Recarga' },
  { valor: 'autonomia', titulo: 'Autonomia' },
  { valor: 'preco', titulo: 'Preço' },
  { valor: 'adaptacao', titulo: 'Adaptação ao carro' },
  { valor: 'outro', titulo: 'Outro' },
]

export function DecisaoTeste({ diasRestantes }: { diasRestantes: number }) {
  const [estado, setEstado] = useState<Estado>('decidindo')
  const [motivo, setMotivo] = useState<Motivo | null>(null)

  return (
    <section className={styles.cartao} aria-labelledby="decisao-titulo">
      <h2 id="decisao-titulo" className={styles.tituloCartao}>Hoje é o dia de decidir</h2>

      {estado === 'decidindo' && (
        <>
          <p>
            Se quiser ficar com o elétrico, fazemos o pedido do seu 0 km hoje e o carro de teste fica com você até a
            entrega. Se não se adaptou, devolve sem multa nos próximos {diasRestantes} dias.
          </p>
          <div className={styles.botoes}>
            <Button onClick={() => setEstado('assinou')}>Quero meu 0 km</Button>
            <Button variante="outlineDark" onClick={() => setEstado('devolvendo')}>Devolver sem multa</Button>
          </div>
        </>
      )}

      {estado === 'assinou' && (
        <p role="status" className={styles.confirmacao}>
          <CircleCheck size={24} aria-hidden="true" />
          Pedido do seu 0 km registrado (protótipo). O carro de teste fica com você até a entrega.
        </p>
      )}

      {estado === 'devolvendo' && (
        <>
          <SegmentedCards
            nome="motivo-devolucao"
            rotulo="Qual o principal motivo? Isso nos ajuda a melhorar."
            compacto
            valor={motivo}
            onChange={setMotivo}
            opcoes={MOTIVOS}
          />
          <div className={styles.botoes}>
            <Button disabled={motivo === null} onClick={() => setEstado('devolveu')}>Enviar e agendar devolução</Button>
            <Button variante="ghost" onClick={() => setEstado('decidindo')}>Voltar</Button>
          </div>
        </>
      )}

      {estado === 'devolveu' && (
        <p role="status" className={styles.confirmacao}>
          <CircleCheck size={24} aria-hidden="true" />
          Obrigado pela resposta. Vamos te chamar para agendar a devolução, sem multa (protótipo).
        </p>
      )}
    </section>
  )
}
