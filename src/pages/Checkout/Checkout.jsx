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
}

function Field({ label, name, value, onChange, error, className = '', ...props }) {
  const errorId = `${name}-error`

  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[10px] uppercase tracking-label text-muted">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`border-b bg-transparent py-2 text-[12px] text-ink outline-none transition-colors duration-200 focus:border-ink ${
          error ? 'border-red-700' : 'border-line'
        }`}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-[10px] text-red-700">
          {error}
        </span>
      )}
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
  const { items, subtotal } = useCart()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [orderCode, setOrderCode] = useState(null)
  const [errors, setErrors] = useState({})

  const shipping = useMemo(
    () => SHIPPING_OPTIONS.find((option) => option.id === form.entrega) ?? SHIPPING_OPTIONS[1],
    [form.entrega],
  )

  const pixDiscountValue = form.pagamento === 'pix' ? Math.round(subtotal * 0.05 * 100) / 100 : 0
  const total = Math.max(0, subtotal + shipping.price - pixDiscountValue)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => {
      if (!previous[name]) return previous
      const { [name]: _, ...remaining } = previous
      return remaining
    })
  }

  function validateStep(targetStep) {
    const nextErrors = {}
    const digits = (value) => value.replace(/\D/g, '')

    if (targetStep === 0) {
      if (!form.nome.trim()) nextErrors.nome = 'Informe seu nome completo.'
      if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Informe um e-mail válido.'
      if (digits(form.cpf).length !== 11) nextErrors.cpf = 'Informe um CPF com 11 dígitos.'
      if (digits(form.telefone).length < 10) nextErrors.telefone = 'Informe um telefone válido.'
    }

    if (targetStep === 1) {
      if (digits(form.cep).length !== 8) nextErrors.cep = 'Informe um CEP com 8 dígitos.'
      if (!form.rua.trim()) nextErrors.rua = 'Informe a rua ou avenida.'
      if (!form.numero.trim()) nextErrors.numero = 'Informe o número.'
      if (!form.bairro.trim()) nextErrors.bairro = 'Informe o bairro.'
      if (!form.cidade.trim()) nextErrors.cidade = 'Informe a cidade.'
      if (!/^[a-zA-Z]{2}$/.test(form.uf.trim())) nextErrors.uf = 'Informe a UF com 2 letras.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function continueCheckout() {
    if (!validateStep(step)) return
    setStep((current) => Math.min(STEPS.length - 1, current + 1))
  }

  function finalizeOrder() {
    setOrderCode('SIMULAÇÃO')
  }

  if (orderCode) {
    return (
      <div className="mx-auto flex max-w-lg animate-fade-up flex-col items-center gap-6 px-6 py-32 text-center">
        <span className="text-[10px] uppercase tracking-label text-muted">Simulação concluída</span>
        <h1 className="text-lg uppercase tracking-label text-ink">Nenhum pedido foi criado</h1>
        <p className="text-[11px] leading-relaxed text-ink-soft">
          Esta é uma demonstração do fluxo de checkout. Nenhum pagamento, pedido ou e-mail foi
          gerado, e sua sacola foi mantida.
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
        <p className="text-[10px] uppercase tracking-label text-muted">Demonstração de checkout</p>
        <h1 className="mt-4 text-sm uppercase tracking-label text-ink">Checkout</h1>
      </header>

      <ol className="no-scrollbar mb-10 flex gap-6 overflow-x-auto border-y border-line py-5">
        {STEPS.map((label, index) => (
          <li key={label} className="shrink-0">
            <button
              type="button"
              onClick={() => index <= step && setStep(index)}
              disabled={index > step}
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
                error={errors.nome}
                placeholder="Seu nome"
                className="sm:col-span-2"
              />
              <Field
                label="E-mail"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="voce@email.com"
              />
              <Field
                label="CPF"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                error={errors.cpf}
                placeholder="000.000.000-00"
              />
              <Field
                label="Telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                error={errors.telefone}
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
                error={errors.cep}
                placeholder="00000-000"
              />
              <Field
                label="Rua"
                name="rua"
                value={form.rua}
                onChange={handleChange}
                error={errors.rua}
                placeholder="Rua / Avenida"
                className="sm:col-span-2"
              />
              <Field
                label="Número"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                error={errors.numero}
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
                error={errors.bairro}
              />
              <Field
                label="Cidade"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                error={errors.cidade}
              />
              <Field
                label="UF"
                name="uf"
                value={form.uf}
                onChange={handleChange}
                error={errors.uf}
                placeholder="SP"
              />
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

              <p className="mt-2 text-[10px] uppercase tracking-label text-muted">
                Dados de pagamento não são coletados nesta demonstração. Em produção, use o ambiente
                hospedado ou tokenizado do provedor de pagamento.
              </p>
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
                onClick={continueCheckout}
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
                Concluir simulação
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
            {form.pagamento === 'pix' && `À vista no Pix: ${formatBRLCompact(total)}. `}
            Valores demonstrativos: o pagamento ainda não está integrado.
          </p>
        </aside>
      </div>
    </div>
  )
}
