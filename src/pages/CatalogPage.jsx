import ProductCard from '../components/ui/ProductCard'
import { products } from '../data/products'

function CatalogPage() {
  const shownCount = Math.min(products.length, 24)

  return (
    <div className="page-content catalogue-page">
      <section className="catalogue-hero">
        <span className="catalogue-hero-badge">Каталог PetMall</span>
        <h1>
          Найдите <span>радость</span> для питомца
        </h1>
        <p>Кураторские коллекции товаров для собак, кошек и других любимцев в одном удобном каталоге.</p>
      </section>

      <div className="catalogue-layout">
        <aside className="catalogue-sidebar">
          <div className="catalogue-filter-title">Фильтры</div>
          <div className="catalogue-filter-group">
            <h4>Тип питомца</h4>
            <label>
              <input type="checkbox" defaultChecked /> Собаки
            </label>
            <label>
              <input type="checkbox" /> Кошки
            </label>
            <label>
              <input type="checkbox" /> Птицы и грызуны
            </label>
          </div>
          <div className="catalogue-filter-group">
            <h4>Цена</h4>
            <div className="catalogue-chip-row">
              <button>До 2500 сом</button>
              <button>2500–7500 сом</button>
              <button>7500+ сом</button>
            </div>
          </div>
          <button className="catalogue-apply-btn">Применить</button>
        </aside>

        <section className="catalogue-content">
          <div className="catalogue-toolbar">
            <p>
              Показано <strong>{shownCount}</strong> товаров
            </p>
            <select defaultValue="Сортировка: Популярные">
              <option>Сортировка: Популярные</option>
              <option>Цена: по возрастанию</option>
              <option>Цена: по убыванию</option>
              <option>Сначала новинки</option>
            </select>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} variant="catalogue" />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default CatalogPage
