import { Link } from 'react-router-dom'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { useProducts } from '../../context/ProductContext'

export default function Home() {
  const { products, categories } = useProducts()
  const newProducts = products.filter((product) => product.isNew)

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-2xl animate-fade-up px-6 py-20 text-center md:py-28">
          <p className="text-[10px] uppercase tracking-label text-muted">Coleção 2026</p>
          <h1 className="mt-8 text-4xl font-light tracking-brand text-ink md:text-6xl">NØCT</h1>
          <p className="mx-auto mt-8 max-w-md text-[12px] leading-relaxed text-ink-soft">
            Peças em cortes oversized, paleta monocromática e tecidos pesados. Para quem não segue o
            padrão.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8 text-[10px] uppercase tracking-label">
            <Link
              to="/shop"
              className="border-b border-ink pb-1 text-ink transition-opacity duration-200 hover:opacity-50"
            >
              Ver todas as peças
            </Link>
            <Link
              to="/shop?sort=recentes"
              className="border-b border-line pb-1 text-muted transition-colors duration-200 hover:text-ink"
            >
              Novidades
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <ul className="grid grid-cols-2 md:grid-cols-5">
          {categories.map((category) => {
            const count = products.filter((product) => product.category === category).length
            return (
              <li key={category} className="border-b border-r border-line last:border-r-0 md:border-b-0">
                <Link
                  to={`/shop?categoria=${encodeURIComponent(category)}`}
                  className="flex items-center justify-between px-5 py-6 text-[10px] uppercase tracking-label text-ink transition-colors duration-200 hover:bg-mist"
                >
                  <span>{category}</span>
                  <span className="text-muted">{count}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="px-4 pt-16 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-label text-muted">Recém-chegadas</p>
            <h2 className="mt-3 text-sm uppercase tracking-label text-ink">New Arrivals</h2>
          </div>
          <Link
            to="/shop?sort=recentes"
            className="text-[10px] uppercase tracking-label text-muted transition-colors duration-200 hover:text-ink"
          >
            Ver tudo
          </Link>
        </div>
        <ProductGrid products={newProducts} />
      </section>

      <section className="px-4 pt-24 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-label text-muted">Catálogo completo</p>
            <h2 className="mt-3 text-sm uppercase tracking-label text-ink">Todas as peças</h2>
          </div>
          <Link
            to="/shop"
            className="text-[10px] uppercase tracking-label text-muted transition-colors duration-200 hover:text-ink"
          >
            Filtrar
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  )
}
