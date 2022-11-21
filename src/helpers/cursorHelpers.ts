export const toCursorHash = (id: number) =>
  Buffer.from(String(id)).toString('base64')

export const fromCursorHash = (text: string) =>
  Number(Buffer.from(text, 'base64').toString('ascii'))
