export function asset(caminho: string): string {
  return `${import.meta.env.BASE_URL}${caminho}`
}
