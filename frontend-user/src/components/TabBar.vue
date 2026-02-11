<template>
  <div class="tabbar">
    <router-link 
      v-for="item in tabs" 
      :key="item.path" 
      :to="item.path" 
      class="tabbar-item"
      :class="{ active: isActive(item.path) }"
    >
      <el-icon :size="22">
        <component :is="item.icon" />
      </el-icon>
      <span class="tabbar-label">{{ item.label }}</span>
      <span v-if="item.badge && item.badge > 0" class="tabbar-badge">
        {{ item.badge > 99 ? '99+' : item.badge }}
      </span>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useUserStore } from '@/store/user'
import { HomeFilled, Grid, ShoppingCart, User } from '@element-plus/icons-vue'

const route = useRoute()
const cartStore = useCartStore()
const userStore = useUserStore()

const tabs = computed(() => [
  { path: '/', label: '首页', icon: HomeFilled },
  { path: '/category', label: '分类', icon: Grid },
  { path: '/cart', label: '购物车', icon: ShoppingCart, badge: userStore.isLoggedIn ? cartStore.totalCount : 0 },
  { path: '/profile', label: '我的', icon: User }
])

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $tabbar-height;
  background-color: $bg-white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: $text-secondary;
  position: relative;
  transition: color 0.2s;
  
  &.active {
    color: $primary-color;
  }
}

.tabbar-label {
  font-size: $font-xs;
  margin-top: 2px;
}

.tabbar-badge {
  position: absolute;
  top: 4px;
  right: 50%;
  transform: translateX(16px);
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  color: #fff;
  background-color: $danger-color;
  border-radius: 8px;
}
</style>
