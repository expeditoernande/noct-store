import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from './ProductContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'noct-cart'

function buildLineId(productId, size, color) {
  return `${productId}::${size ?? '-'}::${color ?? '-'}`
}

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { getProductById } = useProducts()
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* armazenamento indisponível — ignora */
    }
  }, [items])

  const addItem = useCallback((product, { size, color, quantity = 1 } = {}) => {
    const lineId = buildLineId(product.id, size, color)
    setItems((prev) => {
      const existing = prev.find((item) => item.lineId === lineId)
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          name: product.name,
          subtitle: product.subtitle,
          price: product.price,
          image: product.images?.[0] ?? '',
          size: size ?? null,
          color: color ?? null,
          quantity,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((lineId) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId))
  }, [])

  const updateQuantity = useCallback((lineId, quantity) => {
    setItems((prev) => {
      if (quantity < 1) {
        return prev.filter((item) => item.lineId !== lineId)
      }
      return prev.map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
    })
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const cart = useMemo(() => {
    const detailed = items.map((item) => {
      const product = getProductById(item.productId)
      return {
        ...item,
        product,
        image: item.image || product?.images?.[0] || '',
        lineTotal: item.price * item.quantity,
      }
    })

    const subtotal = detailed.reduce((total, item) => total + item.lineTotal, 0)
    const quantity = detailed.reduce((total, item) => total + item.quantity, 0)

    return { items: detailed, subtotal, quantity }
  }, [items, getProductById])

  const value = useMemo(
    () => ({
      items: cart.items,
      subtotal: cart.subtotal,
      quantity: cart.quantity,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [cart, addItem, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de <CartProvider>')
  }
  return context
}
