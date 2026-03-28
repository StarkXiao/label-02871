const getStorageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return user ? `favorite_${user.id}` : 'favorite_guest'
  } catch (e) {
    console.error('获取用户信息失败:', e)
    return 'favorite_guest'
  }
}

const getInitialState = () => {
  try {
    const key = getStorageKey()
    return {
      items: JSON.parse(localStorage.getItem(key) || '[]')
    }
  } catch (e) {
    console.error('解析收藏数据失败:', e)
    return { items: [] }
  }
}

export default {
  namespaced: true,

  state: () => getInitialState(),

  getters: {
    favoriteIds: (state) => state.items.map(item => item.id),
    isFavorite: (state) => (productId) => {
      return state.items.some(item => item.id === productId)
    },
    favoriteCount: (state) => state.items.length
  },

  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    ADD_ITEM(state, item) {
      state.items.unshift(item)
    },
    REMOVE_ITEM(state, index) {
      state.items.splice(index, 1)
    },
    CLEAR_ALL(state) {
      state.items = []
    }
  },

  actions: {
    toggleFavorite({ state, getters, commit, dispatch }, product) {
      const index = state.items.findIndex(item => item.id === product.id)
      const isAdding = index === -1
      if (index > -1) {
        commit('REMOVE_ITEM', index)
      } else {
        commit('ADD_ITEM', {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          sales: product.sales,
          addTime: Date.now()
        })
      }
      dispatch('saveToStorage')
      return isAdding
    },

    removeFavorite({ state, commit, dispatch }, productId) {
      const index = state.items.findIndex(item => item.id === productId)
      if (index > -1) {
        commit('REMOVE_ITEM', index)
        dispatch('saveToStorage')
      }
    },

    clearAll({ commit, dispatch }) {
      commit('CLEAR_ALL')
      dispatch('saveToStorage')
    },

    saveToStorage({ state }) {
      const key = getStorageKey()
      localStorage.setItem(key, JSON.stringify(state.items))
    },

    loadFavorites({ commit }) {
      try {
        const key = getStorageKey()
        const items = JSON.parse(localStorage.getItem(key) || '[]')
        commit('SET_ITEMS', items)
      } catch (e) {
        console.error('加载收藏数据失败:', e)
        commit('SET_ITEMS', [])
      }
    }
  }
}
