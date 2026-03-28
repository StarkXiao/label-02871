<template>
  <div class="profile-page">
    <!-- 未登录 -->
    <template v-if="!isLoggedIn">
      <NotLoggedIn />
    </template>
    
    <!-- 已登录 -->
    <template v-else>
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-info">
          <div class="avatar-wrapper">
            <img 
              v-if="userInfo?.avatar" 
              :src="userInfo.avatar" 
              alt="头像" 
              class="avatar"
            />
            <div v-else class="avatar-placeholder">
              <el-icon :size="30"><User /></el-icon>
            </div>
          </div>
          <div class="user-detail">
            <h3 class="nickname">{{ userInfo?.nickname || '用户' }}</h3>
            <p class="email">{{ userInfo?.email || '' }}</p>
          </div>
        </div>
      </div>
      
      <!-- 订单入口 -->
      <div class="order-section card">
        <div class="section-header">
          <span>我的订单</span>
          <span class="view-all" @click="goOrder()">全部订单 <el-icon><ArrowRight /></el-icon></span>
        </div>
        <div class="order-nav">
          <div class="order-item" @click="goOrder('pending')">
            <el-icon :size="24"><Wallet /></el-icon>
            <span>待付款</span>
          </div>
          <div class="order-item" @click="goOrder('shipped')">
            <el-icon :size="24"><Box /></el-icon>
            <span>待收货</span>
          </div>
          <div class="order-item" @click="goOrder('completed')">
            <el-icon :size="24"><Finished /></el-icon>
            <span>已完成</span>
          </div>
          <div class="order-item" @click="goOrder('refund')">
            <el-icon :size="24"><RefreshLeft /></el-icon>
            <span>退款/售后</span>
          </div>
        </div>
      </div>
      
      <!-- 功能菜单 -->
      <div class="menu-section card">
        <div class="menu-item" @click="goAddress">
          <el-icon :size="20"><Location /></el-icon>
          <span>收货地址</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="goFavorite">
          <el-icon :size="20"><Star /></el-icon>
          <span>我的收藏</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
      
      <!-- 退出登录 -->
      <div class="logout-section">
        <el-button @click="handleLogout">退出登录</el-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowRight, User, Wallet, Box, Finished, 
  RefreshLeft, Location, Star
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/helpers'
import NotLoggedIn from '@/components/NotLoggedIn.vue'

const router = useRouter()
const { isLoggedIn, userInfo, logout } = useUserStore()

const goLogin = () => {
  router.push('/login')
}

const goOrder = (status) => {
  router.push(status ? `/order?status=${status}` : '/order')
}

const goAddress = () => {
  router.push('/address')
}

const goFavorite = () => {
  router.push('/favorite')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await logout()
    ElMessage.success('已退出登录')
    router.push('/')
  } catch {
    // 取消
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  padding: $spacing-md;
}

.user-card {
  background: linear-gradient(135deg, $primary-color, $primary-light);
  border-radius: $radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-md;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.login-prompt {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  cursor: pointer;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-detail {
  flex: 1;
}

.nickname {
  font-size: $font-lg;
  font-weight: 500;
  margin-bottom: $spacing-xs;
}

.email {
  font-size: $font-sm;
  opacity: 0.8;
}

.login-prompt {
  span {
    flex: 1;
    font-size: $font-lg;
  }
}

.order-section {
  margin-bottom: $spacing-md;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
  font-size: $font-md;
  font-weight: 500;
  
  .view-all {
    display: flex;
    align-items: center;
    font-size: $font-sm;
    font-weight: 400;
    color: $text-secondary;
    cursor: pointer;
  }
}

.order-nav {
  display: flex;
  justify-content: space-around;
}

.order-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  color: $text-regular;
  cursor: pointer;
  
  span {
    font-size: $font-sm;
  }
  
  &:active {
    color: $primary-color;
  }
}

.menu-section {
  margin-bottom: $spacing-md;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md 0;
  border-bottom: 1px solid $border-light;
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  span {
    flex: 1;
    font-size: $font-md;
  }
  
  .el-icon:first-child {
    color: $primary-color;
  }
  
  .el-icon:last-child {
    color: $text-placeholder;
  }
}

.logout-section {
  margin-top: $spacing-xl;
  text-align: center;
  
  .el-button {
    width: 100%;
  }
}
</style>
