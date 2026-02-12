<template>
  <div class="login-page">
    <NavBar title="登录" />
    
    <div class="login-content">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo">
          <el-icon :size="48"><ShoppingCart /></el-icon>
        </div>
        <h1 class="app-name">FreshMall</h1>
        <p class="app-slogan">清新购物，品质生活</p>
      </div>
      
      <!-- 登录表单 -->
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="email">
          <el-input 
            v-model="form.email" 
            placeholder="请输入邮箱"
            :prefix-icon="Message"
            size="large"
            @input="clearValidate('email')"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            @input="clearValidate('password')"
          />
        </el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
      </el-form>
      
      <!-- 其他操作 -->
      <div class="login-footer">
        <span @click="goRegister">还没有账号？立即注册</span>
      </div>
      
      <!-- 测试账号提示 -->
      <div class="test-account">
        <p>测试账号：user@test.com</p>
        <p>测试密码：123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Message, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  loading.value = true
  const res = await userStore.login(form.email, form.password)
  loading.value = false
  
  if (res.code === 200) {
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/'
    router.replace(redirect)
  } else {
    ElMessage.error(res.message)
  }
}

const goRegister = () => router.push('/register')

const clearValidate = (field) => {
  formRef.value?.clearValidate(field)
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background-color: $bg-white;
}

.login-content {
  padding: $spacing-xl;
  padding-top: 40px;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto $spacing-md;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $primary-color, $primary-light);
  border-radius: 50%;
  color: #fff;
}

.app-name {
  font-size: $font-xxl;
  font-weight: 600;
  color: $primary-color;
  margin-bottom: $spacing-xs;
}

.app-slogan {
  font-size: $font-sm;
  color: $text-secondary;
}

.login-form {
  .el-form-item {
    margin-bottom: $spacing-lg;
    
    &.is-error {
      margin-bottom: $spacing-lg;
    }
  }
  
  :deep(.el-form-item__error) {
    position: absolute;
    top: 100%;
    padding-top: 2px;
  }
  
  .el-button {
    width: 100%;
  }
}

.login-footer {
  text-align: center;
  margin-top: $spacing-lg;
  
  span {
    font-size: $font-sm;
    color: $primary-color;
    cursor: pointer;
  }
}

.test-account {
  margin-top: 40px;
  padding: $spacing-md;
  background-color: $bg-gray;
  border-radius: $radius-md;
  text-align: center;
  
  p {
    font-size: $font-sm;
    color: $text-secondary;
    line-height: 1.8;
  }
}
</style>
