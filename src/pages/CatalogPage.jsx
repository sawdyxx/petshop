import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import { useLanguage } from '../context/useLanguage'
import { useShop } from '../context/useShop'

function CatalogPage() {
  const { products, isProductsLoading, productsError } = useShop()
  const { localizeProduct, translateAnimalType, t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''
  const selectedAnimals = useMemo(
    () => searchParams.get('animals')?.split(',').filter(Boolean) ?? [],
    [searchParams],
  )
  const selectedPriceRange = searchParams.get('price') ?? 'all'
  const selectedSort = searchParams.get('sort') ?? 'popular'
  const localizedProducts = useMemo(
    () => products.map((product) => ({ original: product, view: localizeProduct(product) })),
    [localizeProduct, products],
  )

  const animalOptions = useMemo(() => {
    const animals = Array.from(new Set(products.map((product) => product.animalType)))
    return animals.sort((left, right) => left.localeCompare(right))
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return [...localizedProducts]
      .filter(({ original, view }) => {
        const matchesQuery =
          !normalizedQuery ||
          `${view.name} ${view.category} ${view.animalType}`.toLowerCase().includes(normalizedQuery)

        const matchesAnimal = selectedAnimals.length === 0 || selectedAnimals.includes(original.animalType)

        const matchesPrice =
          selectedPriceRange === 'all' ||
          (selectedPriceRange === 'low' && original.price < 2500) ||
          (selectedPriceRange === 'mid' && original.price >= 2500 && original.price < 7500) ||
          (selectedPriceRange === 'high' && original.price >= 7500)

        return matchesQuery && matchesAnimal && matchesPrice
      })
      .sort((left, right) => {
        if (selectedSort === 'price-asc') return left.original.price - right.original.price
        if (selectedSort === 'price-desc') return right.original.price - left.original.price
        if (selectedSort === 'newest') return right.original.id - left.original.id
        if (selectedSort === 'rating') return right.original.rating - left.original.rating
        return Number(right.original.isPopular) - Number(left.original.isPopular) || right.original.rating - left.original.rating
      })
  }, [localizedProducts, searchQuery, selectedAnimals, selectedPriceRange, selectedSort])

  const updateSearchParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        nextParams.delete(key)
        return
      }

      nextParams.set(key, Array.isArray(value) ? value.join(',') : value)
    })

    setSearchParams(nextParams)
  }

  const handleAnimalToggle = (animalType) => {
    const nextAnimals = selectedAnimals.includes(animalType)
      ? selectedAnimals.filter((item) => item !== animalType)
      : [...selectedAnimals, animalType]

    updateSearchParams({ animals: nextAnimals })
  }

  const clearFilters = () => {
    setSearchParams(searchQuery ? { q: searchQuery } : {})
  }

  return (
    <div className="page-content catalogue-page">
      <section className="catalogue-hero">
        <span className="catalogue-hero-badge">{t('catalog.badge')}</span>
        <h1>{t('catalog.title')}</h1>
        <p>{t('catalog.text')}</p>
      </section>

      <div className="catalogue-layout">
        <aside className="catalogue-sidebar">
          <div className="catalogue-filter-title">{t('catalog.filtersTitle')}</div>
          <div className="catalogue-filter-group">
            <h4>{t('catalog.animalType')}</h4>
            {animalOptions.map((animalType) => (
              <label key={animalType}>
                <input
                  type="checkbox"
                  checked={selectedAnimals.includes(animalType)}
                  onChange={() => handleAnimalToggle(animalType)}
                />{' '}
                {translateAnimalType(animalType)}
              </label>
            ))}
          </div>
          <div className="catalogue-filter-group">
            <h4>{t('catalog.price')}</h4>
            <div className="catalogue-chip-row">
              <button
                className={selectedPriceRange === 'low' ? 'active' : ''}
                onClick={() => updateSearchParams({ price: selectedPriceRange === 'low' ? '' : 'low' })}
              >
                {t('catalog.priceLow')}
              </button>
              <button
                className={selectedPriceRange === 'mid' ? 'active' : ''}
                onClick={() => updateSearchParams({ price: selectedPriceRange === 'mid' ? '' : 'mid' })}
              >
                {t('catalog.priceMid')}
              </button>
              <button
                className={selectedPriceRange === 'high' ? 'active' : ''}
                onClick={() => updateSearchParams({ price: selectedPriceRange === 'high' ? '' : 'high' })}
              >
                {t('catalog.priceHigh')}
              </button>
            </div>
          </div>
          <button className="catalogue-apply-btn" onClick={clearFilters}>
            {t('catalog.resetFilters')}
          </button>
        </aside>

        <section className="catalogue-content">
          <div className="catalogue-toolbar">
            <p>{t('catalog.shown', { count: filteredProducts.length })}</p>
            <select value={selectedSort} onChange={(event) => updateSearchParams({ sort: event.target.value })}>
              <option value="popular">{t('catalog.sortPopular')}</option>
              <option value="price-asc">{t('catalog.sortPriceAsc')}</option>
              <option value="price-desc">{t('catalog.sortPriceDesc')}</option>
              <option value="newest">{t('catalog.sortNewest')}</option>
              <option value="rating">{t('catalog.sortRating')}</option>
            </select>
          </div>

          {searchQuery ? <p className="catalogue-search-note">{t('catalog.searchResults', { query: searchQuery })}</p> : null}
          {productsError ? <p className="catalogue-search-note">{productsError}</p> : null}
          {isProductsLoading ? (
            <div className="empty-block large-empty-block">
              <div>
                <h3>{t('catalog.loadingTitle')}</h3>
                <p>{t('catalog.loadingText')}</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-block large-empty-block">
              <div>
                <h3>{t('catalog.emptyTitle')}</h3>
                <p>{t('catalog.emptyText')}</p>
              </div>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(({ original }) => (
                <ProductCard key={original.id} product={original} variant="catalogue" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default CatalogPage
