import { useContext } from 'react'
import { ShopContext } from './ShopContextValue'

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop должен использоваться внутри ShopProvider')
  }
  return context
}
