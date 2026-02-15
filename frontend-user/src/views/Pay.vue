<template>
  <div class="pay-page">
    <NavBar title="订单支付" />
    
    <div class="pay-content">
      <!-- 订单信息 -->
      <div class="order-info card">
        <div class="order-header">
          <span class="order-label">订单号</span>
          <span class="order-no">{{ orderNo }}</span>
        </div>
        <div class="product-list">
          <div v-for="item in orderItems" :key="item.id" class="product-item">
            <img :src="item.image" :alt="item.name" class="product-img" />
            <div class="product-info">
              <h3 class="product-name ellipsis">{{ item.name }}</h3>
              <div class="product-specs">{{ formatItemSpecs(item.specs) }} x{{ item.quantity }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 支付金额 -->
      <div class="amount-section card">
        <div class="amount-label">支付金额</div>
        <div class="amount-value">
          <span class="currency">¥</span>
          <span class="amount">{{ amount }}</span>
        </div>
      </div>
      
      <!-- 支付方式 -->
      <div class="payment-section card">
        <div class="section-title">选择支付方式</div>
        <div class="payment-list">
          <div 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="payment-item"
            :class="{ active: selectedMethod === method.id }"
            @click="selectedMethod = method.id"
          >
            <el-icon :size="24" :style="{ color: method.color }">
              <component :is="method.icon" />
            </el-icon>
            <span class="payment-name">{{ method.name }}</span>
            <el-icon v-if="selectedMethod === method.id" class="check-icon"><Check /></el-icon>
          </div>
        </div>
      </div>
      
      <!-- 支付提示 -->
      <div class="pay-tips">
        <p>请在 <span class="highlight">30分钟</span> 内完成支付，超时订单将自动取消</p>
      </div>
    </div>
    
    <!-- 底部支付按钮 -->
    <div class="pay-bar">
      <el-button type="primary" size="large"  :loading="paying" @click="handlePay">
        立即支付 ¥{{ amount }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CreditCard, Wallet, Check } from '@element-plus/icons-vue'
import { useOrderStore } from '@/store/helpers'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const { updateOrderStatus } = useOrderStore()

const orderNo = ref('')
const amount = ref('0.00')
const orderId = ref(null)
const orderItems = ref([])
const selectedMethod = ref('alipay')
const paying = ref(false)

const paymentMethods = [
  { id: 'alipay', name: '支付宝', icon: Wallet, color: '#1677FF' },
  { id: 'wechat', name: '微信支付', icon: CreditCard, color: '#07C160' }
]

const formatItemSpecs = (specs) => {
  if (!specs || Object.keys(specs).length === 0) return ''
  return Object.entries(specs).map(([k, v]) => `${k}: ${v}`).join(', ')
}

onMounted(() => {
  orderNo.value = route.query.orderNo || ''
  amount.value = route.query.amount || '0.00'
  
  // 从 sessionStorage 获取商品列表和订单 ID
  const savedItems = sessionStorage.getItem('pay_items')
  if (savedItems) {
    try {
      orderItems.value = JSON.parse(savedItems)
    } catch {}
    sessionStorage.removeItem('pay_items')
  }
  
  const savedOrderId = sessionStorage.getItem('pay_orderId')
  if (savedOrderId) {
    orderId.value = Number(savedOrderId)
    sessionStorage.removeItem('pay_orderId')
  }
})

const handlePay = async () => {
  paying.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  paying.value = false
  
  // 更新订单状态为待收货
  if (orderId.value) {
    updateOrderStatus(orderId.value, 2)
  }
  
  await ElMessageBox.alert('支付成功！感谢您的购买', '支付完成', {
    confirmButtonText: '查看订单',
    type: 'success',
    showClose: false
  })
  
  ElMessage.success('支付成功')
  router.replace('/order?status=shipped')
}
</script>

<style lang="scss" scoped>
.pay-page {
  min-height: 100vh;
  padding-bottom: 80px;
  background-color: $bg-color;
}

.pay-content {
  padding: $spacing-md;
}

.card {
  margin-bottom: $spacing-md;
}

.order-info {
  .order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: $spacing-md;
    margin-bottom: $spacing-md;
    border-bottom: 1px solid $border-light;
    
    .order-label {
      color: $text-secondary;
      font-size: $font-sm;
    }
    
    .order-no {
      font-size: $font-sm;
      color: $text-primary;
    }
  }
  
  .product-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  .product-item {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-xs 0;
    border-bottom: 1px solid $border-light;
    
    &:last-child { border-bottom: none; }
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
    display: flex;
    flex-direction: column;
    justify-content: center;
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
  }
}

.amount-section {
  text-align: center;
  padding: $spacing-xl $spacing-md;
  
  .amount-label {
    font-size: $font-sm;
    color: $text-secondary;
    margin-bottom: $spacing-md;
  }
  
  .amount-value {
    color: $price-color;
    
    .currency {
      font-size: $font-xl;
      font-weight: 500;
    }
    
    .amount {
      font-size: 36px;
      font-weight: 600;
    }
  }
}

.payment-section {
  .section-title {
    font-size: $font-md;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: $spacing-md;
  }
  
  .payment-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  .payment-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md;
    background-color: $bg-gray;
    border-radius: $radius-md;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    
    &.active {
      background-color: rgba($primary-color, 0.05);
      border-color: $primary-color;
    }
    
    .payment-name {
      flex: 1;
      font-size: $font-md;
      color: $text-primary;
    }
    
    .check-icon {
      color: $primary-color;
    }
  }
}

.pay-tips {
  text-align: center;
  padding: $spacing-lg;
  
  p {
    font-size: $font-sm;
    color: $text-secondary;
    
    .highlight {
      color: $price-color;
      font-weight: 500;
    }
  }
}

.pay-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-md;
  background-color: $bg-white;
  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.06);
  
  .el-button {
    width: 100%;
    height: 48px;
    font-size: $font-lg;
  }
}
</style>
