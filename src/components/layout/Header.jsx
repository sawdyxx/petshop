import { Link, NavLink } from 'react-router-dom'
import { useShop } from '../../context/useShop'

function Header() {
  const { cartSummary, favoriteIds } = useShop()

  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="brand">
          <span className="brand-icon">🐾</span>
          <span>PetMall</span>
        </Link>

        <nav className="main-nav">
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/catalogue">Каталог</NavLink>
          <NavLink to="/about">О нас</NavLink>
          <NavLink to="/contacts">Контакты</NavLink>
          <NavLink to="/favorites">Избранное ({favoriteIds.length})</NavLink>
          <NavLink to="/cart">Корзина ({cartSummary.itemsCount})</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
