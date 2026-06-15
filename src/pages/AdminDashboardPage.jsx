import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context/useAdmin'
import {
  fetchAdminMessages,
  fetchAdminOrders,
  fetchAdminProducts,
  saveAdminProduct,
  updateAdminMessageStatus,
  updateAdminOrderStatus,
} from '../lib/storeApi'

const defaultProductForm = {
  id: '',
  name: '',
  animalType: 'Собаки',
  category: 'Корм',
  price: '',
  oldPrice: '',
  rating: '4.8',
  image: '',
  description: '',
  specs: '',
  isPopular: false,
  isPromo: false,
  isActive: true,
}

const orderStatuses = ['new', 'processing', 'completed', 'cancelled']
const messageStatuses = ['new', 'reviewed', 'archived']

function AdminDashboardPage() {
  const { user, isAdmin, isLoading, authMessage, signOut } = useAdmin()
  const [section, setSection] = useState('overview')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [messages, setMessages] = useState([])
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [dashboardMessage, setDashboardMessage] = useState({ type: '', text: '' })
  const [productForm, setProductForm] = useState(defaultProductForm)
  const [isSavingProduct, setIsSavingProduct] = useState(false)

  const formatPrice = useCallback(
    (value) => `${new Intl.NumberFormat('ky-KG').format(Number(value) || 0)} сом`,
    [],
  )
  const formatDate = useCallback(
    (value) =>
      new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value)),
    [],
  )

  const loadAdminData = useCallback(async () => {
    setIsPageLoading(true)
    setDashboardMessage({ type: '', text: '' })

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
      setDashboardMessage({ type: 'error', text: error.message || 'Unable to load the admin dashboard.' })
    } finally {
      setIsPageLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      void loadAdminData()
    }
  }, [isAdmin, loadAdminData])

  const stats = useMemo(
    () => ({
      activeProducts: products.filter((product) => product.isPopular || product.isPromo || product.oldPrice).length,
      totalProducts: products.length,
      pendingOrders: orders.filter((order) => order.status === 'new').length,
      unreadMessages: messages.filter((message) => message.status === 'new').length,
    }),
    [products, orders, messages],
  )

  const handleProductChange = (field) => (event) => {
    const nextValue =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value

    setProductForm((prev) => ({ ...prev, [field]: nextValue }))
  }

  const handleEditProduct = (product) => {
    setSection('products')
    setProductForm({
      id: product.id,
      name: product.name,
      animalType: product.animalType,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice ?? '',
      rating: product.rating,
      image: product.image,
      description: product.description,
      specs: product.specs.join('\n'),
      isPopular: product.isPopular,
      isPromo: product.isPromo,
      isActive: true,
    })
  }

  const resetProductForm = () => {
    setProductForm(defaultProductForm)
  }

  const handleSaveProduct = async (event) => {
    event.preventDefault()
    setIsSavingProduct(true)
    setDashboardMessage({ type: '', text: '' })

    try {
      const savedProduct = await saveAdminProduct(productForm)
      setProducts((prevProducts) => {
        const exists = prevProducts.some((product) => product.id === savedProduct.id)
        return exists
          ? prevProducts.map((product) => (product.id === savedProduct.id ? savedProduct : product))
          : [savedProduct, ...prevProducts]
      })
      setDashboardMessage({ type: 'success', text: `Saved product: ${savedProduct.name}` })
      resetProductForm()
    } catch (error) {
      setDashboardMessage({ type: 'error', text: error.message || 'Unable to save the product.' })
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await updateAdminOrderStatus(orderId, status)
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status } : order)))
      setDashboardMessage({ type: 'success', text: `Updated order ${orderId.slice(0, 8)} to ${status}.` })
    } catch (error) {
      setDashboardMessage({ type: 'error', text: error.message || 'Unable to update the order.' })
    }
  }

  const handleMessageStatusChange = async (messageId, status) => {
    try {
      await updateAdminMessageStatus(messageId, status)
      setMessages((prevMessages) =>
        prevMessages.map((message) => (message.id === messageId ? { ...message, status } : message)),
      )
      setDashboardMessage({ type: 'success', text: `Updated message ${messageId.slice(0, 8)} to ${status}.` })
    } catch (error) {
      setDashboardMessage({ type: 'error', text: error.message || 'Unable to update the message.' })
    }
  }

  if (isLoading) {
    return (
      <div className="admin-shell">
        <div className="admin-centered-card">
          <h1>Preparing admin dashboard</h1>
          <p>Verifying the owner session.</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="admin-shell">
        <div className="admin-centered-card">
          <span className="admin-eyebrow">Access Required</span>
          <h1>This account cannot open the admin dashboard</h1>
          <p>{authMessage}</p>
          <button type="button" className="btn btn-primary" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="admin-page-content">
        <section className="admin-header-card">
          <div>
            <span className="admin-eyebrow">Owner Dashboard</span>
            <h1>Run the shop from one place</h1>
            <p>Manage the live catalog, track new orders, and answer customer messages.</p>
          </div>
          <div className="inline-actions">
            <button type="button" className="btn btn-secondary" onClick={() => loadAdminData()}>
              Refresh
            </button>
            <button type="button" className="btn btn-primary" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        </section>

        {dashboardMessage.text ? (
          <div className={`status-banner ${dashboardMessage.type === 'error' ? 'error' : 'success'}`}>
            <strong>{dashboardMessage.type === 'error' ? 'Admin update' : 'Saved'}</strong>
            <span>{dashboardMessage.text}</span>
          </div>
        ) : null}

        <section className="admin-stats-grid">
          <article className="admin-stat-card">
            <span>Products</span>
            <strong>{stats.totalProducts}</strong>
            <small>{products.filter((product) => product.isActive !== false).length} currently active</small>
          </article>
          <article className="admin-stat-card">
            <span>New orders</span>
            <strong>{stats.pendingOrders}</strong>
            <small>{orders.length} total orders in the system</small>
          </article>
          <article className="admin-stat-card">
            <span>Unread messages</span>
            <strong>{stats.unreadMessages}</strong>
            <small>{messages.length} total customer conversations</small>
          </article>
        </section>

        <section className="admin-nav-card">
          <button
            type="button"
            className={`admin-nav-pill ${section === 'overview' ? 'active' : ''}`}
            onClick={() => setSection('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`admin-nav-pill ${section === 'products' ? 'active' : ''}`}
            onClick={() => setSection('products')}
          >
            Products
          </button>
          <button
            type="button"
            className={`admin-nav-pill ${section === 'orders' ? 'active' : ''}`}
            onClick={() => setSection('orders')}
          >
            Orders
          </button>
          <button
            type="button"
            className={`admin-nav-pill ${section === 'messages' ? 'active' : ''}`}
            onClick={() => setSection('messages')}
          >
            Messages
          </button>
        </section>

        {isPageLoading ? (
          <div className="admin-panel-card">
            <h2>Loading admin data</h2>
            <p>Fetching the latest products, orders, and customer messages.</p>
          </div>
        ) : null}

        {!isPageLoading && section === 'overview' ? (
          <section className="admin-overview-grid">
            <div className="admin-panel-card">
              <div className="admin-section-head">
                <h2>Latest orders</h2>
                <button type="button" className="btn btn-secondary" onClick={() => setSection('orders')}>
                  Open orders
                </button>
              </div>
              <div className="admin-stack-list">
                {orders.slice(0, 4).map((order) => (
                  <article key={order.id} className="admin-list-card">
                    <div className="admin-list-head">
                      <strong>{order.customer_name}</strong>
                      <span className={`admin-status-chip ${order.status}`}>{order.status}</span>
                    </div>
                    <p>{formatPrice(order.total)}</p>
                    <small>{formatDate(order.created_at)}</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="admin-panel-card">
              <div className="admin-section-head">
                <h2>Recent messages</h2>
                <button type="button" className="btn btn-secondary" onClick={() => setSection('messages')}>
                  Open messages
                </button>
              </div>
              <div className="admin-stack-list">
                {messages.slice(0, 4).map((message) => (
                  <article key={message.id} className="admin-list-card">
                    <div className="admin-list-head">
                      <strong>{message.name}</strong>
                      <span className={`admin-status-chip ${message.status}`}>{message.status}</span>
                    </div>
                    <p>{message.message}</p>
                    <small>{message.email}</small>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {!isPageLoading && section === 'products' ? (
          <section className="admin-products-layout">
            <form className="admin-panel-card admin-product-form" onSubmit={handleSaveProduct}>
              <div className="admin-section-head">
                <h2>{productForm.id ? 'Edit product' : 'Create product'}</h2>
                <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
                  New product
                </button>
              </div>

              <div className="form-grid">
                <label>
                  Product name
                  <input type="text" value={productForm.name} onChange={handleProductChange('name')} required />
                </label>
                <label>
                  Animal type
                  <select value={productForm.animalType} onChange={handleProductChange('animalType')}>
                    <option value="Собаки">Собаки</option>
                    <option value="Кошки">Кошки</option>
                    <option value="Птицы">Птицы</option>
                    <option value="Грызуны">Грызуны</option>
                    <option value="Рыбы">Рыбы</option>
                    <option value="Питомцы">Питомцы</option>
                  </select>
                </label>
                <label>
                  Category
                  <input type="text" value={productForm.category} onChange={handleProductChange('category')} required />
                </label>
                <label>
                  Image URL
                  <input type="url" value={productForm.image} onChange={handleProductChange('image')} required />
                </label>
                <label>
                  Price
                  <input type="number" min="0" value={productForm.price} onChange={handleProductChange('price')} required />
                </label>
                <label>
                  Old price
                  <input type="number" min="0" value={productForm.oldPrice} onChange={handleProductChange('oldPrice')} />
                </label>
                <label>
                  Rating
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={productForm.rating}
                    onChange={handleProductChange('rating')}
                    required
                  />
                </label>
              </div>

              <label>
                Description
                <textarea rows="4" value={productForm.description} onChange={handleProductChange('description')} />
              </label>

              <label>
                Specs, one per line
                <textarea rows="6" value={productForm.specs} onChange={handleProductChange('specs')} />
              </label>

              <div className="admin-checkbox-row">
                <label>
                  <input type="checkbox" checked={productForm.isPopular} onChange={handleProductChange('isPopular')} />{' '}
                  Popular
                </label>
                <label>
                  <input type="checkbox" checked={productForm.isPromo} onChange={handleProductChange('isPromo')} /> Promo
                </label>
                <label>
                  <input type="checkbox" checked={productForm.isActive} onChange={handleProductChange('isActive')} /> Active
                </label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSavingProduct}>
                {isSavingProduct ? 'Saving...' : productForm.id ? 'Save changes' : 'Create product'}
              </button>
            </form>

            <div className="admin-panel-card">
              <div className="admin-section-head">
                <h2>Catalog inventory</h2>
                <span>{products.length} products</span>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.animalType}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>
                          <span className={`admin-status-chip ${product.isPopular ? 'processing' : 'completed'}`}>
                            {product.isActive === false ? 'inactive' : product.isPromo ? 'promo' : 'live'}
                          </span>
                        </td>
                        <td>
                          <button type="button" className="btn btn-secondary" onClick={() => handleEditProduct(product)}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        {!isPageLoading && section === 'orders' ? (
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
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="admin-order-meta">
                  <p>
                    <strong>Created:</strong> {formatDate(order.created_at)}
                  </p>
                  <p>
                    <strong>Delivery:</strong> {order.delivery_method}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.payment_method}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address || 'Pickup order'}
                  </p>
                </div>
                <div className="admin-order-items">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="admin-order-item">
                      <span>{item.product_name}</span>
                      <span>
                        {item.quantity} × {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {!isPageLoading && section === 'messages' ? (
          <section className="admin-stack-list">
            {messages.map((message) => (
              <article key={message.id} className="admin-panel-card admin-message-card">
                <div className="admin-section-head">
                  <div>
                    <h2>{message.name}</h2>
                    <p>
                      {message.email}
                      {message.phone ? ` · ${message.phone}` : ''}
                    </p>
                  </div>
                  <select value={message.status} onChange={(event) => handleMessageStatusChange(message.id, event.target.value)}>
                    {messageStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <p>{message.message}</p>
                <small>{formatDate(message.created_at)}</small>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default AdminDashboardPage
