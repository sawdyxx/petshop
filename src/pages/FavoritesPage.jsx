import { Link } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import SectionTitle from '../components/ui/SectionTitle'
import { useShop } from '../context/useShop'
import { products } from '../data/products'

function FavoritesPage() {
  const { favoriteIds } = useShop()
  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id))

  return (
    <div className="page-content">
      <SectionTitle title="Избранное" subtitle="Товары, которые вы сохранили" />

      {favoriteProducts.length === 0 ? (
        <div className="empty-block">
          <p>В избранном пока нет товаров.</p>
          <Link to="/catalogue" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
