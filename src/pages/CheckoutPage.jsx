import SectionTitle from '../components/ui/SectionTitle'
import { useMemo } from 'react'
import { useShop } from '../context/useShop'

function CheckoutPage() {
  const { cartSummary } = useShop()
  const currencyFormatter = useMemo(() => new Intl.NumberFormat('ky-KG'), [])
  const formatPrice = (value) => `${currencyFormatter.format(value)} сом`

  return (
    <div className="page-content">
      <SectionTitle title="Оформление заказа" subtitle="Заполните данные и выберите способ получения" />

      <section className="steps-row">
        <div className="step-card active">1. Контакты</div>
        <div className="step-card active">2. Доставка</div>
        <div className="step-card">3. Подтверждение</div>
      </section>

      <div className="checkout-layout">
        <form className="checkout-form">
          <h3>Данные клиента</h3>
          <div className="form-grid">
            <input type="text" placeholder="Имя" />
            <input type="tel" placeholder="Телефон" />
          </div>
          <input type="email" placeholder="Email" />

          <h3>Доставка</h3>
          <div className="radio-group radio-group-inline">
            <label>
              <input type="radio" name="delivery" defaultChecked /> Курьером
            </label>
            <label>
              <input type="radio" name="delivery" /> Самовывоз
            </label>
          </div>
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

          <div className="form-actions">
            <button type="button" className="btn btn-primary">
              Подтвердить заказ
            </button>
            <span>Нажимая кнопку, вы подтверждаете корректность данных</span>
          </div>
        </form>

        <aside className="checkout-summary">
          <h3>Ваш заказ</h3>
          <p>Товаров: {cartSummary.itemsCount}</p>
          <p>Сумма: {formatPrice(cartSummary.subtotal)}</p>
          <p>Доставка: {formatPrice(cartSummary.delivery)}</p>
          <p className="summary-total">Итого: {formatPrice(cartSummary.total)}</p>
          <div className="secure-note">
            <strong>Безопасная оплата</strong>
            <span>Платёж проходит через защищённый банковский шлюз</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CheckoutPage
