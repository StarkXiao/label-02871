import { defineStore } from 'pinia'
import { userApi } from '@/api'
import { useCartStore } from './cart'
import { useAddressStore } from './address'
import { useOrderStore } from './order'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || ''
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userInfo: (state) => state.user
  },
  
  actions: {
    async login(email, password) {
      const res = await userApi.login(email, password)
      if (res.code === 200) {
        this.user = res.data.user
        this.token = res.data.token
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.token)
        // 加载用户地址和订单
        const addressStore = useAddressStore()
        addressStore.loadAddresses()
        const orderStore = useOrderStore()
        orderStore.loadOrders()
      }
      return res
    },
    
    async register(data) {
      const res = await userApi.register(data)
      if (res.code === 200) {
        this.user = res.data.user
        this.token = res.data.token
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.token)
        // 加载用户地址和订单
        const addressStore = useAddressStore()
        addressStore.loadAddresses()
        const orderStore = useOrderStore()
        orderStore.loadOrders()
      }
      return res
    },
    
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      // 清空购物车
      const cartStore = useCartStore()
      cartStore.clearAll()
      // 清空地址
      const addressStore = useAddressStore()
      addressStore.clearAddresses()
      // 清空订单
      const orderStore = useOrderStore()
      orderStore.clearOrders()
    }
  }
})
