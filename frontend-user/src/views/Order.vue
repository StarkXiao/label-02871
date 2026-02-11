<template>
  <div class="order-page">
    <NavBar title="我的订单" />
    
    <!-- 订单状态Tab -->
    <div class="order-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>
    
    <!-- 订单列表 -->
    <div class="order-content">
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <el-icon :size="48"><Document /></el-icon>
        <span>暂无订单</span>
      </div>
      
      <div v-else class="order-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-item card">
          <div class="order-header">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span class="order-status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </span>
          </div>
          
          <div class="order-products">
            <div v-for="product in order.products" :key="product.id" class="product-item">
              <img :src="product.image" :alt="product.name" class="product-img" />
              <div class="product-info">
                <h4 class="product-name ellipsis">{{ product.name }}</h4>
                <div class="product-specs">{{ product.specs }}</div>
                <div class="product-price">
                  <span class="price">{{ product.price }}</span>
                  <span class="quantity">x{{ product.quantity }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-footer">
            <div class="order-total">
              共{{ order.totalQuantity }}件商品，合计：
              <span class="total-price price">{{ order.totalAmount.toFixed(2) }}</span>
            </div>
            <div class="order-actions">
              <el-button v-if="order.status === 1" size="small" @click="handleCancel(order)">取消订单</el-button>
              <el-button v-if="order.status === 1" size="small" type="primary" @click="handlePay(order)">立即支付</el-button>
              <el-button v-if="order.status === 2" size="small" @click="handleRefund(order)">申请退款</el-button>
              <el-button v-if="order.status === 2" size="small" type="primary" @click="handleConfirm(order)">确认收货</el-button>
              <el-button v-if="order.status === 3" size="small" @click="handleRebuy(order)">再次购买</el-button>
              <el-button v-if="order.status === 4" size="small" disabled>退款中</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { useCartStore } from '@/store/cart'
import { useOrderStore } from '@/store/order'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const tabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '待收货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '退款/售后', value: 'refund' }
]

const activeTab = ref('all')

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orderStore.orderList
  const statusMap = { pending: 1, shipped: 2, completed: 3, refund: 4 }
  return orderStore.orderList.filter(o => o.status === statusMap[activeTab.value])
})

const getStatusText = (status) => {
  const map = { 1: '待付款', 2: '待收货', 3: '已完成', 4: '退款中' }
  return map[status] || '未知'
}

const getStatusClass = (status) => {
  const map = { 1: 'pending', 2: 'shipped', 3: 'completed', 4: 'refund' }
  return map[status] || ''
}

const handlePay = (order) => {
  // 保存商品列表到 sessionStorage
  const items = order.products.map(p => ({
    id: p.id,
    productId: p.id,
    name: p.name,
    image: p.image,
    price: p.price,
    quantity: p.quantity,
    specs: {}
  }))
  sessionStorage.setItem('pay_items', JSON.stringify(items))
  sessionStorage.setItem('pay_orderId', String(order.id))
  
  router.push({
    path: '/pay',
    query: {
      orderNo: order.orderNo,
      amount: order.totalAmount.toFixed(2)
    }
  })
}

const handleCancel = async (order) => {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '取消订单', {
      confirmButtonText: '确定取消',
      cancelButtonText: '再想想',
      type: 'warning'
    })
    orderStore.removeOrder(order.id)
    ElMessage.success('订单已取消')
  } catch {}
}

const handleRefund = async (order) => {
  try {
    await ElMessageBox.confirm('确定要申请退款吗？', '申请退款', {
      confirmButtonText: '确定申请',
      cancelButtonText: '取消',
      type: 'warning'
    })
    orderStore.updateOrderStatus(order.id, 4)
    ElMessage.success('退款申请已提交')
  } catch {}
}

const handleConfirm = async (order) => {
  try {
    await ElMessageBox.confirm('确认已收到商品？', '确认收货', {
      confirmButtonText: '确认收货',
      cancelButtonText: '取消'
    })
    orderStore.updateOrderStatus(order.id, 3)
    ElMessage.success('已确认收货')
  } catch {}
}

const handleRebuy = (order) => {
  order.products.forEach(p => {
    const specsObj = {}
    if (p.specs) {
      p.specs.split(' / ').forEach((spec, index) => {
        specsObj[`规格${index + 1}`] = spec
      })
    }
    
    cartStore.addItem({
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.price,
      stock: 99
    }, p.quantity, specsObj)
  })
  ElMessage.success('已加入购物车')
  router.push('/cart')
}

onMounted(() => {
  orderStore.loadOrders()
  if (route.query.status) {
    activeTab.value = route.query.status
  }
})
</script>

<style lang="scss" scoped>
.order-page {
  min-height: 100vh;
}

.order-tabs {
  display: flex;
  background-color: $bg-white;
  border-bottom: 1px solid $border-light;
}

.tab-item {
  flex: 1;
  padding: 12px 8px;
  text-align: center;
  font-size: $font-md;
  color: $text-regular;
  cursor: pointer;
  position: relative;
  
  &.active {
    color: $primary-color;
    font-weight: 500;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 2px;
      background-color: $primary-color;
      border-radius: 1px;
    }
  }
}

.order-content {
  padding: $spacing-md;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: $text-secondary;
  gap: $spacing-sm;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.order-item {
  padding: $spacing-md;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid $border-light;
}

.order-no {
  font-size: $font-sm;
  color: $text-secondary;
}

.order-status {
  font-size: $font-sm;
  font-weight: 500;
  
  &.pending { color: $warning-color; }
  &.shipped { color: $primary-color; }
  &.completed { color: $success-color; }
  &.refund { color: $info-color; }
}

.order-products {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.product-item {
  display: flex;
  gap: $spacing-md;
}

.product-img {
  width: 60px;
  height: 60px;
  border-radius: $radius-sm;
  object-fit: cover;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: $font-md;
  font-weight: 400;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.product-specs {
  font-size: $font-xs;
  color: $text-secondary;
  margin-bottom: $spacing-xs;
}

.product-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .price { font-size: $font-md; }
  .quantity { font-size: $font-sm; color: $text-secondary; }
}

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: $spacing-md;
  padding-top: $spacing-sm;
  border-top: 1px solid $border-light;
}

.order-total {
  font-size: $font-sm;
  color: $text-secondary;
  
  .total-price { font-size: $font-lg; }
}

.order-actions {
  display: flex;
  gap: $spacing-sm;
}
</style>
