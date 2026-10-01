import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const publico = resolve(process.cwd(), 'public')

const webps = [
  'byd-dolphin',
  'byd-dolphin-mini-30kw',
  'byd-dolphin-mini-38kw',
  'geely-ex2-pro',
  'geely-ex2-max',
  'geely-ex5-pro',
]

describe('assets', () => {
  it.each(webps)('carros/%s.webp existe e é WebP', (nome) => {
    const caminho = resolve(publico, 'assets/carros', `${nome}.webp`)
    expect(existsSync(caminho)).toBe(true)
    const cabecalho = readFileSync(caminho).subarray(0, 12).toString('latin1')
    expect(cabecalho.startsWith('RIFF')).toBe(true)
    expect(cabecalho.slice(8)).toBe('WEBP')
  })

  it.each(['marca/logo-positivo.svg', 'marca/logo-negativo.svg', 'decor/linhas.svg'])('%s é SVG', (rel) => {
    const caminho = resolve(publico, 'assets', rel)
    expect(existsSync(caminho)).toBe(true)
    expect(readFileSync(caminho, 'utf8')).toContain('<svg')
  })

  it('favicon existe', () => {
    expect(existsSync(resolve(publico, 'favicon.ico'))).toBe(true)
  })
})
