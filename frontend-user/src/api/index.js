// API层 - 模拟接口调用
import { products, categories, banners, users, addresses } from '@/mock/data'

// 模拟网络延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 商品相关API
export const productApi = {
  async getList(params = {}) {
    await delay()
    let result = [...products]
    
    if (params.categoryId) {
      result = result.filter(p => p.categoryId === params.categoryId)
    }
    if (params.keyword) {
      result = result.filter(p => p.name.includes(params.keyword))
    }
    if (params.isHot) {
      result = result.filter(p => p.isHot)
    }
    if (params.isNew) {
      result = result.filter(p => p.isNew)
    }
    
    return { code: 200, data: result, message: 'success' }
  },
  
  async getDetail(id) {
    await delay()
    const product = products.find(p => p.id === Number(id))
    if (!product) {
      return { code: 404, data: null, message: '商品不存在' }
    }
    return { code: 200, data: product, message: 'success' }
  },
  
  async getRecommend() {
    await delay()
    const result = products.filter(p => p.isHot).slice(0, 4)
    return { code: 200, data: result, message: 'success' }
  }
}

// 分类相关API
export const categoryApi = {
  async getList() {
    await delay()
    return { code: 200, data: categories, message: 'success' }
  }
}

// 轮播图API
export const bannerApi = {
  async getList() {
    await delay()
    return { code: 200, data: banners, message: 'success' }
  }
}

// 用户相关API
export const userApi = {
  async login(email, password) {
    await delay(500)
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) {
      return { code: 401, data: null, message: '邮箱或密码错误' }
    }
    const { password: _, ...userInfo } = user
    return { code: 200, data: { user: userInfo, token: 'mock_token_' + user.id }, message: '登录成功' }
  },
  
  async register(data) {
    await delay(500)
    const exists = users.find(u => u.email === data.email)
    if (exists) {
      return { code: 400, data: null, message: '该邮箱已注册' }
    }
    const newUser = {
      id: users.length + 1,
      email: data.email,
      password: data.password,
      nickname: data.nickname || '新用户',
      avatar: 'https://picsum.photos/seed/newuser/100/100',
      phone: ''
    }
    users.push(newUser)
    const { password: _, ...userInfo } = newUser
    return { code: 200, data: { user: userInfo, token: 'mock_token_' + newUser.id }, message: '注册成功' }
  }
}

// 地址相关API
export const addressApi = {
  async getList(userId) {
    await delay()
    const result = addresses.filter(a => a.userId === userId)
    return { code: 200, data: result, message: 'success' }
  },
  
  async add(data) {
    await delay()
    const newAddress = { id: addresses.length + 1, ...data }
    addresses.push(newAddress)
    return { code: 200, data: newAddress, message: '添加成功' }
  },
  
  async update(id, data) {
    await delay()
    const index = addresses.findIndex(a => a.id === id)
    if (index === -1) {
      return { code: 404, data: null, message: '地址不存在' }
    }
    addresses[index] = { ...addresses[index], ...data }
    return { code: 200, data: addresses[index], message: '更新成功' }
  },
  
  async remove(id) {
    await delay()
    const index = addresses.findIndex(a => a.id === id)
    if (index === -1) {
      return { code: 404, data: null, message: '地址不存在' }
    }
    addresses.splice(index, 1)
    return { code: 200, data: null, message: '删除成功' }
  }
}
