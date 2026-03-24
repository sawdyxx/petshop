import { Link } from 'react-router-dom'
import { useShop } from '../../context/useShop'

function ProductCard({ product, variant }) {
  const { addToCart, toggleFavorite, isFavorite } = useShop()
  const hasDiscount = Boolean(product.oldPrice && product.oldPrice > product.price)
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0
  const isCatalogue = variant === 'catalogue'

  return (
    <article className={isCatalogue ? 'product-card catalogue-card' : 'product-card'}>
      <span className={hasDiscount ? 'product-badge sale' : 'product-badge'}>
        {hasDiscount ? `-${discountPercent}%` : 'Хит'}
      </span>
      <button
        className={isFavorite(product.id) ? 'favorite-btn active' : 'favorite-btn'}
        onClick={() => toggleFavorite(product.id)}
        aria-label="Добавить в избранное"
      >
        ♥
      </button>

      <div className="product-emoji">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      {isCatalogue ? (
        <Link to={`/product/${product.id}`} className="product-title-link">
          <h3>{product.name}</h3>
        </Link>
      ) : (
        <h3>{product.name}</h3>
      )}
      <p className="product-meta">
        {product.animalType} · {product.category}
      </p>
      <p className="product-rating">Рейтинг: {product.rating}</p>

      <div className="product-price-row">
        <strong>{product.price} сом</strong>
        {product.oldPrice ? <span>{product.oldPrice} сом</span> : null}
      </div>

      {isCatalogue ? (
        <div className="product-actions catalogue-actions">
          <button className="btn btn-primary" onClick={() => addToCart(product, 1)}>
            В корзину
          </button>
        </div>
      ) : (
        <div className="product-actions">
          <Link to={`/product/${product.id}`} className="btn btn-secondary">
            Подробнее
          </Link>
          <button className="btn btn-primary" onClick={() => addToCart(product, 1)}>
            В корзину
          </button>
        </div>
      )}
    </article>
  )
}

export default ProductCard
