export function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatBRLCompact(value) {
  const [int, dec] = Number(value).toFixed(2).split('.')
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `R$${withDots},${dec}`
}

export function pixDiscount(value, rate = 0.05) {
  return Math.round(Number(value) * (1 - rate) * 100) / 100
}

export const COLOR_HEX = {
  Preto: '#111111',
  Grafite: '#4a4a4a',
  Cinza: '#9a9a9a',
  'Off-white': '#f1efe9',
  Branco: '#ffffff',
}

export function colorToHex(color) {
  return COLOR_HEX[color] ?? '#111111'
}
