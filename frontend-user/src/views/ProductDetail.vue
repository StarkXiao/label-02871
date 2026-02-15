<template>
  <div class="detail-page">
    <NavBar title="商品详情" />
    
    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>
    
    <template v-else-if="product">
      <!-- 商品图片轮播 -->
      <div class="product-gallery">
        <el-carousel height="300px" indicator-position="outside">
          <el-carousel-item v-for="(img, index) in allImages" :key="index">
            <img :src="img" :alt="product.name" class="gallery-img" />
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <!-- 商品信息 -->
      <div class="product-info card">
        <div class="price-row">
          <span class="price">{{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
          <span class="sales">已售{{ product.sales }}件</span>
        </div>
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-desc">{{ product.description }}</p>
      </div>
      
      <!-- 规格选择 -->
      <div v-if="product.specs?.length" class="specs-section card">
        <h3 class="section-title">规格选择</h3>
        <div v-for="spec in product.specs" :key="spec.name" class="spec-group">
          <span class="spec-label">{{ spec.name }}</span>
          <div class="spec-values">
            <span 
              v-for="value in spec.values" 
              :key="value"
              class="spec-value"
              :class="{ active: selectedSpecs[spec.name] === value }"
              @click="selectSpec(spec.name, value)"
            >
              {{ value }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 商品详情 -->
      <div class="detail-section card">
        <h3 class="section-title">商品详情</h3>
        <div class="detail-content">
          <p>{{ product.description }}</p>
          <img :src="product.image" :alt="product.name" class="detail-img" />
        </div>
      </div>
      
      <!-- 底部操作栏 -->
      <div class="action-bar">
        <div class="action-icons">
          <div class="action-icon" @click="goCart">
            <el-badge :value="totalCount" :hidden="totalCount === 0">
              <el-icon :size="20"><ShoppingCart /></el-icon>
            </el-badge>
            <span>购物车</span>
          </div>
        </div>
        <div class="action-buttons">
          <el-button @click="addToCart">加入购物车</el-button>
          <el-button type="primary" @click="buyNow">立即购买</el-button>
        </div>
      </div>
    </template>
    
    <div v-else class="empty-state">
      <el-icon :size="48"><WarningFilled /></el-icon>
      <span>商品不存在</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, HomeFilled, ShoppingCart, WarningFilled } from '@element-plus/icons-vue'
import { productApi } from '@/api'
import { useCartStore, useUserStore } from '@/store/helpers'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const { totalCount, addItem } = useCartStore()
const { isLoggedIn } = useUserStore()

const product = ref(null)
const loading = ref(true)
const selectedSpecs = ref({})

const allImages = computed(() => {
  if (!product.value) return []
  return [product.value.image, ...(product.value.images || [])]
})

onMounted(async () => {
  const res = await productApi.getDetail(route.params.id)
  if (res.code === 200) {
    product.value = res.data
    // 默认选中第一个规格
    product.value.specs?.forEach(spec => {
      selectedSpecs.value[spec.name] = spec.values[0]
    })
  }
  loading.value = false
})

const selectSpec = (name, value) => {
  selectedSpecs.value[name] = value
}

const goHome = () => router.push('/')
const goCart = () => router.push('/cart')

const checkSpecs = () => {
  if (!product.value.specs?.length) return true
  const allSelected = product.value.specs.every(spec => selectedSpecs.value[spec.name])
  if (!allSelected) {
    ElMessage.warning('请选择完整规格')
    return false
  }
  return true
}

const addToCart = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  if (!checkSpecs()) return
  addItem(product.value, 1, { ...selectedSpecs.value })
  ElMessage.success('已加入购物车')
}

const buyNow = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  if (!checkSpecs()) return
  // 跳转到确认订单页
  router.push({
    path: '/checkout',
    query: {
      productId: product.value.id,
      specs: JSON.stringify(selectedSpecs.value),
      quantity: 1
    }
  })
}
</script>

<style lang="scss" scoped>
.detail-page {
  padding-bottom: 70px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: $text-secondary;
  gap: $spacing-md;
}

.product-gallery {
  background-color: $bg-white;
  
  .gallery-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.product-info {
  margin: $spacing-md;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
  
  .price {
    font-size: $font-xxl;
  }
  
  .original-price {
    font-size: $font-sm;
    color: $text-placeholder;
    text-decoration: line-through;
  }
  
  .sales {
    margin-left: auto;
    font-size: $font-sm;
    color: $text-secondary;
  }
}

.product-name {
  font-size: $font-lg;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.5;
  margin-bottom: $spacing-sm;
}

.product-desc {
  font-size: $font-md;
  color: $text-secondary;
  line-height: 1.6;
}

.specs-section,
.detail-section {
  margin: $spacing-md;
}

.section-title {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

.spec-group {
  margin-bottom: $spacing-md;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.spec-label {
  display: block;
  font-size: $font-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.spec-values {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.spec-value {
  padding: $spacing-xs $spacing-md;
  font-size: $font-sm;
  color: $text-regular;
  background-color: $bg-gray;
  border: 1px solid $border-color;
  border-radius: $radius-round;
  cursor: pointer;
  transition: all 0.2s;
  
  &.active {
    color: $primary-color;
    background-color: rgba($primary-color, 0.1);
    border-color: $primary-color;
  }
}

.detail-content {
  font-size: $font-md;
  color: $text-regular;
  line-height: 1.8;
  
  .detail-img {
    width: 100%;
    margin-top: $spacing-md;
    border-radius: $radius-sm;
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 $spacing-md;
  background-color: $bg-white;
  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.06);
}

.action-icons {
  display: flex;
  gap: $spacing-md;
}

.action-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: $text-secondary;
  cursor: pointer;
  min-width: 44px;
  
  span {
    font-size: $font-xs;
  }
}

.action-buttons {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: $spacing-sm;
  
  .el-button {
    flex: 1;
    max-width: 120px;
  }
}
</style>
