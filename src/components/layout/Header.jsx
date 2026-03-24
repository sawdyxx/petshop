import { Link, NavLink } from 'react-router-dom'
import { useShop } from '../../context/useShop'

function Header() {
  const { cartSummary, favoriteIds } = useShop()

  return (
    <header className="site-header">
      <div className="container header-content">
        <div className="header-main-links">
          <Link to="/" className="brand">
            PawPalace
          </Link>
          <nav className="main-nav">
            <NavLink to="/catalogue">Каталог</NavLink>
            <NavLink to="/about">О нас</NavLink>
            <NavLink to="/contacts">Контакты</NavLink>
          </nav>
        </div>

        <div className="header-actions">
          <div className="header-search">
            <span>⌕</span>
            <input placeholder="Поиск..." type="text" />
          </div>
          <NavLink to="/favorites" className="header-icon-link" aria-label="Избранное">
            <span>♡</span>
            <small className="header-icon-count">{favoriteIds.length}</small>
          </NavLink>
          <NavLink to="/cart" className="header-icon-link" aria-label="Корзина">
            <span>🛒</span>
            <small className="header-icon-count">{cartSummary.itemsCount}</small>
          </NavLink>
          <Link to="/contacts" className="header-avatar" aria-label="Профиль">
            🐾
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
