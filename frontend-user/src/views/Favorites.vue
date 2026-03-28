<template>
  <div class="favorites-page">
    <NavBar title="我的收藏" />
    
    <div v-if="!isLoggedIn" class="empty-state">
      <el-icon :size="48"><WarningFilled /></el-icon>
      <span>请先登录</span>
      <el-button type="primary" @click="goLogin">立即登录</el-button>
    </div>
    
    <template v-else>
      <div v-if="userFavorites.length === 0" class="empty-state">
        <el-icon :size="48"><Star /></el-icon>
        <span>暂无收藏商品</span>
      </div>
      
      <div v-else class="favorites-list">
        <div 
          v-for="item in userFavorites" 
          :key="item.id" 
          class="favorite-item card"
          @click="goToDetail(item.id)"
        >
          <div class="item-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="item-info">
            <h3 class="item-name">{{ item.name }}</h3>
            <div class="item-price">
              <span class="current-price">¥{{ item.price }}</span>
              <span v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
            </div>
            <div class="item-actions">
              <el-button 
                size="small" 
                type="danger" 
                text 
                @click.stop="handleRemoveFavorite(item.id)"
              >
                取消收藏
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, WarningFilled } from '@element-plus/icons-vue'
import { useUserStore, useFavoriteStore } from '@/store/helpers'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const { isLoggedIn } = useUserStore()
const { userFavorites, removeFavorite } = useFavoriteStore()

const goLogin = () => {
  router.push('/login')
}

const goToDetail = (productId) => {
  router.push(`/product/${productId}`)
}

const handleRemoveFavorite = (productId) => {
  removeFavorite.value(productId)
  ElMessage.success('已取消收藏')
}
</script>

<style lang="scss" scoped>
.favorites-page {
  padding-bottom: 70px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: $text-secondary;
  gap: $spacing-md;
}

.favorites-list {
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.favorite-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  border-radius: $radius-sm;
  background-color: $bg-white;
  cursor: pointer;
  
  &:hover {
    background-color: $bg-gray-light;
  }
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: $radius-sm;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: $font-md;
  color: $text-primary;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price {
  margin-top: $spacing-sm;
  
  .current-price {
    font-size: $font-lg;
    color: $primary-color;
    font-weight: 500;
  }
  
  .original-price {
    font-size: $font-sm;
    color: $text-secondary;
    text-decoration: line-through;
    margin-left: $spacing-sm;
  }
}

.item-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
