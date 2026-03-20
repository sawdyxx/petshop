import { useMemo, useState } from 'react'
import { ShopContext } from './ShopContextValue'

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])

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
    addToCart,
    changeCartItemQuantity,
    removeFromCart,
    toggleFavorite,
    isFavorite,
    cartSummary
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
