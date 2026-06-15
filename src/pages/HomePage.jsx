import { Link } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import SectionTitle from '../components/ui/SectionTitle'
import { useLanguage } from '../context/useLanguage'
import { useShop } from '../context/useShop'

function HomePage() {
  const { products, isProductsLoading } = useShop()
  const { t, translateAnimalType } = useLanguage()
  const featuredProducts = products.filter((product) => product.isPopular).slice(0, 4)
  const homeCategories = [
    { key: 'dogs', value: 'Собаки' },
    { key: 'cats', value: 'Кошки' },
    { key: 'birds', value: 'Птицы' },
    { key: 'fish', value: 'Рыбы' },
  ]

  return (
    <div className="page-content">
      <section className="hero-banner">
        <div>
          <span className="hero-badge">{t('home.heroBadge')}</span>
          <h1>{t('home.heroTitle')}</h1>
          <p>{t('home.heroText')}</p>
          <div className="inline-actions">
            <Link to="/catalogue" className="btn btn-primary">
              {t('home.primaryCta')}
            </Link>
            <Link to="/contacts" className="btn btn-secondary">
              {t('home.secondaryCta')}
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          🐾
        </div>
      </section>

      <section>
        <SectionTitle title={t('home.categoryTitle')} subtitle={t('home.categoryText')} />
        <div className="category-grid">
          {homeCategories.map((category) => (
            <Link
              key={category.key}
              to={`/catalogue?animals=${encodeURIComponent(category.value)}`}
              className="category-card"
            >
              <h3>{translateAnimalType(category.value)}</h3>
              <p>{t('catalog.filtersTitle')}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title={t('home.featuredTitle')} subtitle={t('home.featuredText')} />
        {isProductsLoading ? (
          <div className="empty-block large-empty-block">
            <div>
              <h3>{t('common.loadingTitle')}</h3>
              <p>{t('common.loadingText')}</p>
            </div>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle title={t('home.advantagesTitle')} />
        <ul className="advantages-list">
          {t('home.advantages').map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default HomePage
