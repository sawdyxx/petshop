import { useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdmin } from '../../context/useAdmin'
import { useLanguage } from '../../context/useLanguage'
import LanguageSwitcher from '../ui/LanguageSwitcher'

function getPageMeta(pathname, t) {
  if (pathname.startsWith('/admin/products')) {
    return {
      title: t('admin.layout.productsTitle'),
      description: t('admin.layout.productsText'),
    }
  }

  if (pathname.startsWith('/admin/orders')) {
    return {
      title: t('admin.layout.ordersTitle'),
      description: t('admin.layout.ordersText'),
    }
  }

  if (pathname.startsWith('/admin/messages')) {
    return {
      title: t('admin.layout.messagesTitle'),
      description: t('admin.layout.messagesText'),
    }
  }

  return {
    title: t('admin.layout.overviewTitle'),
    description: t('admin.layout.overviewText'),
  }
}

function AdminLayout() {
  const location = useLocation()
  const { user, isAdmin, isLoading, authMessage, signOut } = useAdmin()
  const { t } = useLanguage()
  const pageMeta = getPageMeta(location.pathname, t)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigationItems = [
    { to: '/admin/overview', label: t('admin.menu.overview'), icon: '⌂' },
    { to: '/admin/products', label: t('admin.menu.products'), icon: '□' },
    { to: '/admin/orders', label: t('admin.menu.orders'), icon: '◫' },
    { to: '/admin/messages', label: t('admin.menu.messages'), icon: '✉' },
  ]

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const isMobileViewport = window.matchMedia('(max-width: 1100px)').matches
    document.body.style.overflow = isMobileViewport && isSidebarOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  if (isLoading) {
    return (
      <div className="admin-shell">
        <div className="admin-centered-card">
          <LanguageSwitcher className="admin-language-switcher" />
          <h1>{t('admin.auth.preparingWorkspace')}</h1>
          <p>{t('admin.auth.preparingWorkspaceText')}</p>
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
          <LanguageSwitcher className="admin-language-switcher" />
          <span className="admin-eyebrow">{t('admin.auth.accessRequired')}</span>
          <h1>{t('admin.auth.dashboardDenied')}</h1>
          <p>{authMessage}</p>
          <button type="button" className="btn btn-primary" onClick={() => signOut()}>
            {t('admin.menu.signOut')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <button
          type="button"
          className={`admin-sidebar-backdrop ${isSidebarOpen ? 'visible' : ''}`}
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
        />

        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-block">
            <span className="admin-sidebar-kicker">PawPalace Admin</span>
            <h1>{t('admin.menu.title')}</h1>
            <p>{t('admin.menu.text')}</p>
          </div>

          <button
            type="button"
            className="admin-sidebar-close"
            aria-label="Close navigation menu"
            onClick={() => setIsSidebarOpen(false)}
          >
            {t('admin.menu.close')}
          </button>

          <LanguageSwitcher className="admin-language-switcher" />

          <nav className="admin-sidebar-nav" aria-label="Admin navigation">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
                end={item.to === '/admin/overview'}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="admin-sidebar-link-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <strong>{item.label}</strong>
              </NavLink>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-account">
              <span>{t('admin.menu.signedInAs')}</span>
              <strong>{user.email || t('admin.login.badge')}</strong>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => signOut()}>
              {t('admin.menu.signOut')}
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <section className="admin-topbar">
            <div>
              <button type="button" className="admin-menu-toggle" onClick={() => setIsSidebarOpen(true)}>
                {t('admin.menu.menuButton')}
              </button>
              <span className="admin-eyebrow">{t('admin.menu.workspace')}</span>
              <h2>{pageMeta.title}</h2>
              <p>{pageMeta.description}</p>
            </div>
            <div className="admin-topbar-meta">
              <span className="admin-status-chip live">{t('admin.menu.secureSession')}</span>
              <span>{user.email || t('admin.login.badge')}</span>
            </div>
          </section>

          <div className="admin-page-stack">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
