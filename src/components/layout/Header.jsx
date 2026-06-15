import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/useAdmin'
import { useLanguage } from '../../context/useLanguage'
import { useShop } from '../../context/useShop'
import LanguageSwitcher from '../ui/LanguageSwitcher'

function Header() {
  const { cartSummary, favoriteIds } = useShop()
  const { isAdmin } = useAdmin()
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const currentQuery = new URLSearchParams(location.search).get('q') ?? ''

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const nextParams = new URLSearchParams()
    const formData = new FormData(event.currentTarget)
    const query = String(formData.get('q') ?? '').trim()

    if (query) {
      nextParams.set('q', query)
    }

    navigate(`/catalogue${nextParams.toString() ? `?${nextParams.toString()}` : ''}`)
  }

  return (
    <header className="site-header">
      <div className="container header-content">
        <div className="header-main-links">
          <Link to="/" className="brand">
            PawPalace
          </Link>
          <nav className="main-nav">
            <NavLink to="/catalogue">{t('header.navCatalog')}</NavLink>
            <NavLink to="/about">{t('header.navAbout')}</NavLink>
            <NavLink to="/contacts">{t('header.navContacts')}</NavLink>
          </nav>
        </div>

        <div className="header-actions">
          <LanguageSwitcher />
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <span>⌕</span>
            <input
              key={`${location.pathname}${location.search}`}
              name="q"
              placeholder={t('header.searchPlaceholder')}
              type="text"
              defaultValue={currentQuery}
            />
          </form>
          <NavLink to="/favorites" className="header-icon-link" aria-label={t('header.favoritesAria')}>
            <span>♡</span>
            <small className="header-icon-count">{favoriteIds.length}</small>
          </NavLink>
          <NavLink to="/cart" className="header-icon-link" aria-label={t('header.cartAria')}>
            <span>🛒</span>
            <small className="header-icon-count">{cartSummary.itemsCount}</small>
          </NavLink>
          <Link
            to={isAdmin ? '/admin' : '/contacts'}
            className="header-avatar"
            aria-label={isAdmin ? t('header.adminAria') : t('header.profileAria')}
          >
            {isAdmin ? '⚙' : '🐾'}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
