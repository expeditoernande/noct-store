import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { products } from '../../data/products'
import { formatBRL } from '../../utils/format'
import { useUI } from '../../context/UIContext'
import ProductImage from '../ProductImage/ProductImage'

export default function SearchBar() {
  const { searchOpen, closeSearch } = useUI()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!searchOpen) return
    setQuery('')
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [searchOpen])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return products
      .filter((product) =>
        `${product.name} ${product.subtitle} ${product.category}`.toLowerCase().includes(term),
      )
      .slice(0, 5)
  }, [query])

  function submitSearch(event) {
    event.preventDefault()
    const term = query.trim()
    if (!term) return
    closeSearch()
    navigate(`/shop?busca=${encodeURIComponent(term)}`)
  }

  return (
    <div
      className={`fixed inset-x-0 top-[70px] z-30 border-b border-line bg-paper transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        searchOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
      }`}
      inert={!searchOpen}
    >
      <div className="px-4 py-5 md:px-6">
        <form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-line pb-3">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar produtos..."
            aria-label="Pesquisar produtos"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
          <button
            type="button"
            aria-label="Fechar pesquisa"
            onClick={closeSearch}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center transition-opacity duration-200 hover:opacity-50"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </form>

        {query.trim() && (
          <div className="mt-4">
            {results.length === 0 ? (
              <p className="py-2 text-xs text-muted">
                Nenhum resultado para &ldquo;{query.trim()}&rdquo;.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/produto/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 py-3 transition-opacity duration-200 hover:opacity-60"
                    >
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                        className="h-16 w-12 shrink-0 object-cover"
                      />
                      <span className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-label">
                          {product.name} — {product.subtitle}
                        </span>
                        <span className="mt-1 text-[11px] text-muted">{formatBRL(product.price)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
