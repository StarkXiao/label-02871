<template>
  <div class="cart-page">
    <NavBar v-if="isLoggedIn" title="购物车" :show-back="false" />
    
    <!-- 未登录 -->
    <NotLoggedIn v-if="!isLoggedIn" />
    
    <!-- 空购物车 -->
    <div v-else-if="!items || items.length === 0" class="empty-cart">
      <el-icon :size="64"><ShoppingCart /></el-icon>
      <p>购物车空空如也</p>
      <el-button type="primary" @click="goHome">去逛逛</el-button>
    </div>
    
    <!-- 购物车列表 -->
    <div v-else class="cart-content">
      <div class="cart-list">
        <div v-for="item in items" :key="item.id" class="cart-item">
          <el-checkbox 
            :model-value="item.selected" 
            @change="toggleSelect(item.id)"
          />
          <img :src="item.image" :alt="item.name" class="item-img" @click="goDetail(item.productId)" />
          <div class="item-info">
            <h3 class="item-name ellipsis-2" @click="goDetail(item.productId)">{{ item.name }}</h3>
            <div v-if="item.specs && Object.keys(item.specs).length" class="item-specs">
              {{ formatSpecs(item.specs) }}
            </div>
            <div class="item-bottom">
              <span class="price">{{ item.price }}</span>
              <div class="quantity-control">
                <el-button 
                  size="small" 
                  :icon="Minus" 
                  circle 
                  :disabled="item.quantity <= 1"
                  @click="updateQuantity(item.id, item.quantity - 1)"
                />
                <span class="quantity">{{ item.quantity }}</span>
                <el-button 
                  size="small" 
                  :icon="Plus" 
                  circle 
                  :disabled="item.quantity >= item.stock"
                  @click="updateQuantity(item.id, item.quantity + 1)"
                />
              </div>
            </div>
          </div>
          <el-icon class="delete-btn" @click="handleDelete(item.id)"><Delete /></el-icon>
        </div>
      </div>
      
      <!-- 底部结算栏 -->
      <div class="cart-footer">
        <div class="footer-left">
          <el-checkbox 
            :model-value="isAllSelected" 
            @change="toggleSelectAll"
          >
            全选
          </el-checkbox>
        </div>
        <div class="footer-right">
          <div class="total-info">
            <span>合计：</span>
            <span class="total-price price">{{ (totalPrice || 0).toFixed(2) }}</span>
          </div>
          <el-button 
            type="primary" 
            :disabled="!selectedItems || selectedItems.length === 0"
            @click="handleCheckout"
          >
            结算({{ selectedItems ? selectedItems.length : 0 }})
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ShoppingCart, Minus, Plus, Delete } from '@element-plus/icons-vue'
import { useCartStore, useUserStore } from '@/store/helpers'
import NavBar from '@/components/NavBar.vue'
import NotLoggedIn from '@/components/NotLoggedIn.vue'

const router = useRouter()
const { items, totalPrice, selectedItems, isAllSelected, toggleSelect, updateQuantity, removeItem, toggleSelectAll, clearSelected } = useCartStore()
const { isLoggedIn } = useUserStore()

const formatSpecs = (specs) => {
  return Object.entries(specs).map(([k, v]) => `${k}: ${v}`).join(', ')
}

const goHome = () => router.push('/')
const goDetail = (id) => router.push(`/product/${id}`)

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    removeItem(id)
    ElMessage.success('删除成功')
  } catch {
    // 取消删除
  }
}

const handleCheckout = () => {
  // 跳转到确认订单页，传递购物车选中商品信息
  if (!selectedItems.value || selectedItems.value.length === 0) return
  
  router.push({
    path: '/checkout',
    query: {
      fromCart: 'true'
    }
  })
}
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  padding-bottom: 70px;
  padding: $spacing-md;

}

.empty-cart {
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

.cart-content {
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: $bg-white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  position: relative;
}

.item-img {
  width: 80px;
  height: 80px;
  border-radius: $radius-sm;
  object-fit: cover;
  flex-shrink: 0;
  cursor: pointer;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: $font-md;
  font-weight: 400;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-xs;
  cursor: pointer;
}

.item-specs {
  font-size: $font-xs;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  
  .quantity {
    min-width: 24px;
    text-align: center;
    font-size: $font-md;
  }
}

.delete-btn {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  color: $text-secondary;
  cursor: pointer;
  
  &:hover {
    color: $danger-color;
  }
}

.cart-footer {
  position: fixed;
  bottom: $tabbar-height;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-md;
  background-color: $bg-white;
  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.06);
}

.footer-left {
  display: flex;
  align-items: center;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.total-info {
  font-size: $font-md;
  
  .total-price {
    font-size: $font-xl;
  }
}
</style>
