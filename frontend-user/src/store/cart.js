import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]')
  }),
  
  getters: {
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    selectedItems: (state) => state.items.filter(item => item.selected),
    
    totalPrice: (state) => {
      return state.items
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    
    isAllSelected: (state) => {
      return state.items.length > 0 && state.items.every(item => item.selected)
    }
  },
  
  actions: {
    addItem(product, quantity = 1, specs = {}) {
      const specKey = JSON.stringify(specs)
      const existIndex = this.items.findIndex(
        item => item.productId === product.id && JSON.stringify(item.specs) === specKey
      )
      
      if (existIndex > -1) {
        this.items[existIndex].quantity += quantity
      } else {
        this.items.push({
          id: Date.now(),
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          specs,
          quantity,
          selected: true,
          stock: product.stock
        })
      }
      this.saveToStorage()
    },
    
    removeItem(id) {
      const index = this.items.findIndex(item => item.id === id)
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveToStorage()
      }
    },
    
    updateQuantity(id, quantity) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock))
        this.saveToStorage()
      }
    },
    
    toggleSelect(id) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.selected = !item.selected
        this.saveToStorage()
      }
    },
    
    toggleSelectAll() {
      const newState = !this.isAllSelected
      this.items.forEach(item => {
        item.selected = newState
      })
      this.saveToStorage()
    },
    
    clearSelected() {
      this.items = this.items.filter(item => !item.selected)
      this.saveToStorage()
    },
    
    clearAll() {
      this.items = []
      this.saveToStorage()
    },
    
    saveToStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    }
  }
})
