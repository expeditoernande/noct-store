import ProductCard from '../ProductCard/ProductCard'

export default function ProductGrid({ products, emptyMessage = 'Nenhuma peça encontrada.' }) {
  if (!products?.length) {
    return (
      <p className="py-24 text-center text-[11px] uppercase tracking-label text-muted">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-1.5 md:gap-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
