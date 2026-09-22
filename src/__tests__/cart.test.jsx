import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '../context/CartContext'
import { ProductProvider } from '../context/ProductContext'
import { products } from '../data/products'

vi.mock('../services/api', () => ({
  fetchProducts: () => new Promise(() => {}),
}))

const VOID = products[0]

function wrapper({ children }) {
  return (
    <ProductProvider>
      <CartProvider>{children}</CartProvider>
    </ProductProvider>
  )
}

describe('operações do carrinho', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('começa vazio', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.items).toEqual([])
    expect(result.current.subtotal).toBe(0)
    expect(result.current.quantity).toBe(0)
  })

  it('adiciona um produto ao carrinho', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(VOID, { size: 'M', color: 'Preto' }))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].name).toBe('VOID')
    expect(result.current.items[0].quantity).toBe(1)
    expect(result.current.items[0].lineTotal).toBe(VOID.price)
  })

  it('acumula quantidade na mesma variante', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(VOID, { size: 'M', color: 'Preto' }))
    act(() => result.current.addItem(VOID, { size: 'M', color: 'Preto' }))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.quantity).toBe(2)
    expect(result.current.subtotal).toBeCloseTo(VOID.price * 2)
  })

  it('variantes diferentes viram linhas separadas', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(VOID, { size: 'M', color: 'Preto' }))
    act(() => result.current.addItem(VOID, { size: 'G', color: 'Preto' }))
    expect(result.current.items).toHaveLength(2)
    expect(result.current.quantity).toBe(2)
  })

  it('atualiza quantidade e limpa a linha em zero', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(VOID, { size: 'M', color: 'Preto' }))
    const lineId = result.current.items[0].lineId

    act(() => result.current.updateQuantity(lineId, 3))
    expect(result.current.items[0].quantity).toBe(3)

    act(() => result.current.updateQuantity(lineId, 0))
    expect(result.current.items).toHaveLength(0)
  })

  it('remove um item pelo lineId', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(VOID, { size: 'M', color: 'Preto' }))
    const lineId = result.current.items[0].lineId
    act(() => result.current.removeItem(lineId))
    expect(result.current.items).toHaveLength(0)
  })

  it('limpa o carrinho inteiro', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(VOID, { size: 'M', color: 'Preto' }))
    act(() => result.current.addItem(VOID, { size: 'G', color: 'Preto' }))
    act(() => result.current.clearCart())
    expect(result.current.items).toEqual([])
    expect(result.current.subtotal).toBe(0)
  })

  it('persiste o carrinho no localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.addItem(VOID, { size: 'M', color: 'Preto' }))

    const stored = JSON.parse(window.localStorage.getItem('noct-cart'))
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('VOID')
  })

  it('restaura o carrinho de uma sessão anterior', () => {
    const first = renderHook(() => useCart(), { wrapper })
    act(() => first.result.current.addItem(VOID, { size: 'M', color: 'Preto' }))
    first.unmount()

    const second = renderHook(() => useCart(), { wrapper })
    expect(second.result.current.items).toHaveLength(1)
    expect(second.result.current.quantity).toBe(1)
  })
})