<template>
  <div class="not-logged-in">
    <div class="content">
      <el-icon :size="64" color="#C0C4CC"><User /></el-icon>
      <p class="title">您还未登录</p>
      <p class="desc">登录后享受更多服务</p>
      <el-button type="primary" @click="goLogin">立即登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User } from '@element-plus/icons-vue'

const router = useRouter()

const goLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.not-logged-in {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
}

.title {
  font-size: $font-lg;
  color: $text-primary;
  font-weight: 500;
}

.desc {
  font-size: $font-sm;
  color: $text-secondary;
}

.el-button {
  margin-top: $spacing-sm;
  min-width: 120px;
}
</style>
