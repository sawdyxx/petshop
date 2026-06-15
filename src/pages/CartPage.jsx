import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useShop } from '../context/useShop'

function CartPage() {
  const { cartItems, cartSummary, changeCartItemQuantity, removeFromCart, addToCart, products } = useShop()
  const { formatPrice, localizeProduct, t } = useLanguage()
  const cartItemIds = useMemo(() => new Set(cartItems.map((item) => item.id)), [cartItems])
  const recommendedProducts = useMemo(() => {
    const popularProducts = products.filter((product) => product.isPopular && !cartItemIds.has(product.id))
    const fallbackProducts = products.filter((product) => !cartItemIds.has(product.id))
    const source = popularProducts.length >= 4 ? popularProducts : fallbackProducts
    return source.slice(0, 4)
  }, [cartItemIds, products])

  return (
    <div className="page-content cart-design-page">
      <header className="cart-page-head">
        <h1>{t('cart.title')}</h1>
        <p>{t('cart.subtitle', { count: cartSummary.itemsCount })}</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="empty-block large-empty-block">
          <div>
            <h3>{t('cart.emptyTitle')}</h3>
            <p>{t('cart.emptyText')}</p>
          </div>
          <Link to="/catalogue" className="btn btn-primary">
            {t('cart.toCatalog')}
          </Link>
        </div>
      ) : (
        <div className="cart-design-layout">
          <section className="cart-design-list">
            {cartItems.map((item) => {
              const viewItem = localizeProduct(item)

              return (
              <article key={item.id} className="cart-design-item">
                <div className="cart-design-item-visual">
                  <div className="cart-design-item-blob" />
                  <img className="cart-design-item-image" src={item.image} alt={viewItem.name} loading="lazy" />
                </div>

                <div className="cart-design-item-content">
                  <div className="cart-design-item-top">
                    <h3>{viewItem.name}</h3>
                    <strong>{formatPrice(item.price)}</strong>
                  </div>
                  <div className="cart-design-stock">
                    <span />
                    <p>{t('cart.inStock')}</p>
                  </div>
                  <div className="cart-design-controls">
                    <div className="cart-design-qty">
                      <button onClick={() => changeCartItemQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => changeCartItemQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-design-remove" onClick={() => removeFromCart(item.id)}>
                      {t('cart.remove')}
                    </button>
                  </div>
                </div>
              </article>
              )
            })}

            <div className="cart-design-promo">
              <input placeholder={t('cart.promoPlaceholder')} type="text" />
              <button>{t('cart.applyCode')}</button>
            </div>
          </section>

          <aside className="cart-design-summary">
            <h2>{t('cart.summary')}</h2>
            <div className="cart-design-summary-lines">
              <p>
                <span>{t('cart.subtotal')}</span>
                <strong>{formatPrice(cartSummary.subtotal)}</strong>
              </p>
              <p>
                <span>{t('cart.delivery')}</span>
                <strong>{cartSummary.delivery === 0 ? t('cart.free') : formatPrice(cartSummary.delivery)}</strong>
              </p>
            </div>
            <div className="cart-design-note">
              <p>{t('cart.freeNote')}</p>
            </div>
            <div className="cart-design-total">
              <p>{t('cart.total')}</p>
              <strong>{formatPrice(cartSummary.total)}</strong>
            </div>
            <Link to="/checkout" className="cart-design-checkout">
              {t('cart.checkout')} {' '}🐾
            </Link>
            <div className="cart-design-payments">
              <span>💳</span>
              <span>🏦</span>
              <span>💰</span>
            </div>
          </aside>
        </div>
      )}

      {recommendedProducts.length > 0 ? (
        <section className="cart-design-recommendations">
          <div className="cart-design-recommendations-head">
            <h2>{t('cart.recommendationTitle')}</h2>
          </div>
          <div className="cart-design-recommendations-list">
            {recommendedProducts.map((product) => {
              const viewProduct = localizeProduct(product)

              return (
              <article key={product.id} className="cart-design-recommendation-card">
                <div className="cart-design-recommendation-emoji">
                  <img src={product.image} alt={viewProduct.name} loading="lazy" />
                </div>
                <div className="cart-design-recommendation-body">
                  <Link to={`/product/${product.id}`}>{viewProduct.name}</Link>
                  <p>
                    {viewProduct.animalType} · {viewProduct.category}
                  </p>
                  <div className="cart-design-recommendation-row">
                    <strong>{formatPrice(product.price)}</strong>
                    <button onClick={() => addToCart(product, 1)}>{t('cart.addToCart')}</button>
                  </div>
                </div>
              </article>
              )
            })}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default CartPage
