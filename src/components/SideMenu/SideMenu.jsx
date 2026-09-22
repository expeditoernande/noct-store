import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useUI } from '../../context/UIContext'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?sort=recentes' },
  { label: 'Roupas', to: '/shop' },
  { label: 'Camisetas', to: '/shop?categoria=Camisetas' },
  { label: 'Calças', to: '/shop?categoria=Cal%C3%A7as' },
  { label: 'Acessórios', to: '/shop?categoria=Acess%C3%B3rios' },
  { label: 'Contato', to: '#contato' },
]

export default function SideMenu() {
  const { menuOpen, closeMenu, openSearch } = useUI()

  return (
    <div
      className={`fixed inset-0 z-50 ${menuOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!menuOpen}
      inert={!menuOpen}
    >
      <button
        type="button"
        aria-label="Fechar menu"
        tabIndex={-1}
        onClick={closeMenu}
        className={`absolute inset-0 h-full w-full bg-black/40 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        className={`absolute inset-y-0 left-0 flex w-[320px] max-w-[85vw] flex-col bg-paper transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
      >
        <div className="flex h-[70px] items-center justify-between border-b border-line px-5">
          <span className="text-[10px] uppercase tracking-label text-muted">Menu</span>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={closeMenu}
            className="inline-flex h-10 w-10 items-center justify-center transition-opacity duration-200 hover:opacity-50"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-8">
          <ul className="flex flex-col gap-5">
            {LINKS.map((link) =>
              link.to.startsWith('#') ? (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={closeMenu}
                    className="text-xs uppercase tracking-label text-ink transition-opacity duration-200 hover:opacity-50"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={closeMenu}
                    className="text-xs uppercase tracking-label text-ink transition-opacity duration-200 hover:opacity-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="border-t border-line px-5 py-6 md:hidden">
          <button
            type="button"
            onClick={() => {
              closeMenu()
              openSearch()
            }}
            className="inline-flex items-center gap-3 text-xs uppercase tracking-label text-ink transition-opacity duration-200 hover:opacity-50"
          >
            <Search size={16} strokeWidth={1.5} />
            Pesquisar
          </button>
        </div>
      </aside>
    </div>
  )
}
