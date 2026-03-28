import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

// 用户模块
export function useUserStore() {
  const store = useStore()
  
  const state = reactive({
    // getters
    isLoggedIn: computed(() => store.getters['user/isLoggedIn']),
    userInfo: computed(() => store.getters['user/userInfo']),
    // state
    user: computed(() => store.state.user.user),
    token: computed(() => store.state.user.token)
  })
  
  return {
    ...toRefs(state),
    
    // actions
    login: (email, password) => store.dispatch('user/login', { email, password }),
    register: (data) => store.dispatch('user/register', data),
    logout: () => store.dispatch('user/logout')
  }
}

// 购物车模块
export function useCartStore() {
  const store = useStore()
  
  const state = reactive({
    // state
    items: computed(() => store.state.cart.items),
    // getters
    totalCount: computed(() => store.getters['cart/totalCount']),
    selectedItems: computed(() => store.getters['cart/selectedItems']),
    totalPrice: computed(() => store.getters['cart/totalPrice']),
    isAllSelected: computed(() => store.getters['cart/isAllSelected'])
  })
  
  return {
    ...toRefs(state),
    
    // actions
    addItem: (product, quantity = 1, specs = {}) => store.dispatch('cart/addItem', { product, quantity, specs }),
    removeItem: (id) => store.dispatch('cart/removeItem', id),
    updateQuantity: (id, quantity) => store.dispatch('cart/updateQuantity', { id, quantity }),
    toggleSelect: (id) => store.dispatch('cart/toggleSelect', id),
    toggleSelectAll: () => store.dispatch('cart/toggleSelectAll'),
    clearSelected: () => store.dispatch('cart/clearSelected'),
    clearAll: () => store.dispatch('cart/clearAll')
  }
}

// 地址模块
export function useAddressStore() {
  const store = useStore()
  
  const state = reactive({
    // state
    addresses: computed(() => store.state.address.addresses),
    // getters
    defaultAddress: computed(() => store.getters['address/defaultAddress']),
    addressList: computed(() => store.getters['address/addressList'])
  })
  
  return {
    ...toRefs(state),
    
    // actions
    loadAddresses: () => store.dispatch('address/loadAddresses'),
    addAddress: (address) => store.dispatch('address/addAddress', address),
    updateAddress: (id, data) => store.dispatch('address/updateAddress', { id, data }),
    removeAddress: (id) => store.dispatch('address/removeAddress', id),
    setDefault: (id) => store.dispatch('address/setDefault', id),
    clearAddresses: () => store.dispatch('address/clearAddresses')
  }
}

// 订单模块
export function useOrderStore() {
  const store = useStore()
  
  const state = reactive({
    // state
    orders: computed(() => store.state.order.orders),
    // getters
    orderList: computed(() => store.getters['order/orderList'])
  })
  
  return {
    ...toRefs(state),
    
    // actions
    loadOrders: () => store.dispatch('order/loadOrders'),
    addOrder: (order) => store.dispatch('order/addOrder', order),
    updateOrderStatus: (orderId, status) => store.dispatch('order/updateOrderStatus', { orderId, status }),
    removeOrder: (orderId) => store.dispatch('order/removeOrder', orderId),
    clearOrders: () => store.dispatch('order/clearOrders')
  }
}

// 收藏模块
export function useFavoriteStore() {
  const store = useStore()
  
  const state = reactive({
    // state
    items: computed(() => store.state.favorite.items),
    // getters
    favoriteIds: computed(() => store.getters['favorite/favoriteIds']),
    favoriteCount: computed(() => store.getters['favorite/favoriteCount'])
  })
  
  return {
    ...toRefs(state),
    
    // getters (作为函数直接返回)
    isFavorite: (productId) => store.getters['favorite/isFavorite'](productId),
    
    // actions
    toggleFavorite: (product) => store.dispatch('favorite/toggleFavorite', product),
    removeFavorite: (productId) => store.dispatch('favorite/removeFavorite', productId),
    clearAll: () => store.dispatch('favorite/clearAll'),
    loadFavorites: () => store.dispatch('favorite/loadFavorites')
  }
}
