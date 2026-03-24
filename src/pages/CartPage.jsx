import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/useShop'
import { products } from '../data/products'

function CartPage() {
  const { cartItems, cartSummary, changeCartItemQuantity, removeFromCart, addToCart } = useShop()
  const currencyFormatter = useMemo(() => new Intl.NumberFormat('ky-KG'), [])
  const cartItemIds = useMemo(() => new Set(cartItems.map((item) => item.id)), [cartItems])
  const recommendedProducts = useMemo(() => {
    const popularProducts = products.filter((product) => product.isPopular && !cartItemIds.has(product.id))
    const fallbackProducts = products.filter((product) => !cartItemIds.has(product.id))
    const source = popularProducts.length >= 4 ? popularProducts : fallbackProducts
    return source.slice(0, 4)
  }, [cartItemIds])
  const formatPrice = (value) => `${currencyFormatter.format(value)} сом`

  return (
    <div className="page-content cart-design-page">
      <header className="cart-page-head">
        <h1>Ваша корзина</h1>
        <p>У вас {cartSummary.itemsCount} товаров для вашего пушистого друга.</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="empty-block large-empty-block">
          <div>
            <h3>Ваша корзина пока пуста</h3>
            <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
          </div>
          <Link to="/catalogue" className="btn btn-primary">
            В каталог
          </Link>
        </div>
      ) : (
        <div className="cart-design-layout">
          <section className="cart-design-list">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-design-item">
                <div className="cart-design-item-visual">
                  <div className="cart-design-item-blob" />
                  <img className="cart-design-item-image" src={item.image} alt={item.name} loading="lazy" />
                </div>

                <div className="cart-design-item-content">
                  <div className="cart-design-item-top">
                    <h3>{item.name}</h3>
                    <strong>{formatPrice(item.price)}</strong>
                  </div>
                  <div className="cart-design-stock">
                    <span />
                    <p>В наличии</p>
                  </div>
                  <div className="cart-design-controls">
                    <div className="cart-design-qty">
                      <button onClick={() => changeCartItemQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => changeCartItemQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-design-remove" onClick={() => removeFromCart(item.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <div className="cart-design-promo">
              <input placeholder="Введите промокод" type="text" />
              <button>Применить код</button>
            </div>
          </section>

          <aside className="cart-design-summary">
            <h2>Итого</h2>
            <div className="cart-design-summary-lines">
              <p>
                <span>Сумма</span>
                <strong>{formatPrice(cartSummary.subtotal)}</strong>
              </p>
              <p>
                <span>Доставка</span>
                <strong>{cartSummary.delivery === 0 ? 'БЕСПЛАТНО' : formatPrice(cartSummary.delivery)}</strong>
              </p>
            </div>
            <div className="cart-design-note">
              <p>Бесплатная доставка для заказов от 3000 сом.</p>
            </div>
            <div className="cart-design-total">
              <p>Всего</p>
              <strong>{formatPrice(cartSummary.total)}</strong>
            </div>
            <Link to="/checkout" className="cart-design-checkout">
              Перейти к оформлению 🐾
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
            <h2>Не забудьте вкусняшку!</h2>
          </div>
          <div className="cart-design-recommendations-list">
            {recommendedProducts.map((product) => (
              <article key={product.id} className="cart-design-recommendation-card">
                <div className="cart-design-recommendation-emoji">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>
                <div className="cart-design-recommendation-body">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                  <p>
                    {product.animalType} · {product.category}
                  </p>
                  <div className="cart-design-recommendation-row">
                    <strong>{formatPrice(product.price)}</strong>
                    <button onClick={() => addToCart(product, 1)}>В корзину</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default CartPage
