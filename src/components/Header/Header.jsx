import { Link } from 'react-router-dom'
import { Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'

function IconButton({ label, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center text-ink transition-opacity duration-200 hover:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default function Header() {
  const { openMenu, openSearch, openCart } = useUI()
  const { quantity } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="grid h-[70px] grid-cols-[1fr_auto_1fr] items-center px-2 md:px-6">
        <div className="flex items-center gap-0.5 md:gap-1">
          <IconButton label="Abrir menu" onClick={openMenu}>
            <Menu size={18} strokeWidth={1.5} />
          </IconButton>
          <IconButton label="Pesquisar" onClick={openSearch} className="hidden md:inline-flex">
            <Search size={18} strokeWidth={1.5} />
          </IconButton>
        </div>

        <Link
          to="/"
          aria-label="NØCT — página inicial"
          className="justify-self-center pl-[0.42em] text-sm font-medium tracking-brand text-ink md:text-base"
        >
          NØCT
        </Link>

        <div className="flex items-center justify-end gap-0.5 md:gap-1">
          <IconButton label="Minha conta" className="hidden md:inline-flex">
            <User size={18} strokeWidth={1.5} />
          </IconButton>
          <button
            type="button"
            aria-label="Abrir sacola"
            onClick={openCart}
            className="relative inline-flex h-10 w-10 items-center justify-center text-ink transition-opacity duration-200 hover:opacity-50"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {quantity > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-medium leading-none text-paper">
                {quantity}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
