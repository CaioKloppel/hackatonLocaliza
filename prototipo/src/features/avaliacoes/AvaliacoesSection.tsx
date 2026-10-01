import { Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Accordion } from '../../components/ui/Accordion'
import { Button } from '../../components/ui/Button'
import { VertenteTag } from '../../components/ui/VertenteTag'
import { avaliacoes, resumoAvaliacoes } from '../../data/avaliacoes'
import {
  alternarFiltro,
  FILTROS_VAZIOS,
  filtrarAvaliacoes,
  ordenarRecentes,
  type FiltrosAvaliacao,
} from '../../lib/filtroAvaliacoes'
import { AvaliacaoCard } from './AvaliacaoCard'
import styles from './AvaliacoesSection.module.css'
import { FiltrosPerfil } from './FiltrosPerfil'
import { ResumoNotas } from './ResumoNotas'

const POR_PAGINA = 3

export function AvaliacoesSection() {
  const [filtros, setFiltros] = useState<FiltrosAvaliacao>(FILTROS_VAZIOS)
  const [visiveis, setVisiveis] = useState(POR_PAGINA)

  const todas = useMemo(() => ordenarRecentes(avaliacoes), [])
  const filtradas = useMemo(() => filtrarAvaliacoes(todas, filtros), [todas, filtros])

  const alternar = (grupo: keyof FiltrosAvaliacao, valor: string) => {
    setFiltros((f) => alternarFiltro(f, grupo, valor))
    setVisiveis(POR_PAGINA)
  }

  const limpar = () => {
    setFiltros(FILTROS_VAZIOS)
    setVisiveis(POR_PAGINA)
  }

  return (
    <Accordion id="avaliacoes" titulo="Avaliações de assinantes" icone={<Star size={20} />} tag={<VertenteTag n={2} />} abertoInicial={false}>
      <ResumoNotas resumo={resumoAvaliacoes} />
      <FiltrosPerfil filtros={filtros} onAlternar={alternar} />

      {filtradas.length === 0 ? (
        <div className={styles.vazio}>
          <p>Ainda não há avaliações com esse perfil.</p>
          <Button variante="outlineDark" tamanho="sm" onClick={limpar}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <>
          <p className={styles.contador} aria-live="polite">
            Mostrando {Math.min(visiveis, filtradas.length)} de {filtradas.length}
          </p>
          <ul className={styles.lista}>
            {filtradas.slice(0, visiveis).map((a) => (
              <li key={a.id}>
                <AvaliacaoCard avaliacao={a} />
              </li>
            ))}
          </ul>
          {visiveis < filtradas.length && (
            <Button variante="outlineDark" larguraTotal onClick={() => setVisiveis((v) => v + POR_PAGINA)}>
              Ver mais avaliações
            </Button>
          )}
        </>
      )}

      <p className={styles.transparencia}>
        Publicamos avaliações positivas e negativas. A moderação remove só ofensas, dados pessoais e conteúdo fora do
        tema. Quem avalia autoriza a publicação do primeiro nome e da cidade (LGPD). Não oferecemos incentivo para
        avaliar.
      </p>
    </Accordion>
  )
}
