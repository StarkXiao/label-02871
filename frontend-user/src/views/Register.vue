<template>
  <div class="register-page">
    <NavBar title="注册" />
    
    <div class="register-content">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo">
          <el-icon :size="48"><ShoppingCart /></el-icon>
        </div>
        <h1 class="app-name">FreshMall</h1>
      </div>
      
      <!-- 注册表单 -->
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        class="register-form"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="nickname">
          <el-input 
            v-model="form.nickname" 
            placeholder="请输入昵称"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input 
            v-model="form.email" 
            placeholder="请输入邮箱"
            :prefix-icon="Message"
            size="large"
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
          />
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="请确认密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 其他操作 -->
      <div class="register-footer">
        <span @click="goLogin">已有账号？立即登录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart, User, Message, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度2-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  loading.value = true
  const res = await userStore.register({
    nickname: form.nickname,
    email: form.email,
    password: form.password
  })
  loading.value = false
  
  if (res.code === 200) {
    ElMessage.success('注册成功')
    router.replace('/')
  } else {
    ElMessage.error(res.message)
  }
}

const goLogin = () => router.push('/login')
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background-color: $bg-white;
}

.register-content {
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
}

.register-form {
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

.register-footer {
  text-align: center;
  margin-top: $spacing-lg;
  
  span {
    font-size: $font-sm;
    color: $primary-color;
    cursor: pointer;
  }
}
</style>
