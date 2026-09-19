import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import ProductImage from '../../components/ProductImage/ProductImage'
import { useCart } from '../../context/CartContext'
import { formatBRL, formatBRLCompact } from '../../utils/format'

const STEPS = ['Dados pessoais', 'Endereço', 'Entrega', 'Pagamento', 'Revisão']

const SHIPPING_OPTIONS = [
  { id: 'retirada', label: 'Retirada na loja', detail: 'Grátis · 1 dia útil', price: 0 },
  { id: 'padrao', label: 'Entrega padrão', detail: '3 a 7 dias úteis', price: 19.9 },
  { id: 'expressa', label: 'Entrega expressa', detail: '1 a 3 dias úteis', price: 34.9 },
]

const PAYMENT_OPTIONS = [
  { id: 'pix', label: 'Pix', detail: '5% de desconto à vista' },
  { id: 'cartao', label: 'Cartão de crédito', detail: 'Até 6x sem juros' },
  { id: 'boleto', label: 'Boleto bancário', detail: 'Vence em 2 dias úteis' },
]

const INITIAL_FORM = {
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  entrega: 'padrao',
  pagamento: 'pix',
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
}

function Field({ label, name, value, onChange, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[10px] uppercase tracking-label text-muted">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="border-b border-line bg-transparent py-2 text-[12px] text-ink outline-none transition-colors duration-200 focus:border-ink"
        {...props}
      />
    </label>
  )
}

function OptionCard({ active, onSelect, title, detail, trailing }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between border px-4 py-4 text-left transition-colors duration-200 ${
        active ? 'border-ink' : 'border-line hover:border-ink'
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
            active ? 'border-ink bg-ink text-paper' : 'border-line'
          }`}
        >
          {active && <Check size={10} strokeWidth={3} />}
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] uppercase tracking-label text-ink">{title}</span>
          <span className="mt-1 text-[10px] text-muted">{detail}</span>
        </span>
      </span>
      {trailing && <span className="text-[11px] tabular-nums text-ink">{trailing}</span>}
    </button>
  )
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [orderCode, setOrderCode] = useState(null)

  const shipping = useMemo(
    () => SHIPPING_OPTIONS.find((option) => option.id === form.entrega) ?? SHIPPING_OPTIONS[1],
    [form.entrega],
  )

  const pixDiscountValue = form.pagamento === 'pix' ? Math.round(subtotal * 0.05 * 100) / 100 : 0
  const total = Math.max(0, subtotal + shipping.price - pixDiscountValue)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  function finalizeOrder() {
    // Integração futura: Mercado Pago / Stripe.
    // Aqui entraria a chamada ao gateway com `total`, `form` e `items`.
    setOrderCode(`NCT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
    clearCart()
  }

  if (orderCode) {
    return (
      <div className="mx-auto flex max-w-lg animate-fade-up flex-col items-center gap-6 px-6 py-32 text-center">
        <span className="text-[10px] uppercase tracking-label text-muted">Pedido confirmado</span>
        <h1 className="text-lg uppercase tracking-label text-ink">Obrigado pela compra</h1>
        <p className="text-[11px] leading-relaxed text-ink-soft">
          Seu pedido <span className="text-ink">{orderCode}</span> foi registrado. Você receberá os
          detalhes por e-mail.
        </p>
        <Link
          to="/shop"
          className="border-b border-ink pb-1 text-[10px] uppercase tracking-label transition-opacity duration-200 hover:opacity-50"
        >
          Voltar para a loja
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 px-6 py-32 text-center">
        <p className="text-[11px] uppercase tracking-label text-muted">Sua sacola está vazia</p>
        <Link
          to="/shop"
          className="border-b border-ink pb-1 text-[10px] uppercase tracking-label transition-opacity duration-200 hover:opacity-50"
        >
          Explorar a loja
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 pt-12 md:px-6">
      <header className="pb-8">
        <p className="text-[10px] uppercase tracking-label text-muted">Finalizar compra</p>
        <h1 className="mt-4 text-sm uppercase tracking-label text-ink">Checkout</h1>
      </header>

      <ol className="no-scrollbar mb-10 flex gap-6 overflow-x-auto border-y border-line py-5">
        {STEPS.map((label, index) => (
          <li key={label} className="shrink-0">
            <button
              type="button"
              onClick={() => setStep(index)}
              className="flex items-center gap-2 text-[10px] uppercase tracking-label transition-colors duration-200"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] ${
                  index <= step ? 'border-ink bg-ink text-paper' : 'border-line text-muted'
                }`}
              >
                {index + 1}
              </span>
              <span className={index === step ? 'text-ink' : 'text-muted'}>{label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-16 lg:grid-cols-[1fr_340px]">
        <div className="min-h-[320px] animate-fade-in">
          {step === 0 && (
            <div className="grid gap-7 sm:grid-cols-2">
              <Field
                label="Nome completo"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Seu nome"
                className="sm:col-span-2"
              />
              <Field
                label="E-mail"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="voce@email.com"
              />
              <Field
                label="CPF"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />
              <Field
                label="Telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="sm:col-span-2"
              />
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-7 sm:grid-cols-2">
              <Field
                label="CEP"
                name="cep"
                value={form.cep}
                onChange={handleChange}
                placeholder="00000-000"
              />
              <Field
                label="Rua"
                name="rua"
                value={form.rua}
                onChange={handleChange}
                placeholder="Rua / Avenida"
                className="sm:col-span-2"
              />
              <Field
                label="Número"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="000"
              />
              <Field
                label="Complemento"
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                placeholder="Apto, bloco..."
              />
              <Field
                label="Bairro"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
              />
              <Field label="Cidade" name="cidade" value={form.cidade} onChange={handleChange} />
              <Field label="UF" name="uf" value={form.uf} onChange={handleChange} placeholder="SP" />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3">
              {SHIPPING_OPTIONS.map((option) => (
                <OptionCard
                  key={option.id}
                  active={form.entrega === option.id}
                  onSelect={() => setForm((previous) => ({ ...previous, entrega: option.id }))}
                  title={option.label}
                  detail={option.detail}
                  trailing={option.price === 0 ? 'Grátis' : formatBRL(option.price)}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              {PAYMENT_OPTIONS.map((option) => (
                <OptionCard
                  key={option.id}
                  active={form.pagamento === option.id}
                  onSelect={() => setForm((previous) => ({ ...previous, pagamento: option.id }))}
                  title={option.label}
                  detail={option.detail}
                />
              ))}

              {form.pagamento === 'cartao' && (
                <div className="mt-4 grid gap-7 border border-line p-5 sm:grid-cols-2">
                  <Field
                    label="Nome no cartão"
                    name="cardName"
                    value={form.cardName}
                    onChange={handleChange}
                    className="sm:col-span-2"
                  />
                  <Field
                    label="Número do cartão"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="0000 0000 0000 0000"
                    className="sm:col-span-2"
                  />
                  <Field
                    label="Validade"
                    name="cardExpiry"
                    value={form.cardExpiry}
                    onChange={handleChange}
                    placeholder="MM/AA"
                  />
                  <Field
                    label="CVV"
                    name="cardCvv"
                    value={form.cardCvv}
                    onChange={handleChange}
                    placeholder="000"
                  />
                </div>
              )}

              {form.pagamento === 'pix' && (
                <p className="mt-2 text-[10px] uppercase tracking-label text-muted">
                  O QR Code será gerado na próxima etapa.
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-8">
              <section className="border border-line p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-label text-muted">
                    Dados pessoais
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-[10px] uppercase tracking-label text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Editar
                  </button>
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-ink-soft">
                  {form.nome || '—'} · {form.email || '—'} · {form.cpf || '—'} ·{' '}
                  {form.telefone || '—'}
                </p>
              </section>

              <section className="border border-line p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-label text-muted">Endereço</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] uppercase tracking-label text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Editar
                  </button>
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-ink-soft">
                  {form.rua || '—'}, {form.numero || '—'}
                  {form.complemento ? `, ${form.complemento}` : ''} · {form.bairro || '—'} ·{' '}
                  {form.cidade || '—'}/{form.uf || '—'} · CEP {form.cep || '—'}
                </p>
              </section>

              <section className="border border-line p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-label text-muted">Entrega</span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[10px] uppercase tracking-label text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Editar
                  </button>
                </div>
                <p className="mt-4 text-[11px] text-ink-soft">
                  {shipping.label} — {shipping.detail} ·{' '}
                  {shipping.price === 0 ? 'Grátis' : formatBRL(shipping.price)}
                </p>
              </section>

              <section className="border border-line p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-label text-muted">Pagamento</span>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-[10px] uppercase tracking-label text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Editar
                  </button>
                </div>
                <p className="mt-4 text-[11px] text-ink-soft">
                  {PAYMENT_OPTIONS.find((option) => option.id === form.pagamento)?.label}
                </p>
              </section>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="text-[10px] uppercase tracking-label text-muted transition-colors duration-200 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
            >
              Voltar
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(STEPS.length - 1, current + 1))}
                className="bg-ink px-8 py-3 text-[10px] uppercase tracking-label text-paper transition-opacity duration-300 hover:opacity-80"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={finalizeOrder}
                className="bg-ink px-8 py-3 text-[10px] uppercase tracking-label text-paper transition-opacity duration-300 hover:opacity-80"
              >
                Finalizar pedido
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit border border-line p-5 lg:sticky lg:top-[110px]">
          <span className="text-[10px] uppercase tracking-label text-muted">Resumo do pedido</span>

          <ul className="mt-5 flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.lineId} className="flex gap-3">
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-12 shrink-0 bg-mist object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[11px] uppercase tracking-label text-ink">
                    {item.name}
                  </span>
                  <span className="mt-1 text-[10px] text-muted">
                    {[item.size, item.color].filter(Boolean).join(' · ')}
                  </span>
                  <span className="mt-1 text-[10px] text-muted">Qtd. {item.quantity}</span>
                </div>
                <span className="text-[11px] tabular-nums text-ink">{formatBRL(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-[11px]">
            <div className="flex justify-between text-muted">
              <span className="uppercase tracking-label">Subtotal</span>
              <span className="tabular-nums text-ink">{formatBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span className="uppercase tracking-label">Frete</span>
              <span className="tabular-nums text-ink">
                {shipping.price === 0 ? 'Grátis' : formatBRL(shipping.price)}
              </span>
            </div>
            {pixDiscountValue > 0 && (
              <div className="flex justify-between text-muted">
                <span className="uppercase tracking-label">Desconto Pix</span>
                <span className="tabular-nums text-ink">- {formatBRL(pixDiscountValue)}</span>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
            <span className="text-[10px] uppercase tracking-label text-muted">Total</span>
            <span className="text-sm tabular-nums text-ink">{formatBRL(total)}</span>
          </div>

          <p className="mt-4 text-[10px] leading-relaxed text-muted">
            À vista no Pix: {formatBRLCompact(total)}. Pagamento processado por gateway externo.
          </p>
        </aside>
      </div>
    </div>
  )
}
