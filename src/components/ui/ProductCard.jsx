import { Link } from 'react-router-dom'
import { useShop } from '../../context/useShop'

function ProductCard({ product }) {
  const { addToCart, toggleFavorite, isFavorite } = useShop()

  return (
    <article className="product-card">
      <button
        className={isFavorite(product.id) ? 'favorite-btn active' : 'favorite-btn'}
        onClick={() => toggleFavorite(product.id)}
        aria-label="Добавить в избранное"
      >
        ♥
      </button>

      <div className="product-emoji">{product.image}</div>
      <h3>{product.name}</h3>
      <p className="product-meta">
        {product.animalType} · {product.category}
      </p>
      <p className="product-rating">Рейтинг: {product.rating}</p>

      <div className="product-price-row">
        <strong>{product.price} ₽</strong>
        {product.oldPrice ? <span>{product.oldPrice} ₽</span> : null}
      </div>

      <div className="product-actions">
        <Link to={`/product/${product.id}`} className="btn btn-secondary">
          Подробнее
        </Link>
        <button className="btn btn-primary" onClick={() => addToCart(product, 1)}>
          В корзину
        </button>
      </div>
    </article>
  )
}

export default ProductCard
