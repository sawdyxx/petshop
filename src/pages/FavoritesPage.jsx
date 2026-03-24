import { Link } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import { useShop } from '../context/useShop'
import { products } from '../data/products'

function FavoritesPage() {
  const { favoriteIds } = useShop()
  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id))

  return (
    <div className="page-content favorites-page">
      <section className="favorites-hero">
        <div className="favorites-hero-top">
          <span className="favorites-hero-badge">Избранное</span>
          <svg className="favorites-hero-mark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 56 14.6 40.6C8.2 34.9 6 30.7 6 25.5 6 16.8 12.8 10 21.5 10c4.9 0 9.6 2.3 12.5 5.9C36.9 12.3 41.6 10 46.5 10 55.2 10 62 16.8 62 25.5c0 5.2-2.2 9.4-8.6 15.1L36 56h-4Z" fill="#fc8200" />
          </svg>
        </div>
        <h1>
          Сохраняйте любимые товары в <span>одном месте</span>
        </h1>
        <p>
          Добавляйте позиции в избранное, сравнивайте варианты и возвращайтесь к ним в любой момент перед покупкой.
        </p>
      </section>

      <section className="favorites-stats">
        <article className="favorites-stat-card">
          <svg className="favorites-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21c-4.6-2.6-8-6-8-10.2C4 7 7 4 10.5 4c1.7 0 3.3.8 4.5 2.1C16.2 4.8 17.8 4 19.5 4 23 4 26 7 26 10.8 26 15 22.6 18.4 18 21l-3-1.7L12 21Z" fill="#904800" transform="translate(-3)" />
          </svg>
          <strong>{favoriteProducts.length}</strong>
          <span>товаров сохранено</span>
        </article>
        <article className="favorites-stat-card">
          <svg className="favorites-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5h16v14H4V5Zm2 2v8h12V7H6Z" fill="#904800" />
          </svg>
          <strong>{products.length}</strong>
          <span>товаров в каталоге</span>
        </article>
        <article className="favorites-stat-card">
          <svg className="favorites-stat-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 5v5l4 2-1 2-5-3V7h2Z" fill="#904800" />
          </svg>
          <strong>1 клик</strong>
          <span>до добавления в корзину</span>
        </article>
      </section>

      {favoriteProducts.length === 0 ? (
        <div className="favorites-empty">
          <div className="favorites-empty-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21c-4.6-2.6-8-6-8-10.2C4 7 7 4 10.5 4c1.7 0 3.3.8 4.5 2.1C16.2 4.8 17.8 4 19.5 4 23 4 26 7 26 10.8 26 15 22.6 18.4 18 21l-3-1.7L12 21Z" fill="#fc8200" transform="translate(-3)" />
            </svg>
          </div>
          <div>
            <h3>В избранном пока нет товаров</h3>
            <p>Сохраняйте понравившиеся позиции, чтобы быстро вернуться к ним позже.</p>
          </div>
          <div className="inline-actions">
            <Link to="/catalogue" className="btn btn-primary">
              Перейти в каталог
            </Link>
          </div>
        </div>
      ) : (
        <section className="favorites-products">
          <div className="favorites-products-head">
            <h2>Ваши сохранённые товары</h2>
            <Link to="/catalogue" className="btn btn-secondary">
              Добавить ещё
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
