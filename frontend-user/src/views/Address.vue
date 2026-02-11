<template>
  <div class="address-page">
    <NavBar title="收货地址" />
    
    <div class="address-content">
      <div v-if="addressStore.addressList.length === 0" class="empty-state">
        <el-icon :size="48"><Location /></el-icon>
        <span>暂无收货地址</span>
      </div>
      
      <div v-else class="address-list">
        <div 
          v-for="addr in addressStore.addressList" 
          :key="addr.id" 
          class="address-item"
          :class="{ selected: isSelectMode && selectedId === addr.id }"
          @click="handleSelect(addr)"
        >
          <div class="address-info">
            <div class="address-header">
              <span class="name">{{ addr.name }}</span>
              <span class="phone">{{ addr.phone }}</span>
              <el-tag v-if="addr.isDefault" size="small" type="success">默认</el-tag>
            </div>
            <p class="address-detail">{{ addr.detail }}</p>
          </div>
          <div class="address-actions" @click.stop>
            <el-icon @click="editAddress(addr)"><Edit /></el-icon>
            <el-icon @click="deleteAddress(addr.id)"><Delete /></el-icon>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加按钮 -->
    <div class="add-btn-wrapper">
      <el-button type="primary" round @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        新增收货地址
      </el-button>
    </div>
    
    <!-- 地址表单弹窗 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑地址' : '新增地址'"
      width="90%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="form.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="form.detail" type="textarea" :rows="2" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isDefault">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Location, Edit, Delete, Plus } from '@element-plus/icons-vue'
import { useAddressStore } from '@/store/address'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const addressStore = useAddressStore()

const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const submitting = ref(false)
const formRef = ref()
const selectedId = ref(null)

// 判断是否为选择模式（从确认订单页跳转过来）
const isSelectMode = computed(() => route.query.select === 'true')

const form = reactive({
  name: '',
  phone: '',
  detail: '',
  isDefault: false
})

const rules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    phone: '',
    detail: '',
    isDefault: false
  })
}

const showAddDialog = () => {
  isEdit.value = false
  editId.value = null
  resetForm()
  dialogVisible.value = true
}

const editAddress = (addr) => {
  isEdit.value = true
  editId.value = addr.id
  Object.assign(form, {
    name: addr.name,
    phone: addr.phone,
    detail: addr.detail,
    isDefault: addr.isDefault
  })
  dialogVisible.value = true
}

const deleteAddress = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    addressStore.removeAddress(id)
    ElMessage.success('删除成功')
  } catch {
    // 取消
  }
}

const handleSelect = (addr) => {
  if (isSelectMode.value) {
    // 保存选中的地址 ID 到 sessionStorage，然后返回
    sessionStorage.setItem('checkout_addressId', String(addr.id))
    router.back()
  }
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  
  if (isEdit.value) {
    addressStore.updateAddress(editId.value, { ...form })
    ElMessage.success('更新成功')
  } else {
    addressStore.addAddress({ ...form })
    ElMessage.success('添加成功')
  }
  
  submitting.value = false
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.address-page {
  min-height: 100vh;
  padding-bottom: 80px;
}

.address-content {
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

.address-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.address-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: $bg-white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
  
  &.selected {
    border-color: $primary-color;
  }
}

.address-info {
  flex: 1;
  min-width: 0;
}

.address-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-xs;
  
  .name {
    font-weight: 500;
  }
  
  .phone {
    color: $text-secondary;
  }
}

.address-detail {
  font-size: $font-sm;
  color: $text-regular;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  gap: $spacing-md;
  color: $text-secondary;
  
  .el-icon {
    cursor: pointer;
    
    &:hover {
      color: $primary-color;
    }
  }
}

.add-btn-wrapper {
  position: fixed;
  bottom: 70px;
  left: $spacing-md;
  right: $spacing-md;
  
  .el-button {
    width: 100%;
  }
}
</style>
