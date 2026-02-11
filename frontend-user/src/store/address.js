import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useAddressStore = defineStore('address', {
  state: () => ({
    addresses: []
  }),
  
  getters: {
    defaultAddress: (state) => state.addresses.find(a => a.isDefault) || null,
    
    addressList: (state) => state.addresses
  },
  
  actions: {
    // 获取当前用户的存储 key
    getStorageKey() {
      const userStore = useUserStore()
      const userId = userStore.userInfo?.id || 'guest'
      return `addresses_${userId}`
    },
    
    // 加载当前用户的地址
    loadAddresses() {
      const key = this.getStorageKey()
      const stored = localStorage.getItem(key)
      this.addresses = stored ? JSON.parse(stored) : []
    },
    
    addAddress(address) {
      if (address.isDefault) {
        this.addresses.forEach(a => a.isDefault = false)
      }
      const newAddress = {
        id: Date.now(),
        ...address
      }
      this.addresses.push(newAddress)
      this.saveToStorage()
      return newAddress
    },
    
    updateAddress(id, data) {
      const index = this.addresses.findIndex(a => a.id === id)
      if (index > -1) {
        if (data.isDefault) {
          this.addresses.forEach(a => a.isDefault = false)
        }
        this.addresses[index] = { ...this.addresses[index], ...data }
        this.saveToStorage()
      }
    },
    
    removeAddress(id) {
      const index = this.addresses.findIndex(a => a.id === id)
      if (index > -1) {
        this.addresses.splice(index, 1)
        this.saveToStorage()
      }
    },
    
    setDefault(id) {
      this.addresses.forEach(a => {
        a.isDefault = a.id === id
      })
      this.saveToStorage()
    },
    
    saveToStorage() {
      const key = this.getStorageKey()
      localStorage.setItem(key, JSON.stringify(this.addresses))
    },
    
    // 清空地址（退出登录时调用）
    clearAddresses() {
      this.addresses = []
    }
  }
})
