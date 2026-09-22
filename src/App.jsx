import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import SideMenu from './components/SideMenu/SideMenu'
import SearchBar from './components/SearchBar/SearchBar'
import CartDrawer from './components/CartDrawer/CartDrawer'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Shop from './pages/Shop/Shop'
import Product from './pages/Product/Product'
import Checkout from './pages/Checkout/Checkout'
import Sucesso from './pages/Sucesso/Sucesso'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <ScrollToTop />
      <Header />
      <SearchBar />
      <SideMenu />
      <CartDrawer />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/produto/:slug" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/sucesso" element={<Sucesso />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}