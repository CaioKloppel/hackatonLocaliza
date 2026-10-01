import { List } from 'lucide-react'
import type { ReactNode } from 'react'
import { Accordion } from '../../components/ui/Accordion'
import { Button } from '../../components/ui/Button'
import type { ItemComIcone } from '../../data/dolphin'
import { rolarParaOrcamento } from '../../lib/rolagem'
import styles from './ListaComIcones.module.css'

interface Props {
  id: string
  titulo: string
  itens: ItemComIcone[]
  variante: 'incluso' | 'adicional'
  rodape: ReactNode
  botao: { rotulo: string; variante: 'outline' | 'outlineDark' }
}

export function ListaComIcones({ id, titulo, itens, variante, rodape, botao }: Props) {
  return (
    <Accordion id={id} titulo={titulo} icone={<List size={20} />}>
      <ul className={styles.lista}>
        {itens.map(({ titulo: t, descricao, negrito, icone: Icone }) => (
          <li key={t} className={styles.item}>
            <span className={variante === 'incluso' ? styles.iconeIncluso : styles.iconeAdicional} aria-hidden="true">
              <Icone size={32} />
            </span>
            <div>
              <h3 className={styles.titulo}>{t}</h3>
              <p className={styles.descricao}>
                {descricao}
                {negrito && (
                  <>
                    {' '}
                    <strong>{negrito}</strong>
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.rodape}>
        <p>{rodape}</p>
        <Button variante={botao.variante} onClick={rolarParaOrcamento}>
          {botao.rotulo}
        </Button>
      </div>
    </Accordion>
  )
}
