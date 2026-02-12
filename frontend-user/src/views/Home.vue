<template>
  <div class="home-page">
    <!-- 搜索栏 -->
    <div class="search-bar" @click="goSearch">
      <el-icon><Search /></el-icon>
      <span>搜索商品</span>
    </div>
    
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="140px" :interval="4000" indicator-position="none">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <img :src="banner.image" :alt="'banner'" class="banner-img" @click="handleBannerClick(banner)" />
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 分类导航 -->
    <div class="category-nav card">
      <div 
        v-for="cat in categories.slice(0, 8)" 
        :key="cat.id" 
        class="category-item"
        @click="goCategory(cat.id)"
      >
        <div class="category-icon">
          <el-icon :size="24"><component :is="cat.icon" /></el-icon>
        </div>
        <span class="category-name">{{ cat.name }}</span>
      </div>
    </div>
    
    <!-- 热门推荐 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">热门推荐</h2>
        <span class="section-more" @click="goProductList('hot')">查看更多</span>
      </div>
      <div class="product-grid">
        <ProductCard 
          v-for="product in hotProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
    
    <!-- 新品上市 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">新品上市</h2>
        <span class="section-more" @click="goProductList('new')">查看更多</span>
      </div>
      <div class="product-grid">
        <ProductCard 
          v-for="product in newProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { productApi, categoryApi, bannerApi } from '@/api'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()

const banners = ref([])
const categories = ref([])
const hotProducts = ref([])
const newProducts = ref([])

onMounted(async () => {
  const [bannerRes, categoryRes, hotRes, newRes] = await Promise.all([
    bannerApi.getList(),
    categoryApi.getList(),
    productApi.getList({ isHot: true }),
    productApi.getList({ isNew: true })
  ])
  
  banners.value = bannerRes.data
  categories.value = categoryRes.data
  hotProducts.value = hotRes.data.slice(0, 4)
  newProducts.value = newRes.data.slice(0, 4)
})

const goSearch = () => router.push('/search')
const goCategory = (id) => router.push(id ? `/category?id=${id}` : '/category')
const goProductList = (type) => router.push(`/products?type=${type}`)
const handleBannerClick = (banner) => router.push(banner.link)
</script>

<style lang="scss" scoped>
.home-page {
  padding: $spacing-md;
  padding-top: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  height: 36px;
  padding: 0 $spacing-md;
  margin: $spacing-md 0;
  background-color: $bg-gray;
  border-radius: $radius-round;
  color: $text-placeholder;
  font-size: $font-md;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.banner-section {
  margin-bottom: $spacing-md;
  border-radius: $radius-md;
  overflow: hidden;
  
  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
}

.category-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;
  padding: $spacing-md;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  cursor: pointer;
  
  &:active {
    opacity: 0.7;
  }
}

.category-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $primary-light, $primary-color);
  border-radius: 50%;
  color: #fff;
}

.category-name {
  font-size: $font-xs;
  color: $text-regular;
}

.section {
  margin-top: $spacing-lg;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
}

.section-more {
  font-size: $font-sm;
  color: $text-secondary;
  cursor: pointer;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}
</style>
