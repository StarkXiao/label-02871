<template>
  <div class="category-page">
    <NavBar title="商品分类" :show-back="false" />
    
    <div class="category-container">
      <!-- 左侧分类列表 -->
      <div class="category-sidebar">
        <div 
          v-for="cat in categories" 
          :key="cat.id"
          class="sidebar-item"
          :class="{ active: activeCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </div>
      </div>
      
      <!-- 右侧商品列表 -->
      <div class="category-content">
        <div v-if="loading" class="loading-state">
          <el-icon class="is-loading" :size="24"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        
        <div v-else-if="products.length === 0" class="empty-state">
          <el-icon :size="48"><Box /></el-icon>
          <span>暂无商品</span>
        </div>
        
        <div v-else class="product-list">
          <div 
            v-for="product in products" 
            :key="product.id" 
            class="product-item"
            @click="goDetail(product.id)"
          >
            <img :src="product.image" :alt="product.name" class="product-img" />
            <div class="product-info">
              <h3 class="product-name ellipsis-2">{{ product.name }}</h3>
              <div class="product-price">
                <span class="price">{{ product.price }}</span>
                <span class="sales">已售{{ product.sales }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loading, Box } from '@element-plus/icons-vue'
import { categoryApi, productApi } from '@/api'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()

const categories = ref([])
const products = ref([])
const activeCategory = ref(null)
const loading = ref(false)

onMounted(async () => {
  const res = await categoryApi.getList()
  categories.value = res.data
  
  const queryId = route.query.id ? Number(route.query.id) : null
  activeCategory.value = queryId || (categories.value[0]?.id || null)
  
  if (activeCategory.value) {
    loadProducts()
  }
})

watch(() => route.query.id, (newId) => {
  if (newId) {
    activeCategory.value = Number(newId)
    loadProducts()
  }
})

const selectCategory = (id) => {
  activeCategory.value = id
  loadProducts()
}

const loadProducts = async () => {
  loading.value = true
  const res = await productApi.getList({ categoryId: activeCategory.value })
  products.value = res.data
  loading.value = false
}

const goDetail = (id) => router.push(`/product/${id}`)
</script>

<style lang="scss" scoped>
.category-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.category-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.category-sidebar {
  width: 90px;
  background-color: $bg-gray;
  overflow-y: auto;
}

.sidebar-item {
  padding: $spacing-md $spacing-sm;
  font-size: $font-md;
  color: $text-regular;
  text-align: center;
  border-left: 3px solid transparent;
  cursor: pointer;
  
  &.active {
    background-color: $bg-white;
    color: $primary-color;
    border-left-color: $primary-color;
    font-weight: 500;
  }
}

.category-content {
  flex: 1;
  padding: $spacing-md;
  overflow-y: auto;
  background-color: $bg-white;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: $text-secondary;
  gap: $spacing-sm;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.product-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-sm;
  background-color: $bg-white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  cursor: pointer;
  
  &:active {
    background-color: $bg-gray;
  }
}

.product-img {
  width: 80px;
  height: 80px;
  border-radius: $radius-sm;
  object-fit: cover;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.product-name {
  font-size: $font-md;
  font-weight: 400;
  color: $text-primary;
  line-height: 1.4;
}

.product-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .price {
    font-size: $font-lg;
  }
  
  .sales {
    font-size: $font-xs;
    color: $text-secondary;
  }
}
</style>
