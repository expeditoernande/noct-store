import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import ProductImage from '../../components/ProductImage/ProductImage'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { useProducts } from '../../context/ProductContext'
import { colorToHex, formatBRL, formatBRLCompact } from '../../utils/format'

export default function Product() {
  const { slug } = useParams()
  const { products, getProductBySlug } = useProducts()
  const product = getProductBySlug(slug)
  const { addItem } = useCart()
  const { openCart } = useUI()

  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const productId = product?.id

  useEffect(() => {
    setActiveImage(0)
    setSize(product?.sizes?.[0] ?? null)
    setColor(product?.colors?.[0] ?? null)
    setQuantity(1)
  }, [productId, product?.sizes, product?.colors])

  const related = useMemo(() => {
    if (!product) return []
    const sameCategory = products.filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    const others = products.filter(
      (item) => item.category !== product.category && item.id !== product.id,
    )
    return [...sameCategory, ...others].slice(0, 3)
  }, [product, products])

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-6 px-6 py-32 text-center">
        <p className="text-[11px] uppercase tracking-label text-muted">Produto não encontrado</p>
        <Link
          to="/shop"
          className="border-b border-ink pb-1 text-[10px] uppercase tracking-label transition-opacity duration-200 hover:opacity-50"
        >
          Voltar para a loja
        </Link>
      </div>
    )
  }

  function handleAddToCart() {
    addItem(product, { size, color, quantity })
    openCart()
  }

  return (
    <div className="px-4 pt-10 md:px-6">
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-label text-muted">
        <Link to="/" className="transition-colors duration-200 hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link
          to={`/shop?categoria=${encodeURIComponent(product.category)}`}
          className="transition-colors duration-200 hover:text-ink"
        >
          {product.category}
        </Link>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col-reverse gap-3 lg:flex-row">
          <div className="flex gap-3 lg:flex-col">
            {product.images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Ver imagem ${index + 1}`}
                className={`h-20 w-16 overflow-hidden border transition-colors duration-200 ${
                  activeImage === index ? 'border-ink' : 'border-transparent hover:border-line'
                }`}
              >
                <ProductImage src={image} alt="" className="h-full w-full bg-mist object-cover" />
              </button>
            ))}
          </div>

          <div className="aspect-[3/4] flex-1 overflow-hidden bg-mist">
            <ProductImage
              key={product.images[activeImage]}
              src={product.images[activeImage]}
              alt={`${product.name} — ${product.subtitle}`}
              className="h-full w-full animate-fade-in object-cover"
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-[110px] lg:self-start">
          <p className="text-[10px] uppercase tracking-label text-muted">{product.category}</p>
          <h1 className="mt-4 text-xl uppercase tracking-label text-ink md:text-2xl">
            {product.name} — {product.subtitle}
          </h1>

          <div className="mt-6 flex flex-col gap-1">
            <span className="text-sm text-ink">{formatBRL(product.price)}</span>
            <span className="text-[11px] text-muted">
              {formatBRLCompact(product.pixPrice)} no Pix · 5% de desconto
            </span>
          </div>

          <p className="mt-7 max-w-md text-[12px] leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-9">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-label text-muted">Tamanho</span>
              <span className="cursor-default text-[10px] uppercase tracking-label text-muted">
                Guia de medidas
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  className={`h-10 min-w-10 border px-3 text-[11px] transition-colors duration-200 ${
                    size === option
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line text-ink hover:border-ink'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {product.colors.length > 0 && (
            <div className="mt-7">
              <span className="text-[10px] uppercase tracking-label text-muted">
                Cor — {color}
              </span>
              <div className="mt-3 flex gap-3">
                {product.colors.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-label={option}
                    onClick={() => setColor(option)}
                    className={`h-7 w-7 rounded-full border transition-all duration-200 ${
                      color === option
                        ? 'border-ink ring-1 ring-ink ring-offset-2'
                        : 'border-line hover:border-ink'
                    }`}
                    style={{ backgroundColor: colorToHex(option) }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-9 flex items-stretch gap-3">
            <div className="flex items-center border border-line">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="inline-flex h-12 w-11 items-center justify-center transition-opacity duration-200 hover:opacity-50"
              >
                <Minus size={14} strokeWidth={1.5} />
              </button>
              <span className="w-9 text-center text-xs tabular-nums">{quantity}</span>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() => setQuantity((current) => current + 1)}
                className="inline-flex h-12 w-11 items-center justify-center transition-opacity duration-200 hover:opacity-50"
              >
                <Plus size={14} strokeWidth={1.5} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-ink py-3 text-[10px] uppercase tracking-label text-paper transition-opacity duration-300 hover:opacity-80"
            >
              Adicionar à sacola
            </button>
          </div>

          <p className="mt-4 text-[10px] text-muted">
            Frete calculado no checkout · Trocas em até 30 dias
          </p>

          <div className="mt-10 border-t border-line pt-6">
            <span className="text-[10px] uppercase tracking-label text-muted">Detalhes</span>
            <ul className="mt-4 flex flex-col gap-2">
              {product.details.map((detail) => (
                <li key={detail} className="text-[11px] text-ink-soft">
                  — {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-[10px] uppercase tracking-label text-muted">Também pode gostar</h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  )
}
