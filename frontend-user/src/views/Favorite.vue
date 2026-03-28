<template>
  <div class="favorite-page">
    <NavBar v-if="isLoggedIn" title="我的收藏" :show-back="true" />
    
    <!-- 未登录 -->
    <NotLoggedIn v-if="!isLoggedIn" />
    
    <!-- 空收藏 -->
    <div v-else-if="!items || items.length === 0" class="empty-favorite">
      <el-icon :size="64"><StarFilled /></el-icon>
      <p>收藏夹空空如也</p>
      <el-button type="primary" @click="goHome">去逛逛</el-button>
    </div>
    
    <!-- 收藏列表 -->
    <div v-else class="favorite-content">
      <div class="favorite-list">
        <ProductCard 
          v-for="item in items" 
          :key="item.productId" 
          :product="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { StarFilled } from '@element-plus/icons-vue'
import { useFavoriteStore, useUserStore } from '@/store/helpers'
import NavBar from '@/components/NavBar.vue'
import NotLoggedIn from '@/components/NotLoggedIn.vue'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()
const { items } = useFavoriteStore()
const { isLoggedIn } = useUserStore()

const goHome = () => router.push('/')
</script>

<style lang="scss" scoped>
.favorite-page {
  min-height: 100vh;
  padding-bottom: 70px;
}

.empty-favorite {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: $text-secondary;
  gap: $spacing-md;
  
  p {
    font-size: $font-md;
  }
}

.favorite-content {
  padding: $spacing-md;
}

.favorite-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}
</style>
