import type { RouteObject } from 'react-router'
import FoodHome from './screens/FoodHome'
import FoodSearch from './screens/FoodSearch'
import FoodAddress from './screens/FoodAddress'
import FoodCategory from './screens/FoodCategory'
import FoodShop from './screens/FoodShop'
import FoodMenu from './screens/FoodMenu'
import FoodCart from './screens/FoodCart'
import FoodOrder from './screens/FoodOrder'
import FoodStatus from './screens/FoodStatus'

export const foodRoutes: RouteObject[] = [
  { path: '/food', element: <FoodHome /> },
  { path: '/food/search', element: <FoodSearch /> },
  { path: '/food/address', element: <FoodAddress /> },
  { path: '/food/c/:cat', element: <FoodCategory /> },
  { path: '/food/s/:shop', element: <FoodShop /> },
  { path: '/food/s/:shop/m/:menu', element: <FoodMenu /> },
  { path: '/food/cart', element: <FoodCart /> },
  { path: '/food/order', element: <FoodOrder /> },
  { path: '/food/status', element: <FoodStatus /> },
]
