import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import SectionTitle from '../components/ui/SectionTitle'
import { useShop } from '../context/useShop'
import { products } from '../data/products'

function ProductPage() {
  const { productId } = useParams()
  const { addToCart } = useShop()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((item) => item.id === Number(productId))

  const similarProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter((item) => item.id !== product.id && item.animalType === product.animalType)
      .slice(0, 3)
  }, [product])

  if (!product) {
    return (
      <div className="page-content">
        <p className="empty-block">Товар не найден.</p>
        <Link to="/catalogue" className="btn btn-primary">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const galleryItems = [product.image, product.image, product.image, product.image]

  return (
    <div className="page-content">
      <nav className="product-breadcrumbs">
        <Link to="/">Главная</Link>
        <span>·</span>
        <Link to="/catalogue">Каталог</Link>
        <span>·</span>
        <strong>{product.name}</strong>
      </nav>

      <section className="product-showcase">
        <div className="product-gallery">
          <div className="product-gallery-main">
            <span className="product-gallery-badge">Хит продаж</span>
            <img className="product-gallery-image" src={product.image} alt={product.name} />
          </div>
          <div className="product-gallery-thumbs">
            {galleryItems.map((item, index) => (
              <button key={`${item}-${index}`} className={index === 0 ? 'product-thumb active' : 'product-thumb'}>
                <img src={item} alt={`${product.name} ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-showcase-info">
          <span className="hero-badge">Товар #{product.id}</span>
          <p className="product-details-meta">
            {product.animalType} · {product.category}
          </p>
          <h1>{product.name}</h1>
          <p className="product-details-rating">Рейтинг: {product.rating}</p>
          <p className="product-details-price">{product.price} сом</p>
          <p className="product-details-description">{product.description}</p>

          <div className="variant-block">
            <h4>Вкус</h4>
            <div className="chip-row">
              <button className="chip active">Классический</button>
              <button className="chip">С курицей</button>
              <button className="chip">С овощами</button>
            </div>
          </div>

          <div className="variant-block">
            <h4>Упаковка</h4>
            <div className="chip-row">
              <button className="chip">Малая</button>
              <button className="chip active">Стандартная</button>
              <button className="chip">Большая</button>
            </div>
          </div>

          <div className="quantity-control">
            <span>Количество:</span>
            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
            <strong>{quantity}</strong>
            <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
          </div>

          <div className="inline-actions">
            <button className="btn btn-primary product-cta-btn" onClick={() => addToCart(product, quantity)}>
              Добавить в корзину
            </button>
            <Link to="/catalogue" className="btn btn-secondary product-back-btn">
              Вернуться в каталог
            </Link>
          </div>

          <div className="product-accordion">
            <details open>
              <summary>Состав</summary>
              <p>{product.specs.slice(0, 2).join(', ')}</p>
            </details>
            <details>
              <summary>Рекомендации</summary>
              <p>Подбирайте размер порции по весу питомца и всегда оставляйте свежую воду.</p>
            </details>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Характеристики" />
        <ul className="specs-list">
          {product.specs.map((spec) => (
            <li key={spec}>{spec}</li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle title="Похожие товары" />
        <div className="products-grid">
          {similarProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductPage
