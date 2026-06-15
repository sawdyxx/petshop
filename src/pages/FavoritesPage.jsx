import { Link } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import { useLanguage } from '../context/useLanguage'
import { useShop } from '../context/useShop'

function FavoritesPage() {
  const { favoriteIds, products, isProductsLoading } = useShop()
  const { t } = useLanguage()
  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id))

  return (
    <div className="page-content favorites-page">
      <section className="favorites-hero">
        <div className="favorites-hero-top">
          <span className="favorites-hero-badge">{t('favorites.badge')}</span>
          <svg className="favorites-hero-mark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 56 14.6 40.6C8.2 34.9 6 30.7 6 25.5 6 16.8 12.8 10 21.5 10c4.9 0 9.6 2.3 12.5 5.9C36.9 12.3 41.6 10 46.5 10 55.2 10 62 16.8 62 25.5c0 5.2-2.2 9.4-8.6 15.1L36 56h-4Z" fill="#fc8200" />
          </svg>
        </div>
        <h1>{t('favorites.title')}</h1>
        <p>{t('favorites.text')}</p>
      </section>

      <section className="favorites-stats">
        <article className="favorites-stat-card">
          <svg className="favorites-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21c-4.6-2.6-8-6-8-10.2C4 7 7 4 10.5 4c1.7 0 3.3.8 4.5 2.1C16.2 4.8 17.8 4 19.5 4 23 4 26 7 26 10.8 26 15 22.6 18.4 18 21l-3-1.7L12 21Z" fill="#904800" transform="translate(-3)" />
          </svg>
          <strong>{favoriteProducts.length}</strong>
          <span>{t('favorites.savedCount')}</span>
        </article>
        <article className="favorites-stat-card">
          <svg className="favorites-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5h16v14H4V5Zm2 2v8h12V7H6Z" fill="#904800" />
          </svg>
          <strong>{products.length}</strong>
          <span>{t('favorites.catalogCount')}</span>
        </article>
        <article className="favorites-stat-card">
          <svg className="favorites-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 5v5l4 2-1 2-5-3V7h2Z" fill="#904800" />
          </svg>
          <strong>{t('favorites.oneClickTitle')}</strong>
          <span>{t('favorites.oneClickText')}</span>
        </article>
      </section>

      {isProductsLoading ? (
        <div className="favorites-empty">
          <div>
            <h3>{t('favorites.loadingTitle')}</h3>
            <p>{t('favorites.loadingText')}</p>
          </div>
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="favorites-empty">
          <div className="favorites-empty-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21c-4.6-2.6-8-6-8-10.2C4 7 7 4 10.5 4c1.7 0 3.3.8 4.5 2.1C16.2 4.8 17.8 4 19.5 4 23 4 26 7 26 10.8 26 15 22.6 18.4 18 21l-3-1.7L12 21Z" fill="#fc8200" transform="translate(-3)" />
            </svg>
          </div>
          <div>
            <h3>{t('favorites.emptyTitle')}</h3>
            <p>{t('favorites.emptyText')}</p>
          </div>
          <div className="inline-actions">
            <Link to="/catalogue" className="btn btn-primary">
              {t('favorites.toCatalog')}
            </Link>
          </div>
        </div>
      ) : (
        <section className="favorites-products">
          <div className="favorites-products-head">
            <h2>{t('favorites.savedProducts')}</h2>
            <Link to="/catalogue" className="btn btn-secondary">
              {t('favorites.addMore')}
            </Link>
          </div>
          <div className="products-grid">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default FavoritesPage
