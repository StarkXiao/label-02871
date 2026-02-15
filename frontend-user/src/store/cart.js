export default {
  namespaced: true,
  
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
  
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    ADD_ITEM(state, item) {
      state.items.push(item)
    },
    UPDATE_ITEM_QUANTITY(state, { index, quantity }) {
      state.items[index].quantity = quantity
    },
    INCREMENT_QUANTITY(state, { index, quantity }) {
      state.items[index].quantity += quantity
    },
    REMOVE_ITEM(state, index) {
      state.items.splice(index, 1)
    },
    TOGGLE_SELECT(state, index) {
      state.items[index].selected = !state.items[index].selected
    },
    SET_ALL_SELECTED(state, selected) {
      state.items.forEach(item => {
        item.selected = selected
      })
    },
    CLEAR_SELECTED(state) {
      state.items = state.items.filter(item => !item.selected)
    },
    CLEAR_ALL(state) {
      state.items = []
    }
  },
  
  actions: {
    addItem({ state, commit, dispatch }, { product, quantity = 1, specs = {} }) {
      const specKey = JSON.stringify(specs)
      const existIndex = state.items.findIndex(
        item => item.productId === product.id && JSON.stringify(item.specs) === specKey
      )
      
      if (existIndex > -1) {
        commit('INCREMENT_QUANTITY', { index: existIndex, quantity })
      } else {
        commit('ADD_ITEM', {
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
      dispatch('saveToStorage')
    },
    
    removeItem({ state, commit, dispatch }, id) {
      const index = state.items.findIndex(item => item.id === id)
      if (index > -1) {
        commit('REMOVE_ITEM', index)
        dispatch('saveToStorage')
      }
    },
    
    updateQuantity({ state, commit, dispatch }, { id, quantity }) {
      const index = state.items.findIndex(item => item.id === id)
      if (index > -1) {
        const item = state.items[index]
        const newQuantity = Math.max(1, Math.min(quantity, item.stock))
        commit('UPDATE_ITEM_QUANTITY', { index, quantity: newQuantity })
        dispatch('saveToStorage')
      }
    },
    
    toggleSelect({ state, commit, dispatch }, id) {
      const index = state.items.findIndex(item => item.id === id)
      if (index > -1) {
        commit('TOGGLE_SELECT', index)
        dispatch('saveToStorage')
      }
    },
    
    toggleSelectAll({ getters, commit, dispatch }) {
      const newState = !getters.isAllSelected
      commit('SET_ALL_SELECTED', newState)
      dispatch('saveToStorage')
    },
    
    clearSelected({ commit, dispatch }) {
      commit('CLEAR_SELECTED')
      dispatch('saveToStorage')
    },
    
    clearAll({ commit, dispatch }) {
      commit('CLEAR_ALL')
      dispatch('saveToStorage')
    },
    
    saveToStorage({ state }) {
      localStorage.setItem('cart', JSON.stringify(state.items))
    }
  }
}
