const DEV_API_URL = 'http://localhost:3001'

export function apiBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (import.meta.env.DEV) return DEV_API_URL
  return null
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const base = apiBaseUrl()
  if (!base) throw new Error('API não configurada nesta build')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4000)

  try {
    const res = await fetch(`${base}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: options.signal || controller.signal,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `Erro ${res.status} na API`)
    return data
  } finally {
    clearTimeout(timeout)
  }
}

export function fetchProducts(options = {}) {
  return request('/api/products', options)
}

export function createOrder(payload, token) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  })
}

export function createCheckoutPro(payload) {
  return request('/api/checkout-pro', { method: 'POST', body: JSON.stringify(payload) })
}

export function confirmCheckoutPro(token, paymentId) {
  return request(`/api/checkout-pro/${encodeURIComponent(token)}/confirm`, {
    method: 'POST',
    body: JSON.stringify({ paymentId }),
  })
}

export function registerCustomer(payload) {
  return request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) })
}

export function loginCustomer(payload) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export function fetchMe(token) {
  return request('/api/auth/me', { headers: authHeaders(token) })
}

export function fetchMyOrders(token) {
  return request('/api/auth/me/orders', { headers: authHeaders(token) })
}