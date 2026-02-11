import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: []
  }),
  
  getters: {
    orderList: (state) => state.orders
  },
  
  actions: {
    getStorageKey() {
      const userStore = useUserStore()
      const userId = userStore.userInfo?.id || 'guest'
      return `orders_${userId}`
    },
    
    loadOrders() {
      const key = this.getStorageKey()
      const stored = localStorage.getItem(key)
      this.orders = stored ? JSON.parse(stored) : []
    },
    
    addOrder(order) {
      this.orders.unshift(order)
      this.saveToStorage()
    },
    
    updateOrderStatus(orderId, status) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
        this.saveToStorage()
      }
    },
    
    removeOrder(orderId) {
      const index = this.orders.findIndex(o => o.id === orderId)
      if (index > -1) {
        this.orders.splice(index, 1)
        this.saveToStorage()
      }
    },
    
    saveToStorage() {
      const key = this.getStorageKey()
      localStorage.setItem(key, JSON.stringify(this.orders))
    },
    
    clearOrders() {
      this.orders = []
    }
  }
})
