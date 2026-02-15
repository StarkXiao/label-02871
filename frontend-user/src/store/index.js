import { createStore } from 'vuex'
import user from './user'
import cart from './cart'
import address from './address'
import order from './order'

export default createStore({
  modules: {
    user,
    cart,
    address,
    order
  }
})
