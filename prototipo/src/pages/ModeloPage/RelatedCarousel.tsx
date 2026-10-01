import { ChevronLeft, ChevronRight, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { MSG_DESATIVADO, useToast } from '../../components/ui/Toast'
import { relacionados } from '../../data/relacionados'
import { asset } from '../../lib/asset'
import styles from './RelatedCarousel.module.css'

export function RelatedCarousel() {
  const toast = useToast()
  const trilho = useRef<HTMLUListElement>(null)
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    const el = trilho.current
    if (!el) return
    const atualizar = () => {
      if (el.clientWidth === 0) return
      const total = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05))
      setTotalPaginas(total)
      setPagina(Math.min(total - 1, Math.round(el.scrollLeft / el.clientWidth)))
    }
    atualizar()
    el.addEventListener('scroll', atualizar, { passive: true })
    window.addEventListener('resize', atualizar)
    return () => {
      el.removeEventListener('scroll', atualizar)
      window.removeEventListener('resize', atualizar)
    }
  }, [])

  const irPara = (p: number) => {
    const el = trilho.current
    el?.scrollTo?.({ left: p * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className={styles.secao} aria-labelledby="relacionados-titulo">
      <h2 id="relacionados-titulo" className={styles.titulo}>
        Conheça outros modelos da categoria Eletrico que podem combinar com o seu perfil.
      </h2>
      <div className={styles.palco}>
        <button
          type="button"
          className={styles.seta}
          aria-label="Modelos anteriores"
          disabled={pagina === 0}
          onClick={() => irPara(pagina - 1)}
        >
          <ChevronLeft size={32} aria-hidden="true" />
        </button>
        <ul ref={trilho} className={styles.trilho}>
          {relacionados.map((m) => (
            <li key={m.versao} className={styles.slide}>
              <article className={styles.card}>
                <div className={styles.imagemArea}>
                  <img src={asset(m.imagem)} alt={`${m.nome} ${m.versao}`} loading="lazy" className={styles.imagem} />
                </div>
                {m.entregaRapida && (
                  <span className={styles.entrega}>
                    <Truck size={16} aria-hidden="true" />
                    Entrega rápida
                  </span>
                )}
                <h3 className={styles.nome}>{m.nome}</h3>
                <p className={styles.versao}>{m.versao}</p>
                <p className={styles.categoria}>{m.categoria}</p>
                <ul className={styles.destaques}>
                  {m.destaques.map(({ rotulo, icone: Icone }) => (
                    <li key={rotulo}>
                      <Icone size={16} aria-hidden="true" />
                      {rotulo}
                    </li>
                  ))}
                </ul>
                <div className={styles.acoes}>
                  <Button variante="outline" larguraTotal onClick={() => toast(MSG_DESATIVADO)}>
                    Tenho Interesse
                  </Button>
                  <Button variante="ghost" larguraTotal onClick={() => toast(MSG_DESATIVADO)}>
                    Ver carro
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={styles.seta}
          aria-label="Próximos modelos"
          disabled={pagina >= totalPaginas - 1}
          onClick={() => irPara(pagina + 1)}
        >
          <ChevronRight size={32} aria-hidden="true" />
        </button>
      </div>
      {totalPaginas > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para a página ${i + 1}`}
              aria-current={i === pagina ? 'true' : undefined}
              className={i === pagina ? styles.dotAtivo : styles.dot}
              onClick={() => irPara(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
