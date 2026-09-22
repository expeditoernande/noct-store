import { useState } from 'react'
import { Link } from 'react-router-dom'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Todas as peças', to: '/shop' },
      { label: 'Novidades', to: '/shop?sort=recentes' },
      { label: 'Camisetas', to: '/shop?categoria=Camisetas' },
      { label: 'Calças', to: '/shop?categoria=Cal%C3%A7as' },
      { label: 'Acessórios', to: '/shop?categoria=Acess%C3%B3rios' },
    ],
  },
  {
    title: 'Ajuda',
    links: [{ label: 'Contato', to: '#contato' }],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer id="contato" className="mt-24 border-t border-line">
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 px-4 py-16 md:grid-cols-4 md:px-6">
        {COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-5">
            <span className="text-[10px] uppercase tracking-label text-muted">{column.title}</span>
            <ul className="flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.to.startsWith('#') ? (
                    <a
                      href={link.to}
                      className="text-[11px] text-ink-soft transition-colors duration-200 hover:text-ink"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-[11px] text-ink-soft transition-colors duration-200 hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-5 md:col-span-2 lg:col-span-1">
          <span className="text-[10px] uppercase tracking-label text-muted">Receba novidades</span>
          <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-line pb-2">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Seu e-mail"
              aria-label="Seu e-mail"
              className="w-full bg-transparent text-[11px] text-ink outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              className="shrink-0 text-[10px] uppercase tracking-label text-ink transition-opacity duration-200 hover:opacity-50"
            >
              OK
            </button>
          </form>
          {subscribed && (
            <span className="text-[10px] uppercase tracking-label text-muted">
              Inscrição confirmada.
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-8 text-[10px] uppercase tracking-label text-muted md:flex-row md:px-6">
        <span>© 2026 NØCT — Todos os direitos reservados.</span>
        <span>Feito para quem não segue o padrão.</span>
      </div>
    </footer>
  )
}
