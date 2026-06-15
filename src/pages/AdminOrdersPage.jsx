import { useCallback, useEffect, useState } from 'react'
import { orderStatuses } from '../lib/adminPanel'
import { useLanguage } from '../context/useLanguage'
import { fetchAdminOrders, updateAdminOrderStatus } from '../lib/storeApi'

function AdminOrdersPage() {
  const { formatDate, formatPrice, t } = useLanguage()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })

  const loadOrders = useCallback(async () => {
    setIsLoading(true)
    setStatusMessage({ type: '', text: '' })

    try {
      const nextOrders = await fetchAdminOrders()
      setOrders(nextOrders)
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || t('admin.orders.loadingText') })
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await updateAdminOrderStatus(orderId, status)
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status } : order)))
      setStatusMessage({ type: 'success', text: t('admin.orders.updateSuccess', { id: orderId.slice(0, 8), status }) })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || t('admin.orders.updateError') })
    }
  }
  const statusLabels = {
    new: t('common.statusNew'),
    processing: t('common.statusProcessing'),
    completed: t('common.statusCompleted'),
    cancelled: t('common.statusCancelled'),
  }

  return (
    <>
      <section className="admin-header-card">
        <div>
          <span className="admin-eyebrow">{t('admin.orders.badge')}</span>
          <h1>{t('admin.orders.title')}</h1>
          <p>{t('admin.orders.text')}</p>
        </div>
        <div className="inline-actions">
          <button type="button" className="btn btn-primary" onClick={() => loadOrders()}>
            {t('admin.orders.refresh')}
          </button>
        </div>
      </section>

      {statusMessage.text ? (
        <div className={`status-banner ${statusMessage.type === 'error' ? 'error' : 'success'}`}>
          <strong>{statusMessage.type === 'error' ? t('admin.overview.update') : t('admin.overview.loaded')}</strong>
          <span>{statusMessage.text}</span>
        </div>
      ) : null}

      {isLoading ? (
        <section className="admin-panel-card">
          <h2>{t('admin.orders.loadingTitle')}</h2>
          <p>{t('admin.orders.loadingText')}</p>
        </section>
      ) : (
        <section className="admin-stack-list">
          {orders.map((order) => (
            <article key={order.id} className="admin-panel-card admin-order-card">
              <div className="admin-section-head">
                <div>
                  <h2>{order.customer_name}</h2>
                  <p>
                    {order.email} · {order.phone}
                  </p>
                </div>
                <div className="admin-inline-meta">
                  <span>{formatPrice(order.total)}</span>
                  <select value={order.status} onChange={(event) => handleOrderStatusChange(order.id, event.target.value)}>
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status] ?? status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-order-meta">
                <p>
                  <strong>{t('admin.orders.created')}:</strong> {formatDate(order.created_at)}
                </p>
                <p>
                  <strong>{t('admin.orders.delivery')}:</strong> {order.delivery_method === 'courier' ? t('checkout.courier') : t('checkout.pickup')}
                </p>
                <p>
                  <strong>{t('admin.orders.payment')}:</strong> {order.payment_method === 'card' ? t('checkout.card') : t('checkout.cash')}
                </p>
                <p>
                  <strong>{t('admin.orders.address')}:</strong> {order.address || t('admin.orders.pickupOrder')}
                </p>
              </div>

              <div className="admin-order-items">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="admin-order-item">
                    <span>{item.product_name}</span>
                    <span>
                      {item.quantity} x {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}

          {!orders.length ? (
            <article className="admin-panel-card">
              <h2>{t('admin.orders.noOrdersTitle')}</h2>
              <p>{t('admin.orders.noOrdersText')}</p>
            </article>
          ) : null}
        </section>
      )}
    </>
  )
}

export default AdminOrdersPage
