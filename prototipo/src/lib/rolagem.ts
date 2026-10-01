function reduzirMovimento(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export const EVENTO_ABRIR_SECAO = 'abrir-secao'

/** Abre a seção (acordeão) com esse id, se estiver fechada, e rola até ela. */
export function rolarPara(id: string): void {
  window.dispatchEvent(new CustomEvent<string>(EVENTO_ABRIR_SECAO, { detail: id }))
  // Rola no tick seguinte: abrir a seção muda a altura da página e interromperia o scroll suave.
  window.setTimeout(() => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: reduzirMovimento() ? 'auto' : 'smooth', block: 'start' })
  }, 0)
}

export function focarPrimeiroVazio(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const campos = el.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="email"], input[type="tel"]')
  const vazio = Array.from(campos).find((c) => c.value === '')
  vazio?.focus({ preventScroll: true })
}

/** Rola até o formulário de orçamento e foca o primeiro campo vazio no próximo tick. */
export function rolarParaOrcamento(): void {
  window.setTimeout(() => {
    rolarPara('orcamento')
    focarPrimeiroVazio('orcamento')
  }, 0)
}
