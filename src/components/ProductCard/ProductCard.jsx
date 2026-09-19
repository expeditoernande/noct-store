import { Link } from 'react-router-dom'
import ProductImage from '../ProductImage/ProductImage'
import { colorToHex, formatBRL, formatBRLCompact } from '../../utils/format'

export default function ProductCard({ product }) {
  return (
    <Link to={`/produto/${product.slug}`} className="group block animate-fade-in">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-mist">
        <ProductImage
          src={product.images[0]}
          alt={`${product.name} — ${product.subtitle}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {product.images[1] && (
          <ProductImage
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          />
        )}

        {product.isNew && (
          <span className="absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[9px] uppercase tracking-label text-ink">
            Novo
          </span>
        )}
      </div>

      <div className="flex flex-col gap-0.5 px-0.5 pb-1 pt-3">
        <h3 className="text-[11px] uppercase tracking-label text-ink md:text-xs">
          {product.name} — {product.subtitle}
        </h3>
        <p className="text-[11px] text-ink-soft md:text-xs">{formatBRL(product.price)}</p>
        <p className="text-[10px] text-muted md:text-[11px]">
          {formatBRLCompact(product.pixPrice)} no Pix
        </p>

        {product.colors?.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5">
            {product.colors.map((color) => (
              <span
                key={color}
                title={color}
                className="h-2.5 w-2.5 rounded-full border border-line"
                style={{ backgroundColor: colorToHex(color) }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
