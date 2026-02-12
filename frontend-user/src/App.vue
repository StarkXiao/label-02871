<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['Home', 'Category']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <TabBar v-if="showTabBar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from '@/components/TabBar.vue'

const route = useRoute()

const showTabBar = computed(() => {
  const hiddenRoutes = ['/login', '/register', '/product', '/checkout', '/pay', '/search', '/products', '/address', '/order']
  return !hiddenRoutes.some(path => route.path.startsWith(path))
})
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  background-color: $bg-color;
  padding-bottom: 60px;
}
</style>
