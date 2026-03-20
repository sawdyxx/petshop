import { Link } from 'react-router-dom'
import SectionTitle from '../components/ui/SectionTitle'
import { useShop } from '../context/useShop'

function CartPage() {
  const { cartItems, cartSummary, changeCartItemQuantity, removeFromCart } = useShop()

  return (
    <div className="page-content">
      <SectionTitle title="Корзина" subtitle="Проверьте состав заказа перед оформлением" />

      {cartItems.length === 0 ? (
        <div className="empty-block">
          <p>Ваша корзина пока пуста.</p>
          <Link to="/catalogue" className="btn btn-primary">
            В каталог
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-list">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-item">
                <div className="cart-item-main">
                  <div className="cart-item-emoji">{item.image}</div>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.price} ₽ за штуку</p>
                  </div>
                </div>

                <div className="cart-item-controls">
                  <button onClick={() => changeCartItemQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeCartItemQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <h3>Итог заказа</h3>
            <p>Товаров: {cartSummary.itemsCount}</p>
            <p>Сумма: {cartSummary.subtotal} ₽</p>
            <p>Доставка: {cartSummary.delivery} ₽</p>
            <p className="summary-total">К оплате: {cartSummary.total} ₽</p>
            <Link to="/checkout" className="btn btn-primary">
              Оформить заказ
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}

export default CartPage
