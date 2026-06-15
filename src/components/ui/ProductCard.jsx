import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage'
import { useShop } from '../../context/useShop'

function ProductCard({ product, variant }) {
  const { addToCart, toggleFavorite, isFavorite } = useShop()
  const { localizeProduct, formatPrice, t } = useLanguage()
  const hasDiscount = Boolean(product.oldPrice && product.oldPrice > product.price)
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0
  const isCatalogue = variant === 'catalogue'
  const viewProduct = localizeProduct(product)

  return (
    <article className={isCatalogue ? 'product-card catalogue-card' : 'product-card'}>
      <span className={hasDiscount ? 'product-badge sale' : 'product-badge'}>{hasDiscount ? `-${discountPercent}%` : t('common.statusPromo')}</span>
      <button
        className={isFavorite(product.id) ? 'favorite-btn active' : 'favorite-btn'}
        onClick={() => toggleFavorite(product.id)}
        aria-label={t('header.favoritesAria')}
      >
        ♥
      </button>

      <div className="product-emoji">
        <img src={product.image} alt={viewProduct.name} loading="lazy" />
      </div>
      {isCatalogue ? (
        <Link to={`/product/${product.id}`} className="product-title-link">
          <h3>{viewProduct.name}</h3>
        </Link>
      ) : (
        <h3>{viewProduct.name}</h3>
      )}
      <p className="product-meta">
        {viewProduct.animalType} · {viewProduct.category}
      </p>
      <p className="product-rating">{t('product.rating', { rating: product.rating })}</p>

      <div className="product-price-row">
        <strong>{formatPrice(product.price)}</strong>
        {product.oldPrice ? <span>{formatPrice(product.oldPrice)}</span> : null}
      </div>

      {isCatalogue ? (
        <div className="product-actions catalogue-actions">
          <button className="btn btn-primary" onClick={() => addToCart(product, 1)}>
            {t('cart.addToCart')}
          </button>
        </div>
      ) : (
        <div className="product-actions">
          <Link to={`/product/${product.id}`} className="btn btn-secondary">
            {t('common.details')}
          </Link>
          <button className="btn btn-primary" onClick={() => addToCart(product, 1)}>
            {t('cart.addToCart')}
          </button>
        </div>
      )}
    </article>
  )
}

export default ProductCard
