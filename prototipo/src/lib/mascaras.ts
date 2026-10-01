export function somenteDigitos(v: string): string {
  return v.replace(/\D/g, '')
}

/** Aplica um padrão em que `9` é um dígito. Para quando os dígitos acabam. */
function aplicarPadrao(digitos: string, padrao: string): string {
  let saida = ''
  let i = 0
  for (const ch of padrao) {
    if (i >= digitos.length) break
    if (ch === '9') saida += digitos[i++]
    else saida += ch
  }
  return saida
}

export function mascaraTelefone(v: string): string {
  return aplicarPadrao(somenteDigitos(v).slice(0, 11), '(99) 99999-9999')
}

export function mascaraDocumento(v: string): string {
  const d = somenteDigitos(v).slice(0, 14)
  return d.length <= 11 ? aplicarPadrao(d, '999.999.999-99') : aplicarPadrao(d, '99.999.999/9999-99')
}

export function mascaraCep(v: string): string {
  return aplicarPadrao(somenteDigitos(v).slice(0, 8), '99999-999')
}
