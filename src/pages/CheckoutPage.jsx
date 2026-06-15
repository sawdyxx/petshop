import SectionTitle from '../components/ui/SectionTitle'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useShop } from '../context/useShop'
import { submitOrder } from '../lib/storeApi'

function CheckoutPage() {
  const { cartItems, cartSummary, clearCart } = useShop()
  const { formatPrice, t } = useLanguage()
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    deliveryMethod: 'courier',
    paymentMethod: 'card',
  })
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '', orderId: null })

  const isCartEmpty = cartItems.length === 0

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isCartEmpty) {
      setSubmitState({ status: 'error', message: t('checkout.errorEmptyCart'), orderId: null })
      return
    }

    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setSubmitState({
        status: 'error',
        message: t('checkout.errorMissingContacts'),
        orderId: null,
      })
      return
    }

    if (formData.deliveryMethod === 'courier' && !formData.address.trim()) {
      setSubmitState({
        status: 'error',
        message: t('checkout.errorMissingAddress'),
        orderId: null,
      })
      return
    }

    try {
      setSubmitState({ status: 'loading', message: '', orderId: null })

      const orderId = await submitOrder({
        customer_name: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.deliveryMethod === 'courier' ? formData.address.trim() : null,
        delivery_method: formData.deliveryMethod,
        payment_method: formData.paymentMethod,
        items_count: cartSummary.itemsCount,
        subtotal: cartSummary.subtotal,
        delivery_fee: cartSummary.delivery,
        total: cartSummary.total,
        status: 'new',
        items: cartItems,
      })

      clearCart()
      setSubmitState({
        status: 'success',
        message: t('checkout.successMessage'),
        orderId,
      })
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        address: '',
        deliveryMethod: 'courier',
        paymentMethod: 'card',
      })
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error.message || t('checkout.errorSubmit'),
        orderId: null,
      })
    }
  }

  return (
    <div className="page-content">
      <SectionTitle title={t('checkout.title')} subtitle={t('checkout.subtitle')} />

      <section className="steps-row">
        <div className="step-card active">{t('checkout.stepContacts')}</div>
        <div className="step-card active">{t('checkout.stepDelivery')}</div>
        <div className="step-card">{t('checkout.stepConfirmation')}</div>
      </section>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>{t('checkout.customerData')}</h3>
          <div className="form-grid">
            <input type="text" placeholder={t('checkout.name')} value={formData.customerName} onChange={handleChange('customerName')} />
            <input type="tel" placeholder={t('checkout.phone')} value={formData.phone} onChange={handleChange('phone')} />
          </div>
          <input type="email" placeholder={t('checkout.email')} value={formData.email} onChange={handleChange('email')} />

          <h3>{t('checkout.deliveryTitle')}</h3>
          <div className="radio-group radio-group-inline">
            <label>
              <input
                type="radio"
                name="delivery"
                value="courier"
                checked={formData.deliveryMethod === 'courier'}
                onChange={handleChange('deliveryMethod')}
              />{' '}
              {t('checkout.courier')}
            </label>
            <label>
              <input
                type="radio"
                name="delivery"
                value="pickup"
                checked={formData.deliveryMethod === 'pickup'}
                onChange={handleChange('deliveryMethod')}
              />{' '}
              {t('checkout.pickup')}
            </label>
          </div>
          <input
            type="text"
            placeholder={formData.deliveryMethod === 'courier' ? t('checkout.deliveryAddress') : t('checkout.pickupPoint')}
            value={formData.address}
            onChange={handleChange('address')}
          />

          <h3>{t('checkout.paymentTitle')}</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange('paymentMethod')}
              />{' '}
              {t('checkout.card')}
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleChange('paymentMethod')}
              />{' '}
              {t('checkout.cash')}
            </label>
          </div>

          {submitState.message ? (
            <div className={submitState.status === 'success' ? 'status-banner success' : 'status-banner error'}>
              <strong>{submitState.status === 'success' ? t('checkout.successTitle') : t('checkout.errorTitle')}</strong>
              <span>
                {submitState.message}
                {submitState.orderId ? ` ${t('checkout.orderNumber', { id: submitState.orderId })}` : ''}
              </span>
            </div>
          ) : null}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitState.status === 'loading' || isCartEmpty}>
              {submitState.status === 'loading' ? t('checkout.loading') : t('checkout.confirm')}
            </button>
            <span>
              {isCartEmpty ? (
                <>
                  {t('checkout.emptyCartInline')} <Link to="/catalogue">{t('checkout.goToCatalog')}</Link>
                </>
              ) : (
                t('checkout.agreement')
              )}
            </span>
          </div>
        </form>

        <aside className="checkout-summary">
          <h3>{t('checkout.summaryTitle')}</h3>
          <p>{t('checkout.itemsCount', { count: cartSummary.itemsCount })}</p>
          <p>{t('checkout.subtotal', { value: formatPrice(cartSummary.subtotal) })}</p>
          <p>{t('checkout.delivery', { value: formatPrice(cartSummary.delivery) })}</p>
          <p className="summary-total">{t('checkout.total', { value: formatPrice(cartSummary.total) })}</p>
          <div className="secure-note">
            <strong>{t('checkout.secureTitle')}</strong>
            <span>{t('checkout.secureText')}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CheckoutPage
