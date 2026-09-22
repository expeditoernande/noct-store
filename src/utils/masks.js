export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function maskCPF(value) {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length < 4) return d
  if (d.length < 7) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length < 10) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

export function maskPhone(value) {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length < 3) return d
  if (d.length < 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function maskCEP(value) {
  const d = onlyDigits(value).slice(0, 8)
  if (d.length < 6) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}