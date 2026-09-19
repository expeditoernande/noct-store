import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const openMenu = useCallback(() => {
    setSearchOpen(false)
    setCartOpen(false)
    setMenuOpen(true)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const openSearch = useCallback(() => {
    setMenuOpen(false)
    setCartOpen(false)
    setSearchOpen(true)
  }, [])

  const closeSearch = useCallback(() => setSearchOpen(false), [])

  const openCart = useCallback(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setCartOpen(true)
  }, [])

  const closeCart = useCallback(() => setCartOpen(false), [])

  useEffect(() => {
    const shouldLock = menuOpen || cartOpen
    const previous = document.body.style.overflow
    document.body.style.overflow = shouldLock ? 'hidden' : ''
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen, cartOpen])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      setSearchOpen(false)
      setCartOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(
    () => ({
      menuOpen,
      openMenu,
      closeMenu,
      searchOpen,
      openSearch,
      closeSearch,
      cartOpen,
      openCart,
      closeCart,
    }),
    [menuOpen, openMenu, closeMenu, searchOpen, openSearch, closeSearch, cartOpen, openCart, closeCart],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI deve ser usado dentro de <UIProvider>')
  }
  return context
}
