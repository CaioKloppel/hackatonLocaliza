import { List, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Accordion } from '../../components/ui/Accordion'
import { itensDeSerie } from '../../data/dolphin'
import { normalizar } from '../../lib/texto'
import styles from './ItensDeSerie.module.css'

export function ItensDeSerie() {
  const [busca, setBusca] = useState('')
  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim())
    return itensDeSerie.filter((i) => normalizar(i).includes(termo))
  }, [busca])

  return (
    <Accordion id="itens-de-serie" titulo="Itens de série" icone={<List size={20} />} contador={filtrados.length}>
      <div className={styles.busca}>
        <Search size={20} aria-hidden="true" className={styles.lupa} />
        <input
          type="search"
          aria-label="Pesquise por um item"
          placeholder="Pesquise por um item"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={styles.input}
        />
      </div>
      {filtrados.length > 0 ? (
        <ul className={styles.lista}>
          {filtrados.map((item) => (
            <li key={item} className={styles.linha}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.vazio}>Nenhum item encontrado.</p>
      )}
    </Accordion>
  )
}
