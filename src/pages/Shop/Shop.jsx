import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { useProducts } from '../../context/ProductContext'

const EMPTY_FILTERS = {
  categories: [],
  sizes: [],
  colors: [],
  ranges: [],
  sort: 'recentes',
}

function sortProducts(list, sort) {
  const copy = [...list]
  switch (sort) {
    case 'menor':
      return copy.sort((a, b) => a.price - b.price)
    case 'maior':
      return copy.sort((a, b) => b.price - a.price)
    case 'vendidos':
      return copy.sort((a, b) => b.sales - a.sales)
    case 'recentes':
    default:
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id)
  }
}

export default function Shop() {
  const [searchParams] = useSearchParams()
  const { products, priceRanges } = useProducts()
  const categoriaParam = searchParams.get('categoria') || ''
  const buscaParam = searchParams.get('busca') || ''
  const sortParam = searchParams.get('sort') || 'recentes'

  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    categories: categoriaParam ? [categoriaParam] : [],
    sort: sortParam,
  }))
  const [busca, setBusca] = useState(buscaParam)

  useEffect(() => {
    setFilters((previous) => ({
      ...previous,
      categories: categoriaParam ? [categoriaParam] : [],
      sort: sortParam,
    }))
    setBusca(buscaParam)
  }, [categoriaParam, sortParam, buscaParam])

  const filtered = useMemo(() => {
    const term = busca.trim().toLowerCase()

    const list = products.filter((product) => {
      const matchesCategory =
        !filters.categories.length || filters.categories.includes(product.category)
      const matchesSize =
        !filters.sizes.length || product.sizes.some((size) => filters.sizes.includes(size))
      const matchesColor =
        !filters.colors.length || product.colors.some((color) => filters.colors.includes(color))
      const matchesRange =
        !filters.ranges.length ||
        filters.ranges.some((label) => {
          const range = priceRanges.find((item) => item.label === label)
          return range && product.price >= range.min && product.price <= range.max
        })
      const matchesTerm =
        !term ||
        `${product.name} ${product.subtitle} ${product.category}`.toLowerCase().includes(term)

      return matchesCategory && matchesSize && matchesColor && matchesRange && matchesTerm
    })

    return sortProducts(list, filters.sort)
  }, [filters, busca, products, priceRanges])

  return (
    <div className="px-4 pt-12 md:px-6">
      <header className="pb-8">
        <p className="text-[10px] uppercase tracking-label text-muted">Catálogo</p>
        <h1 className="mt-4 text-sm uppercase tracking-label text-ink">Shop</h1>
        {busca && (
          <p className="mt-3 text-[11px] text-muted">
            Resultados para &ldquo;{busca}&rdquo;
          </p>
        )}
      </header>

      <ProductFilters
        value={filters}
        onChange={setFilters}
        onClear={() => setFilters({ ...EMPTY_FILTERS })}
        resultCount={filtered.length}
      />

      <div className="mt-8">
        <ProductGrid products={filtered} emptyMessage="Nenhuma peça corresponde aos filtros." />
      </div>
    </div>
  )
}
