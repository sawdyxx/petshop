import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import SectionTitle from '../components/ui/SectionTitle'
import { useLanguage } from '../context/useLanguage'
import { useShop } from '../context/useShop'

function ProductPage() {
  const { productId } = useParams()
  const { addToCart, products, isProductsLoading } = useShop()
  const { formatPrice, localizeProduct, t } = useLanguage()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((item) => item.id === Number(productId))
  const viewProduct = localizeProduct(product)

  const similarProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter((item) => item.id !== product.id && item.animalType === product.animalType)
      .slice(0, 3)
  }, [product, products])

  if (isProductsLoading) {
    return (
      <div className="page-content">
        <div className="empty-block large-empty-block">
          <div>
            <h3>{t('product.loadingTitle')}</h3>
            <p>{t('product.loadingText')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page-content">
        <p className="empty-block">{t('product.notFound')}</p>
        <Link to="/catalogue" className="btn btn-primary">
          {t('product.backToCatalog')}
        </Link>
      </div>
    )
  }

  const galleryItems = [product.image, product.image, product.image, product.image]

  return (
    <div className="page-content">
      <nav className="product-breadcrumbs">
        <Link to="/">{t('product.homeCrumb')}</Link>
        <span>·</span>
        <Link to="/catalogue">{t('product.catalogCrumb')}</Link>
        <span>·</span>
        <strong>{viewProduct.name}</strong>
      </nav>

      <section className="product-showcase">
        <div className="product-gallery">
          <div className="product-gallery-main">
            <span className="product-gallery-badge">{t('product.bestseller')}</span>
            <img className="product-gallery-image" src={product.image} alt={viewProduct.name} />
          </div>
          <div className="product-gallery-thumbs">
            {galleryItems.map((item, index) => (
              <button key={`${item}-${index}`} className={index === 0 ? 'product-thumb active' : 'product-thumb'}>
                <img src={item} alt={`${viewProduct.name} ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-showcase-info">
          <span className="hero-badge">{t('product.productNumber', { id: product.id })}</span>
          <p className="product-details-meta">
            {viewProduct.animalType} · {viewProduct.category}
          </p>
          <h1>{viewProduct.name}</h1>
          <p className="product-details-rating">{t('product.rating', { rating: product.rating })}</p>
          <p className="product-details-price">{formatPrice(product.price)}</p>
          <p className="product-details-description">{viewProduct.description}</p>

          <div className="variant-block">
            <h4>{t('product.flavor')}</h4>
            <div className="chip-row">
              <button className="chip active">{t('product.classic')}</button>
              <button className="chip">{t('product.withChicken')}</button>
              <button className="chip">{t('product.withVegetables')}</button>
            </div>
          </div>

          <div className="variant-block">
            <h4>{t('product.package')}</h4>
            <div className="chip-row">
              <button className="chip">{t('product.small')}</button>
              <button className="chip active">{t('product.standard')}</button>
              <button className="chip">{t('product.large')}</button>
            </div>
          </div>

          <div className="quantity-control">
            <span>{t('product.quantity')}</span>
            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
            <strong>{quantity}</strong>
            <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
          </div>

          <div className="inline-actions">
            <button className="btn btn-primary product-cta-btn" onClick={() => addToCart(product, quantity)}>
              {t('product.addToCart')}
            </button>
            <Link to="/catalogue" className="btn btn-secondary product-back-btn">
              {t('product.backToCatalog')}
            </Link>
          </div>

          <div className="product-accordion">
            <details open>
              <summary>{t('product.composition')}</summary>
              <p>{viewProduct.specs.slice(0, 2).join(', ')}</p>
            </details>
            <details>
              <summary>{t('product.recommendations')}</summary>
              <p>{t('product.recommendationsText')}</p>
            </details>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title={t('product.specsTitle')} />
        <ul className="specs-list">
          {viewProduct.specs.map((spec) => (
            <li key={spec}>{spec}</li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle title={t('product.similarTitle')} />
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
