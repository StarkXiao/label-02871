// 安全解析 localStorage 中的收藏信息
const parseStoredFavorites = () => {
  try {
    const stored = localStorage.getItem('favorites')
    if (!stored || stored === 'null' || stored === 'undefined') {
      return {}
    }
    return JSON.parse(stored)
  } catch (e) {
    console.error('解析收藏信息失败:', e)
    localStorage.removeItem('favorites')
    return {}
  }
}

// 获取当前用户ID
const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.id || null
  } catch (e) {
    return null
  }
}

export default {
  namespaced: true,

  state: () => ({
    favorites: parseStoredFavorites()
  }),

  getters: {
    // 获取当前用户的收藏列表
    userFavorites: (state) => {
      const userId = getCurrentUserId()
      return userId ? state.favorites[userId] || [] : []
    },

    // 检查商品是否被当前用户收藏
    isFavorited: (state, getters) => (productId) => {
      return getters.userFavorites.some(item => item.id === productId)
    },

    // 当前用户收藏的商品数量
    favoriteCount: (state, getters) => {
      return getters.userFavorites.length
    }
  },

  mutations: {
    SET_FAVORITES(state, favorites) {
      state.favorites = favorites
    }
  },

  actions: {
    // 添加收藏
    addFavorite({ state, commit, dispatch }, product) {
      const userId = getCurrentUserId()
      if (!userId) return

      const favorites = { ...state.favorites }
      if (!favorites[userId]) {
        favorites[userId] = []
      }

      // 检查是否已收藏
      const existIndex = favorites[userId].findIndex(item => item.id === product.id)
      if (existIndex === -1) {
        // 添加收藏
        favorites[userId].push({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          sales: product.sales
        })
        commit('SET_FAVORITES', favorites)
        dispatch('saveToStorage')
        return true
      }
      return false
    },

    // 移除收藏
    removeFavorite({ state, commit, dispatch }, productId) {
      const userId = getCurrentUserId()
      if (!userId) return

      const favorites = { ...state.favorites }
      if (favorites[userId]) {
        const index = favorites[userId].findIndex(item => item.id === productId)
        if (index > -1) {
          favorites[userId].splice(index, 1)
          commit('SET_FAVORITES', favorites)
          dispatch('saveToStorage')
          return true
        }
      }
      return false
    },

    // 切换收藏状态
    toggleFavorite({ state, dispatch }, product) {
      const userId = getCurrentUserId()
      if (!userId) return

      const userFavorites = state.favorites[userId] || []
      const isFavorited = userFavorites.some(item => item.id === product.id)
      
      if (isFavorited) {
        return dispatch('removeFavorite', product.id)
      } else {
        return dispatch('addFavorite', product)
      }
    },

    // 清空当前用户的所有收藏
    clearFavorites({ state, commit, dispatch }) {
      const userId = getCurrentUserId()
      if (!userId) return

      const favorites = { ...state.favorites }
      if (favorites[userId]) {
        favorites[userId] = []
        commit('SET_FAVORITES', favorites)
        dispatch('saveToStorage')
      }
    },

    // 保存到localStorage
    saveToStorage({ state }) {
      localStorage.setItem('favorites', JSON.stringify(state.favorites))
    }
  }
}
