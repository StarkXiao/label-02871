import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/main.scss'

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
app.use(router)
app.use(ElementPlus, { size: 'default' })

// 初始化：如果用户已登录，加载用户地址、订单和收藏
if (store.getters['user/isLoggedIn']) {
  store.dispatch('address/loadAddresses')
  store.dispatch('order/loadOrders')
  store.dispatch('favorite/loadFavorites')
}

app.mount('#app')
