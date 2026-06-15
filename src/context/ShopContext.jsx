import { useCallback, useEffect, useMemo, useState } from 'react'
import { ShopContext } from './ShopContextValue'
import { useLanguage } from './useLanguage'
import { fetchProducts } from '../lib/storeApi'

const CART_STORAGE_KEY = 'pawpalace-cart'
const FAVORITES_STORAGE_KEY = 'pawpalace-favorites'

function readStoredValue(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

export function ShopProvider({ children }) {
  const { t } = useLanguage()
  const [cartItems, setCartItems] = useState(() => readStoredValue(CART_STORAGE_KEY, []))
  const [favoriteIds, setFavoriteIds] = useState(() => readStoredValue(FAVORITES_STORAGE_KEY, []))
  const [products, setProducts] = useState([])
  const [isProductsLoading, setIsProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')

  const refreshProducts = useCallback(async () => {
    try {
      setIsProductsLoading(true)
      setProductsError('')
      const nextProducts = await fetchProducts()
      setProducts(nextProducts)
    } catch (error) {
      setProductsError(error.message || t('catalog.errorLoad'))
    } finally {
      setIsProductsLoading(false)
    }
  }, [t])

  useEffect(() => {
    refreshProducts()
  }, [refreshProducts])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  useEffect(() => {
    if (!products.length) {
      return
    }

    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          const currentProduct = products.find((product) => product.id === item.id)
          return currentProduct ? { ...currentProduct, quantity: item.quantity } : item
        })
        .filter((item) => item.quantity > 0)
    )
  }, [products])

  // Добавляем товар в корзину: если уже есть, увеличиваем количество
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prevItems, { ...product, quantity }]
    })
  }

  const changeCartItemQuantity = (productId, nextQuantity) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => (item.id === productId ? { ...item, quantity: nextQuantity } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const toggleFavorite = (productId) => {
    setFavoriteIds((prevIds) =>
      prevIds.includes(productId) ? prevIds.filter((id) => id !== productId) : [...prevIds, productId]
    )
  }

  const isFavorite = (productId) => favoriteIds.includes(productId)

  // Считаем итоговые значения корзины только при изменении cartItems
  const cartSummary = useMemo(() => {
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const delivery = subtotal === 0 || subtotal >= 3000 ? 0 : 250
    const total = subtotal + delivery

    return { itemsCount, subtotal, delivery, total }
  }, [cartItems])

  const value = {
    cartItems,
    favoriteIds,
    products,
    isProductsLoading,
    productsError,
    refreshProducts,
    addToCart,
    changeCartItemQuantity,
    removeFromCart,
    clearCart,
    toggleFavorite,
    isFavorite,
    cartSummary
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
