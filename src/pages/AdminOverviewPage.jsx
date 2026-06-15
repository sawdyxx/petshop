import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminMessages, fetchAdminOrders, fetchAdminProducts } from '../lib/storeApi'
import { useLanguage } from '../context/useLanguage'

function AdminOverviewPage() {
  const { formatDate, formatPrice, t } = useLanguage()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })

  const loadOverview = useCallback(async () => {
    setIsLoading(true)
    setStatusMessage({ type: '', text: '' })

    try {
      const [nextProducts, nextOrders, nextMessages] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminOrders(),
        fetchAdminMessages(),
      ])

      setProducts(nextProducts)
      setOrders(nextOrders)
      setMessages(nextMessages)
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.message || t('admin.overview.loadingText') })
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    void loadOverview()
  }, [loadOverview])

  const stats = useMemo(
    () => ({
      totalProducts: products.length,
      activeProducts: products.filter((product) => product.isActive !== false).length,
      promoProducts: products.filter((product) => product.isPromo || product.isPopular).length,
      pendingOrders: orders.filter((order) => order.status === 'new').length,
      revenue: orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + (Number(order.total) || 0), 0),
      unreadMessages: messages.filter((message) => message.status === 'new').length,
    }),
    [products, orders, messages],
  )
  const statusLabels = {
    new: t('common.statusNew'),
    processing: t('common.statusProcessing'),
    completed: t('common.statusCompleted'),
    cancelled: t('common.statusCancelled'),
    reviewed: t('common.statusReviewed'),
    archived: t('common.statusArchived'),
  }

  return (
    <>
      <section className="admin-header-card">
        <div>
          <span className="admin-eyebrow">{t('admin.overview.badge')}</span>
          <h1>{t('admin.overview.title')}</h1>
          <p>{t('admin.overview.text')}</p>
        </div>
        <div className="inline-actions">
          <Link to="/catalog" className="btn btn-secondary">
            {t('admin.overview.viewStorefront')}
          </Link>
          <button type="button" className="btn btn-primary" onClick={() => loadOverview()}>
            {t('admin.overview.refresh')}
          </button>
        </div>
      </section>

      {statusMessage.text ? (
        <div className={`status-banner ${statusMessage.type === 'error' ? 'error' : 'success'}`}>
          <strong>{statusMessage.type === 'error' ? t('admin.overview.update') : t('admin.overview.loaded')}</strong>
          <span>{statusMessage.text}</span>
        </div>
      ) : null}

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <span>{t('admin.overview.activeProducts')}</span>
          <strong>{stats.activeProducts}</strong>
          <small>{t('admin.overview.totalCatalog', { count: stats.totalProducts })}</small>
        </article>
        <article className="admin-stat-card">
          <span>{t('admin.overview.promoItems')}</span>
          <strong>{stats.promoProducts}</strong>
          <small>{t('admin.overview.promoText')}</small>
        </article>
        <article className="admin-stat-card">
          <span>{t('admin.overview.newOrders')}</span>
          <strong>{stats.pendingOrders}</strong>
          <small>{t('admin.overview.totalOrders', { count: orders.length })}</small>
        </article>
        <article className="admin-stat-card">
          <span>{t('admin.overview.inbox')}</span>
          <strong>{stats.unreadMessages}</strong>
          <small>{t('admin.overview.totalMessages', { count: messages.length })}</small>
        </article>
        <article className="admin-stat-card">
          <span>{t('admin.overview.revenue')}</span>
          <strong>{formatPrice(stats.revenue)}</strong>
          <small>{t('admin.overview.revenueText')}</small>
        </article>
      </section>

      {isLoading ? (
        <section className="admin-panel-card">
          <h2>{t('admin.overview.loadingTitle')}</h2>
          <p>{t('admin.overview.loadingText')}</p>
        </section>
      ) : (
        <>
          <section className="admin-overview-grid">
            <div className="admin-panel-card">
              <div className="admin-section-head">
                <h2>{t('admin.overview.latestOrders')}</h2>
                <Link to="/admin/orders" className="btn btn-secondary">
                  {t('admin.overview.openOrders')}
                </Link>
              </div>
              <div className="admin-stack-list">
                {orders.slice(0, 5).map((order) => (
                  <article key={order.id} className="admin-list-card">
                    <div className="admin-list-head">
                      <strong>{order.customer_name}</strong>
                      <span className={`admin-status-chip ${order.status}`}>{statusLabels[order.status] ?? order.status}</span>
                    </div>
                    <p>{formatPrice(order.total)}</p>
                    <small>{formatDate(order.created_at)}</small>
                  </article>
                ))}
                {!orders.length ? <p className="admin-empty-state">{t('admin.overview.noOrders')}</p> : null}
              </div>
            </div>

            <div className="admin-panel-card">
              <div className="admin-section-head">
                <h2>{t('admin.overview.recentMessages')}</h2>
                <Link to="/admin/messages" className="btn btn-secondary">
                  {t('admin.overview.openInbox')}
                </Link>
              </div>
              <div className="admin-stack-list">
                {messages.slice(0, 5).map((message) => (
                  <article key={message.id} className="admin-list-card">
                    <div className="admin-list-head">
                      <strong>{message.name}</strong>
                      <span className={`admin-status-chip ${message.status}`}>{statusLabels[message.status] ?? message.status}</span>
                    </div>
                    <p>{message.message}</p>
                    <small>{message.email}</small>
                  </article>
                ))}
                {!messages.length ? <p className="admin-empty-state">{t('admin.overview.noMessages')}</p> : null}
              </div>
            </div>
          </section>

          <section className="admin-quick-grid">
            <article className="admin-panel-card admin-card-subtle">
              <div className="admin-section-head">
                <div>
                  <h2>{t('admin.overview.catalogHealth')}</h2>
                  <p>{t('admin.overview.catalogHealthText')}</p>
                </div>
                <Link to="/admin/products" className="btn btn-secondary">
                  {t('admin.overview.manageProducts')}
                </Link>
              </div>
              <div className="admin-detail-grid">
                <div>
                  <strong>{products.filter((product) => product.isActive === false).length}</strong>
                  <span>{t('admin.overview.inactiveProducts')}</span>
                </div>
                <div>
                  <strong>{products.filter((product) => !product.image).length}</strong>
                  <span>{t('admin.overview.missingImages')}</span>
                </div>
                <div>
                  <strong>{products.filter((product) => !product.description).length}</strong>
                  <span>{t('admin.overview.missingDescriptions')}</span>
                </div>
              </div>
            </article>

            <article className="admin-panel-card admin-card-subtle">
              <div className="admin-section-head">
                <div>
                  <h2>{t('admin.overview.fulfillment')}</h2>
                  <p>{t('admin.overview.fulfillmentText')}</p>
                </div>
                <Link to="/admin/orders" className="btn btn-secondary">
                  {t('admin.overview.reviewOrders')}
                </Link>
              </div>
              <div className="admin-detail-grid">
                <div>
                  <strong>{orders.filter((order) => order.status === 'processing').length}</strong>
                  <span>{t('admin.overview.processing')}</span>
                </div>
                <div>
                  <strong>{orders.filter((order) => order.delivery_method === 'courier').length}</strong>
                  <span>{t('admin.overview.deliveryOrders')}</span>
                </div>
                <div>
                  <strong>{orders.filter((order) => order.payment_method === 'cash').length}</strong>
                  <span>{t('admin.overview.cashPayments')}</span>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </>
  )
}

export default AdminOverviewPage
