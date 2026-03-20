import SectionTitle from '../components/ui/SectionTitle'
import { useShop } from '../context/useShop'

function CheckoutPage() {
  const { cartSummary } = useShop()

  return (
    <div className="page-content">
      <SectionTitle title="Оформление заказа" subtitle="Заполните данные и выберите способ получения" />

      <div className="checkout-layout">
        <form className="checkout-form">
          <h3>Данные клиента</h3>
          <input type="text" placeholder="Имя" />
          <input type="tel" placeholder="Телефон" />
          <input type="email" placeholder="Email" />

          <h3>Доставка</h3>
          <select>
            <option>Курьером</option>
            <option>Самовывоз</option>
          </select>
          <input type="text" placeholder="Адрес доставки" />

          <h3>Оплата</h3>
          <div className="radio-group">
            <label>
              <input type="radio" name="payment" defaultChecked /> Банковская карта
            </label>
            <label>
              <input type="radio" name="payment" /> Наличными при получении
            </label>
          </div>

          <button type="button" className="btn btn-primary">
            Подтвердить заказ
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Ваш заказ</h3>
          <p>Товаров: {cartSummary.itemsCount}</p>
          <p>Сумма: {cartSummary.subtotal} ₽</p>
          <p>Доставка: {cartSummary.delivery} ₽</p>
          <p className="summary-total">Итого: {cartSummary.total} ₽</p>
        </aside>
      </div>
    </div>
  )
}

export default CheckoutPage
