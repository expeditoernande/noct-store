import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { formatBRL, formatBRLCompact, pixDiscount } from '../../utils/format'
import ProductImage from '../ProductImage/ProductImage'

function QuantityStepper({ value, onChange }) {
  return (
    <div className="inline-flex items-center border border-line">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        onClick={() => onChange(value - 1)}
        className="inline-flex h-7 w-7 items-center justify-center transition-opacity duration-200 hover:opacity-50"
      >
        <Minus size={12} strokeWidth={1.5} />
      </button>
      <span className="w-7 text-center text-[11px] tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        onClick={() => onChange(value + 1)}
        className="inline-flex h-7 w-7 items-center justify-center transition-opacity duration-200 hover:opacity-50"
      >
        <Plus size={12} strokeWidth={1.5} />
      </button>
    </div>
  )
}

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI()
  const { items, subtotal, quantity, updateQuantity, removeItem } = useCart()
  const navigate = useNavigate()

  function goToCheckout() {
    closeCart()
    navigate('/checkout')
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${cartOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!cartOpen}
      inert={!cartOpen}
    >
      <button
        type="button"
        aria-label="Fechar sacola"
        tabIndex={-1}
        onClick={closeCart}
        className={`absolute inset-0 h-full w-full bg-black/40 transition-opacity duration-300 ${
          cartOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex w-[400px] max-w-full flex-col bg-paper transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Sacola de compras"
      >
        <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-line px-5">
          <span className="text-[10px] uppercase tracking-label text-muted">
            Sacola {quantity > 0 && `(${quantity})`}
          </span>
          <button
            type="button"
            aria-label="Fechar sacola"
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center transition-opacity duration-200 hover:opacity-50"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="text-[11px] uppercase tracking-label text-muted">
              Sua sacola está vazia
            </p>
            <Link
              to="/shop"
              onClick={closeCart}
              className="border-b border-ink pb-1 text-[10px] uppercase tracking-label transition-opacity duration-200 hover:opacity-50"
            >
              Explorar a loja
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={item.lineId} className="flex gap-4 py-5">
                    <Link to={item.product ? `/produto/${item.product.slug}` : '/shop'} onClick={closeCart}>
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-18 shrink-0 object-cover bg-mist"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[11px] uppercase tracking-label text-ink">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {[item.size, item.color].filter(Boolean).join(' · ') || item.subtitle}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remover ${item.name}`}
                          onClick={() => removeItem(item.lineId)}
                          className="shrink-0 text-muted transition-colors duration-200 hover:text-ink"
                        >
                          <X size={14} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(next) => updateQuantity(item.lineId, next)}
                        />
                        <span className="text-[11px] tabular-nums text-ink">
                          {formatBRL(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 border-t border-line px-5 py-6">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-label">
                <span className="text-muted">Subtotal</span>
                <span className="text-ink">{formatBRL(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="text-muted">À vista no Pix</span>
                <span className="text-ink-soft">{formatBRLCompact(pixDiscount(subtotal))}</span>
              </div>

              <button
                type="button"
                onClick={goToCheckout}
                className="mt-6 w-full bg-ink py-4 text-[10px] uppercase tracking-label text-paper transition-opacity duration-300 hover:opacity-80"
              >
                Finalizar compra
              </button>

              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full text-center text-[10px] uppercase tracking-label text-muted transition-colors duration-200 hover:text-ink"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
