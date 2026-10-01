import { Chip } from '../../components/ui/Chip'
import type { FiltrosAvaliacao } from '../../lib/filtroAvaliacoes'
import styles from './FiltrosPerfil.module.css'

const GRUPOS: { chave: keyof FiltrosAvaliacao; rotulo: string; opcoes: { valor: string; rotulo: string }[] }[] = [
  { chave: 'uso', rotulo: 'Uso', opcoes: [{ valor: 'cidade', rotulo: 'Cidade' }, { valor: 'estrada', rotulo: 'Estrada' }] },
  {
    chave: 'recarga',
    rotulo: 'Recarrega em',
    opcoes: [
      { valor: 'casa', rotulo: 'Casa' },
      { valor: 'trabalho', rotulo: 'Trabalho' },
      { valor: 'rua', rotulo: 'Rua' },
    ],
  },
  {
    chave: 'tipo',
    rotulo: 'Tipo',
    opcoes: [
      { valor: 'assinante', rotulo: 'Assinante' },
      { valor: 'teste', rotulo: 'Cliente em teste' },
      { valor: 'aluguel', rotulo: 'Cliente de aluguel' },
    ],
  },
]

interface Props {
  filtros: FiltrosAvaliacao
  onAlternar: (grupo: keyof FiltrosAvaliacao, valor: string) => void
}

export function FiltrosPerfil({ filtros, onAlternar }: Props) {
  return (
    <div className={styles.filtros}>
      <h3 className={styles.titulo}>Encontre alguém com a sua rotina</h3>
      {GRUPOS.map((g) => (
        <div key={g.chave} role="group" aria-label={g.rotulo} className={styles.grupo}>
          <span className={styles.rotulo} aria-hidden="true">{g.rotulo}</span>
          <div className={styles.chips}>
            {g.opcoes.map((o) => (
              <Chip
                key={o.valor}
                selecionado={(filtros[g.chave] as string[]).includes(o.valor)}
                onClick={() => onAlternar(g.chave, o.valor)}
              >
                {o.rotulo}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
