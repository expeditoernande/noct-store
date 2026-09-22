import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { apiBaseUrl, confirmCheckoutPro } from '../../services/api'
import { formatBRL } from '../../utils/format'

const INITIAL = { state: 'loading' }
const LOCAL_DEV_HANDOFF_URL = 'http://localhost:5173/checkout/sucesso'

export default function Sucesso() {
  const [searchParams] = useSearchParams()
  const [result, setResult] = useState(INITIAL)
  const { clearCart, quantity } = useCart()

  useEffect(() => {
    if (!apiBaseUrl()) {
      window.location.replace(`${LOCAL_DEV_HANDOFF_URL}${window.location.search}`)
      return
    }

    const token = searchParams.get('token')
    const paymentId = searchParams.get('payment_id')

    if (!token || !paymentId) {
      setResult({ state: 'indefinido' })
      return
    }

    let active = true

    confirmCheckoutPro(token, paymentId)
      .then((data) => {
        if (!active) return
        if (data.order) {
          clearCart()
          setResult({ state: 'aprovado', ...data.order })
        } else if (data.status) {
          setResult({ state: data.status.includes('pendente') ? 'pendente' : 'recusado' })
        } else {
          setResult({ state: 'indefinido' })
        }
      })
      .catch(() => {
        if (active) setResult({ state: 'indefinido' })
      })

    return () => {
      active = false
    }
  }, [searchParams, clearCart])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg animate-fade-up flex-col items-center gap-6 px-6 py-24 text-center">
      {result.state === 'loading' && (
        <>
          <span className="text-[10px] uppercase tracking-label text-muted">
            Confirmando pagamento
          </span>
          <h1 className="text-lg uppercase tracking-label text-ink">Aguarde um instante</h1>
          <p className="text-[11px] leading-relaxed text-ink-soft">
            Estamos verificando sua compra com o Mercado Pago.
          </p>
        </>
      )}

      {result.state === 'aprovado' && (
        <>
          <span className="text-[10px] uppercase tracking-label text-muted">Pagamento aprovado</span>
          <h1 className="text-lg uppercase tracking-label text-ink">Pedido {result.numero}</h1>
          <p className="text-[11px] leading-relaxed text-ink-soft">
            Seu pedido foi confirmado em <span className="text-ink">{formatBRL(result.total)}</span>.
            A sacola foi esvaziada — agora os itens viraram um pedido real.
          </p>
          <p className="text-[10px] uppercase tracking-label text-muted">
            {quantity === 0
              ? 'Sacola limpa após a confirmação do pagamento.'
              : 'Obrigado pela compra.'}
          </p>
          <Link
            to="/shop"
            className="border-b border-ink pb-1 text-[10px] uppercase tracking-label transition-opacity duration-200 hover:opacity-50"
          >
            Voltar para a loja
          </Link>
        </>
      )}

      {result.state === 'pendente' && (
        <>
          <span className="text-[10px] uppercase tracking-label text-muted">Pagamento pendente</span>
          <h1 className="text-lg uppercase tracking-label text-ink">Aguardando confirmação</h1>
          <p className="text-[11px] leading-relaxed text-ink-soft">
            O pagamento ainda não foi aprovado. Sua sacola foi mantida — o pedido só é criado
            quando o pagamento é confirmado.
          </p>
          <Link
            to="/shop"
            className="border-b border-ink pb-1 text-[10px] uppercase tracking-label transition-opacity duration-200 hover:opacity-50"
          >
            Voltar para a loja
          </Link>
        </>
      )}

      {(result.state === 'recusado' || result.state === 'indefinido') && (
        <>
          <span className="text-[10px] uppercase tracking-label text-muted">
            {result.state === 'recusado' ? 'Pagamento não aprovado' : 'Pagamento não confirmado'}
          </span>
          <h1 className="text-lg uppercase tracking-label text-ink">
            {result.state === 'recusado' ? 'Sua compra não foi concluída' : 'Confirmação pendente'}
          </h1>
          <p className="text-[11px] leading-relaxed text-ink-soft">
            Nenhum pedido foi criado e sua sacola foi mantida. Tente novamente com outro cartão ou
            entre em contato pelo rodapé da loja.
          </p>
          <Link
            to="/shop"
            className="border-b border-ink pb-1 text-[10px] uppercase tracking-label transition-opacity duration-200 hover:opacity-50"
          >
            Voltar para a loja
          </Link>
        </>
      )}
    </div>
  )
}