import { userApi } from '@/api'

// 安全解析 localStorage 中的用户信息
const parseStoredUser = () => {
  try {
    const stored = localStorage.getItem('user')
    if (!stored || stored === 'null' || stored === 'undefined') {
      return null
    }
    return JSON.parse(stored)
  } catch (e) {
    console.error('解析用户信息失败:', e)
    localStorage.removeItem('user')
    return null
  }
}

// 验证 token 和用户信息的一致性
const getInitialState = () => {
  const user = parseStoredUser()
  const token = localStorage.getItem('token') || ''
  
  // 如果有 token 但没有用户信息，或者有用户信息但没有 token，清除数据
  if ((token && !user) || (!token && user)) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return { user: null, token: '' }
  }
  
  return { user, token }
}

export default {
  namespaced: true,
  
  state: () => getInitialState(),
  
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    userInfo: (state) => state.user
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    CLEAR_USER(state) {
      state.user = null
      state.token = ''
    }
  },
  
  actions: {
    async login({ commit, dispatch }, { email, password }) {
      const res = await userApi.login(email, password)
      if (res.code === 200) {
        commit('SET_USER', res.data.user)
        commit('SET_TOKEN', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.token)
        // 加载用户地址、订单和收藏
        dispatch('address/loadAddresses', null, { root: true })
        dispatch('order/loadOrders', null, { root: true })
        dispatch('favorite/loadFavorites', null, { root: true })
      }
      return res
    },
    
    async register({ commit, dispatch }, data) {
      const res = await userApi.register(data)
      if (res.code === 200) {
        commit('SET_USER', res.data.user)
        commit('SET_TOKEN', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.token)
        // 加载用户地址、订单和收藏
        dispatch('address/loadAddresses', null, { root: true })
        dispatch('order/loadOrders', null, { root: true })
        dispatch('favorite/loadFavorites', null, { root: true })
      }
      return res
    },
    
    logout({ commit, dispatch }) {
      commit('CLEAR_USER')
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      // 清空购物车
      dispatch('cart/clearAll', null, { root: true })
      // 清空地址
      dispatch('address/clearAddresses', null, { root: true })
      // 清空订单
      dispatch('order/clearOrders', null, { root: true })
      // 清空收藏
      dispatch('favorite/clearAll', null, { root: true })
    }
  }
}
