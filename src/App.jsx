import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FavoritesPage from './pages/FavoritesPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const location = useLocation()
  const productPath = location.pathname.startsWith('/product/')
    ? location.pathname.replace('/product/', '')
    : ''
  const isCatalogueProductPage = productPath !== '' && Number.isNaN(Number(productPath))
  const isEmbeddedPage =
    location.pathname === '/' || location.pathname === '/catalogue' || isCatalogueProductPage

  return (
    <div className="app-shell">
      {!isEmbeddedPage ? <Header /> : null}
      <main className={isEmbeddedPage ? 'main-content main-content-home' : 'main-content'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalogue" element={<CatalogPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isEmbeddedPage ? <Footer /> : null}
    </div>
  )
}

export default App
