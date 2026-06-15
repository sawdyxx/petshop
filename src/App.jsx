import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { useLanguage } from './context/useLanguage'

const HomePage = lazy(() => import('./pages/HomePage'))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminOverviewPage = lazy(() => import('./pages/AdminOverviewPage'))
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'))
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'))
const AdminMessagesPage = lazy(() => import('./pages/AdminMessagesPage'))
const CatalogPage = lazy(() => import('./pages/CatalogPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const { t } = useLanguage()

  return (
    <div className="app-shell">
      {!isAdminRoute ? <Header /> : null}
      <main className={isAdminRoute ? 'main-content main-content-admin' : 'main-content'}>
        <Suspense
          fallback={
            <div className="page-content">
              <div className="empty-block large-empty-block">
                <div>
                  <h3>{t('common.loadingTitle')}</h3>
                  <p>{t('common.loadingText')}</p>
                </div>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<AdminOverviewPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
            </Route>
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
        </Suspense>
      </main>
      {!isAdminRoute ? <Footer /> : null}
    </div>
  )
}

export default App
