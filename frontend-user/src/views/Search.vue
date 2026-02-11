<template>
  <div class="search-page">
    <NavBar :show-back="true">
      <template #title>
        <div class="search-input-wrapper">
          <el-input 
            ref="searchInputRef"
            v-model="keyword" 
            placeholder="搜索商品"
            :prefix-icon="Search"
            clearable
            @keyup.enter="handleSearch"
          />
        </div>
      </template>
      <template #right>
        <span class="search-btn" @click="handleSearch">搜索</span>
      </template>
    </NavBar>
    
    <!-- 搜索历史 -->
    <div v-if="!hasSearched && searchHistory.length" class="history-section">
      <div class="section-header">
        <span>搜索历史</span>
        <el-icon @click="clearHistory"><Delete /></el-icon>
      </div>
      <div class="history-tags">
        <el-tag 
          v-for="item in searchHistory" 
          :key="item" 
          @click="searchByHistory(item)"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>
    
    <!-- 搜索结果 -->
    <div v-if="hasSearched" class="search-result">
      <div v-if="loading" class="loading-state">
        <el-icon class="is-loading" :size="24"><Loading /></el-icon>
        <span>搜索中...</span>
      </div>
      
      <div v-else-if="products.length === 0" class="empty-state">
        <el-icon :size="48"><Search /></el-icon>
        <span>未找到相关商品</span>
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
import { ref, onMounted, nextTick } from 'vue'
import { Search, Delete, Loading } from '@element-plus/icons-vue'
import { productApi } from '@/api'
import NavBar from '@/components/NavBar.vue'
import ProductCard from '@/components/ProductCard.vue'

const keyword = ref('')
const products = ref([])
const loading = ref(false)
const hasSearched = ref(false)
const searchHistory = ref([])
const searchInputRef = ref()

const HISTORY_KEY = 'search_history'

onMounted(() => {
  const history = localStorage.getItem(HISTORY_KEY)
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
  // 自动聚焦搜索框
  nextTick(() => {
    searchInputRef.value?.focus()
  })
})

const handleSearch = async () => {
  if (!keyword.value.trim()) return
  
  // 保存搜索历史
  const newHistory = [keyword.value, ...searchHistory.value.filter(h => h !== keyword.value)].slice(0, 10)
  searchHistory.value = newHistory
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  
  hasSearched.value = true
  loading.value = true
  const res = await productApi.getList({ keyword: keyword.value })
  products.value = res.data
  loading.value = false
}

const searchByHistory = (item) => {
  keyword.value = item
  handleSearch()
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem(HISTORY_KEY)
}
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
}

.search-input-wrapper {
  flex: 1;
  
  :deep(.el-input__wrapper) {
    background-color: $bg-gray;
  }
}

.search-btn {
  font-size: $font-md;
  color: $primary-color;
  cursor: pointer;
}

.history-section {
  padding: $spacing-md;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
  font-size: $font-md;
  color: $text-primary;
  
  .el-icon {
    color: $text-secondary;
    cursor: pointer;
  }
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  
  .el-tag {
    cursor: pointer;
  }
}

.search-result {
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
