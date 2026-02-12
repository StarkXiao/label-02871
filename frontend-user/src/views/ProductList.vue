<template>
  <div class="product-list-page">
    <NavBar :title="pageTitle" />
    
    <div class="page-content">
      <div v-if="loading" class="loading-state">
        <el-icon class="is-loading" :size="24"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      
      <div v-else-if="products.length === 0" class="empty-state">
        <el-icon :size="48"><Box /></el-icon>
        <span>暂无商品</span>
      </div>
      
      <div v-else class="product-grid">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loading, Box } from '@element-plus/icons-vue'
import { productApi } from '@/api'
import NavBar from '@/components/NavBar.vue'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()

const products = ref([])
const loading = ref(true)

const pageTitle = computed(() => {
  const type = route.query.type
  if (type === 'hot') return '热门推荐'
  if (type === 'new') return '新品上市'
  return '商品列表'
})

onMounted(async () => {
  const type = route.query.type
  let res
  
  if (type === 'hot') {
    res = await productApi.getList({ isHot: true })
  } else if (type === 'new') {
    res = await productApi.getList({ isNew: true })
  } else {
    res = await productApi.getList()
  }
  
  products.value = res.data
  loading.value = false
})
</script>

<style lang="scss" scoped>
.product-list-page {
  min-height: 100vh;
  background-color: $bg-color;
}

.page-content {
  padding: $spacing-md;
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

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}
</style>
