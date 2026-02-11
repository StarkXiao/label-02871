import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import '@/assets/styles/main.scss'

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus, { size: 'default' })

// 初始化：如果用户已登录，加载用户地址
import { useUserStore } from '@/store/user'
import { useAddressStore } from '@/store/address'
import { useOrderStore } from '@/store/order'

const userStore = useUserStore()
if (userStore.isLoggedIn) {
  const addressStore = useAddressStore()
  addressStore.loadAddresses()
  const orderStore = useOrderStore()
  orderStore.loadOrders()
}

app.mount('#app')
