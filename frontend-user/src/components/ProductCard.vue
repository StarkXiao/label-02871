<template>
  <div class="product-card">
    <div class="product-image" @click="goDetail">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <span v-if="product.isNew" class="tag tag-new">新品</span>
      <span v-if="product.isHot" class="tag tag-hot">热卖</span>
      <div class="favorite-btn" @click.stop="handleFavorite">
        <el-icon :size="16" :class="{ 'is-favorite': isFavorite(product.id) }">
          <component :is="isFavorite(product.id) ? StarFilled : Star" />
        </el-icon>
      </div>
    </div>
    <div class="product-info" @click="goDetail">
      <h3 class="product-name ellipsis-2">{{ product.name }}</h3>
      <div class="product-price">
        <span class="price">{{ product.price }}</span>
        <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
      </div>
      <div class="product-sales">已售 {{ product.sales }}</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { useFavoriteStore, useUserStore } from '@/store/helpers'

const props = defineProps({
  product: { type: Object, required: true }
})

const router = useRouter()
const { isFavorite, toggleFavorite } = useFavoriteStore()
const { isLoggedIn } = useUserStore()

const goDetail = () => {
  router.push(`/product/${props.product.id}`)
}

const handleFavorite = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  const isAdding = toggleFavorite(props.product)
  ElMessage.success(isAdding ? '已添加收藏' : '已取消收藏')
}
</script>

<style lang="scss" scoped>
.product-card {
  background-color: $bg-white;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background-color: $bg-gray;
  cursor: pointer;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .favorite-btn {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &:active {
      transform: scale(0.9);
    }
    
    .is-favorite {
      color: $danger-color;
      animation: favoriteBounce 0.3s ease;
    }
  }
  
  @keyframes favoriteBounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }
}

.tag {
  position: absolute;
  top: $spacing-sm;
  left: $spacing-sm;
  padding: 2px 6px;
  font-size: $font-xs;
  color: #fff;
  border-radius: $radius-sm;
  
  &.tag-new {
    background-color: $primary-color;
  }
  
  &.tag-hot {
    background-color: $danger-color;
  }
}

.product-info {
  padding: $spacing-sm;
}

.product-name {
  font-size: $font-md;
  font-weight: 400;
  color: $text-primary;
  line-height: 1.4;
  height: 2.8em;
  margin-bottom: $spacing-xs;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: $spacing-xs;
  margin-bottom: $spacing-xs;
  
  .price {
    font-size: $font-lg;
  }
  
  .original-price {
    font-size: $font-sm;
    color: $text-placeholder;
    text-decoration: line-through;
  }
}

.product-sales {
  font-size: $font-xs;
  color: $text-secondary;
}
</style>
