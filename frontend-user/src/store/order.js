export default {
  namespaced: true,
  
  state: () => ({
    orders: []
  }),
  
  getters: {
    orderList: (state) => state.orders
  },
  
  mutations: {
    SET_ORDERS(state, orders) {
      state.orders = orders
    },
    ADD_ORDER(state, order) {
      state.orders.unshift(order)
    },
    UPDATE_ORDER_STATUS(state, { index, status }) {
      state.orders[index].status = status
    },
    REMOVE_ORDER(state, index) {
      state.orders.splice(index, 1)
    },
    CLEAR_ORDERS(state) {
      state.orders = []
    }
  },
  
  actions: {
    getStorageKey({ rootGetters }) {
      const userId = rootGetters['user/userInfo']?.id || 'guest'
      return `orders_${userId}`
    },
    
    async loadOrders({ commit, dispatch }) {
      const key = await dispatch('getStorageKey')
      const stored = localStorage.getItem(key)
      commit('SET_ORDERS', stored ? JSON.parse(stored) : [])
    },
    
    async addOrder({ commit, dispatch }, order) {
      commit('ADD_ORDER', order)
      await dispatch('saveToStorage')
    },
    
    async updateOrderStatus({ state, commit, dispatch }, { orderId, status }) {
      const index = state.orders.findIndex(o => o.id === orderId)
      if (index > -1) {
        commit('UPDATE_ORDER_STATUS', { index, status })
        await dispatch('saveToStorage')
      }
    },
    
    async removeOrder({ state, commit, dispatch }, orderId) {
      const index = state.orders.findIndex(o => o.id === orderId)
      if (index > -1) {
        commit('REMOVE_ORDER', index)
        await dispatch('saveToStorage')
      }
    },
    
    async saveToStorage({ state, dispatch }) {
      const key = await dispatch('getStorageKey')
      localStorage.setItem(key, JSON.stringify(state.orders))
    },
    
    clearOrders({ commit }) {
      commit('CLEAR_ORDERS')
    }
  }
}
