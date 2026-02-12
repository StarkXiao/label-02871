<template>
  <div class="checkout-page">
    <NavBar title="确认订单" />
    
    <!-- 收货地址 -->
    <div class="address-section card" @click="goAddress">
      <div v-if="selectedAddress" class="address-info">
        <div class="address-header">
          <span class="name">{{ selectedAddress.name }}</span>
          <span class="phone">{{ selectedAddress.phone }}</span>
        </div>
        <p class="address-detail">{{ selectedAddress.detail }}</p>
      </div>
      <div v-else class="no-address">
        <el-icon :size="20"><Location /></el-icon>
        <span>请选择收货地址</span>
      </div>
      <el-icon><ArrowRight /></el-icon>
    </div>
    
    <!-- 商品信息 -->
    <div class="product-section card">
      <div v-for="item in orderItems" :key="item.id" class="product-item">
        <img :src="item.image" :alt="item.name" class="product-img" />
        <div class="product-info">
          <h3 class="product-name ellipsis-2">{{ item.name }}</h3>
          <div class="product-specs">{{ formatItemSpecs(item.specs) }}</div>
          <div class="product-price">
            <span class="price">{{ item.price }}</span>
            <span class="quantity">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 订单备注 -->
    <div class="remark-section card">
      <div class="remark-label">订单备注</div>
      <el-input 
        v-model="remark" 
        type="textarea" 
        :rows="2" 
        placeholder="选填，请输入订单备注"
        maxlength="100"
        show-word-limit
      />
    </div>
    
    <!-- 价格明细 -->
    <div class="price-section card">
      <div class="price-row">
        <span>商品金额</span>
        <span>¥{{ totalPrice.toFixed(2) }}</span>
      </div>
      <div class="price-row">
        <span>运费</span>
        <span>¥0.00</span>
      </div>
      <div class="price-row total">
        <span>合计</span>
        <span class="total-price price">{{ totalPrice.toFixed(2) }}</span>
      </div>
    </div>
    
    <!-- 底部提交栏 -->
    <div class="submit-bar">
      <div class="total-info">
        <span>实付款：</span>
        <span class="total-price price">{{ totalPrice.toFixed(2) }}</span>
      </div>
      <el-button type="primary" :loading="submitting" @click="submitOrder">
        提交订单
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Location, ArrowRight } from '@element-plus/icons-vue'
import { productApi } from '@/api'
import { useAddressStore } from '@/store/address'
import { useCartStore } from '@/store/cart'
import { useOrderStore } from '@/store/order'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const addressStore = useAddressStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const orderItems = ref([])
const remark = ref('')
const submitting = ref(false)
const selectedAddressId = ref(null)
const fromCart = ref(false)

// 当前选中的地址
const selectedAddress = computed(() => {
  if (selectedAddressId.value) {
    return addressStore.addressList.find(a => a.id === selectedAddressId.value) || null
  }
  return addressStore.defaultAddress || addressStore.addressList[0] || null
})

const formatItemSpecs = (specs) => {
  if (!specs || Object.keys(specs).length === 0) return ''
  return Object.entries(specs).map(([k, v]) => `${k}: ${v}`).join(', ')
}

const totalPrice = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

onMounted(async () => {
  // 恢复备注
  const savedRemark = sessionStorage.getItem('checkout_remark')
  if (savedRemark) {
    remark.value = savedRemark
    sessionStorage.removeItem('checkout_remark')
  }
  
  // 恢复选中的地址 ID
  const savedAddressId = sessionStorage.getItem('checkout_addressId')
  if (savedAddressId) {
    selectedAddressId.value = Number(savedAddressId)
    sessionStorage.removeItem('checkout_addressId')
  }
  
  // 恢复商品信息（从地址页面返回时）
  const savedItems = sessionStorage.getItem('checkout_items')
  if (savedItems) {
    try {
      orderItems.value = JSON.parse(savedItems)
      fromCart.value = sessionStorage.getItem('checkout_fromCart') === 'true'
    } catch {}
    sessionStorage.removeItem('checkout_items')
    sessionStorage.removeItem('checkout_fromCart')
    return
  }
  
  // 判断来源
  fromCart.value = route.query.fromCart === 'true'
  
  if (fromCart.value) {
    // 从购物车来，使用购物车选中的商品
    orderItems.value = cartStore.selectedItems.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      specs: item.specs
    }))
  } else {
    // 从商品详情页来，获取单个商品
    const productId = route.query.productId
    if (productId) {
      const res = await productApi.getDetail(productId)
      if (res.code === 200) {
        let specs = {}
        if (route.query.specs) {
          try { specs = JSON.parse(route.query.specs) } catch {}
        }
        orderItems.value = [{
          id: Date.now(),
          productId: res.data.id,
          name: res.data.name,
          image: res.data.image,
          price: res.data.price,
          quantity: Number(route.query.quantity) || 1,
          specs
        }]
      }
    }
  }
})

const goAddress = () => {
  sessionStorage.setItem('checkout_remark', remark.value)
  sessionStorage.setItem('checkout_items', JSON.stringify(orderItems.value))
  sessionStorage.setItem('checkout_fromCart', String(fromCart.value))
  if (selectedAddressId.value) {
    sessionStorage.setItem('checkout_addressId', String(selectedAddressId.value))
  }
  router.push('/address?select=true')
}

const submitOrder = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  
  if (orderItems.value.length === 0) {
    ElMessage.error('商品信息错误')
    return
  }
  
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  submitting.value = false
  
  // 如果从购物车来，清除已选商品
  if (fromCart.value) {
    cartStore.clearSelected()
  }
  
  const orderNo = Date.now().toString()
  
  // 创建订单并保存到 store
  const newOrder = {
    id: Date.now(),
    orderNo,
    status: 1, // 待付款
    totalAmount: totalPrice.value,
    totalQuantity: orderItems.value.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: new Date().toLocaleString(),
    products: orderItems.value.map(item => ({
      id: item.productId,
      name: item.name,
      image: item.image,
      specs: formatItemSpecs(item.specs),
      price: item.price,
      quantity: item.quantity
    }))
  }
  orderStore.addOrder(newOrder)
  
  // 保存商品列表到 sessionStorage
  sessionStorage.setItem('pay_items', JSON.stringify(orderItems.value))
  sessionStorage.setItem('pay_orderId', String(newOrder.id))
  
  router.replace({
    path: '/pay',
    query: {
      orderNo,
      amount: totalPrice.value.toFixed(2)
    }
  })
}
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  padding-bottom: 70px;
  background-color: $bg-color;
}

.card {
  margin: $spacing-md;
}

.address-section {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  cursor: pointer;
  
  .address-info {
    flex: 1;
    min-width: 0;
  }
  
  .address-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-xs;
    
    .name { font-weight: 500; }
    .phone { color: $text-secondary; }
  }
  
  .address-detail {
    font-size: $font-sm;
    color: $text-regular;
    line-height: 1.5;
  }
  
  .no-address {
    flex: 1;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    color: $text-secondary;
  }
}

.product-section {
  .product-item {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-sm 0;
    border-bottom: 1px solid $border-light;
    
    &:last-child { border-bottom: none; }
    &:first-child { padding-top: 0; }
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
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .product-name {
    font-size: $font-md;
    font-weight: 400;
    color: $text-primary;
    line-height: 1.4;
  }
  
  .product-specs {
    font-size: $font-xs;
    color: $text-secondary;
  }
  
  .product-price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .price { font-size: $font-lg; }
    .quantity { font-size: $font-sm; color: $text-secondary; }
  }
}

.remark-section {
  .remark-label {
    font-size: $font-md;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }
}

.price-section {
  .price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-sm 0;
    font-size: $font-md;
    color: $text-regular;
    
    &.total {
      border-top: 1px solid $border-light;
      margin-top: $spacing-sm;
      padding-top: $spacing-md;
      font-weight: 500;
      color: $text-primary;
      
      .total-price { font-size: $font-xl; }
    }
  }
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 $spacing-md;
  background-color: $bg-white;
  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.06);
  gap: $spacing-md;
  
  .total-info {
    font-size: $font-md;
    .total-price { font-size: $font-xl; }
  }
  
  .el-button { min-width: 120px; }
}
</style>
