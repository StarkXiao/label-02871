export default {
  namespaced: true,
  
  state: () => ({
    addresses: []
  }),
  
  getters: {
    defaultAddress: (state) => state.addresses.find(a => a.isDefault) || null,
    
    addressList: (state) => state.addresses
  },
  
  mutations: {
    SET_ADDRESSES(state, addresses) {
      state.addresses = addresses
    },
    ADD_ADDRESS(state, address) {
      state.addresses.push(address)
    },
    UPDATE_ADDRESS(state, { index, data }) {
      state.addresses[index] = { ...state.addresses[index], ...data }
    },
    REMOVE_ADDRESS(state, index) {
      state.addresses.splice(index, 1)
    },
    CLEAR_DEFAULT(state) {
      state.addresses.forEach(a => a.isDefault = false)
    },
    SET_DEFAULT(state, id) {
      state.addresses.forEach(a => {
        a.isDefault = a.id === id
      })
    },
    CLEAR_ADDRESSES(state) {
      state.addresses = []
    }
  },
  
  actions: {
    // 获取当前用户的存储 key
    getStorageKey({ rootGetters }) {
      const userId = rootGetters['user/userInfo']?.id || 'guest'
      return `addresses_${userId}`
    },
    
    // 加载当前用户的地址
    async loadAddresses({ commit, dispatch }) {
      const key = await dispatch('getStorageKey')
      const stored = localStorage.getItem(key)
      commit('SET_ADDRESSES', stored ? JSON.parse(stored) : [])
    },
    
    async addAddress({ state, commit, dispatch }, address) {
      if (address.isDefault) {
        commit('CLEAR_DEFAULT')
      }
      const newAddress = {
        id: Date.now(),
        ...address
      }
      commit('ADD_ADDRESS', newAddress)
      await dispatch('saveToStorage')
      return newAddress
    },
    
    async updateAddress({ state, commit, dispatch }, { id, data }) {
      const index = state.addresses.findIndex(a => a.id === id)
      if (index > -1) {
        if (data.isDefault) {
          commit('CLEAR_DEFAULT')
        }
        commit('UPDATE_ADDRESS', { index, data })
        await dispatch('saveToStorage')
      }
    },
    
    async removeAddress({ state, commit, dispatch }, id) {
      const index = state.addresses.findIndex(a => a.id === id)
      if (index > -1) {
        commit('REMOVE_ADDRESS', index)
        await dispatch('saveToStorage')
      }
    },
    
    async setDefault({ commit, dispatch }, id) {
      commit('SET_DEFAULT', id)
      await dispatch('saveToStorage')
    },
    
    async saveToStorage({ state, dispatch }) {
      const key = await dispatch('getStorageKey')
      localStorage.setItem(key, JSON.stringify(state.addresses))
    },
    
    // 清空地址（退出登录时调用）
    clearAddresses({ commit }) {
      commit('CLEAR_ADDRESSES')
    }
  }
}
