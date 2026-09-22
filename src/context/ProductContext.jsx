import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { products as localProducts } from '../data/products'
import { fetchProducts } from '../services/api'

const ProductContext = createContext(null)

export const priceRanges = [
  { label: 'Até R$ 250', min: 0, max: 250 },
  { label: 'R$ 250 — R$ 350', min: 250, max: 350 },
  { label: 'R$ 350 — R$ 450', min: 350, max: 450 },
  { label: 'Acima de R$ 450', min: 450, max: Infinity },
]

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(localProducts)
  const [source, setSource] = useState('local')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2500)

    fetchProducts({ signal: controller.signal })
      .then((payload) => {
        const apiProducts = Array.isArray(payload) ? payload : payload.products
        if (apiProducts?.length) {
          setProducts(apiProducts)
          setSource('api')
        }
      })
      .catch(() => {
        // API indisponível — mantém catálogo local
      })
      .finally(() => {
        clearTimeout(timeout)
        setLoading(false)
      })

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products])
  const allSizes = useMemo(() => [...new Set(products.flatMap((p) => p.sizes))], [products])
  const allColors = useMemo(() => [...new Set(products.flatMap((p) => p.colors))], [products])

  const getProductBySlug = useCallback(
    (slug) => products.find((p) => p.slug === slug),
    [products],
  )

  const getProductById = useCallback(
    (id) => products.find((p) => p.id === Number(id)),
    [products],
  )

  const value = useMemo(
    () => ({
      products,
      categories,
      allSizes,
      allColors,
      priceRanges,
      getProductBySlug,
      getProductById,
      source,
      loading,
    }),
    [products, categories, allSizes, allColors, getProductBySlug, getProductById, source, loading],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de <ProductProvider>')
  }
  return context
}