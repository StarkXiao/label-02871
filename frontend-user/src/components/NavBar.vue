<template>
  <div class="navbar" :class="{ 'navbar-transparent': transparent }">
    <div class="navbar-left" @click="handleBack">
      <el-icon v-if="showBack" :size="20"><ArrowLeft /></el-icon>
      <slot name="left"></slot>
    </div>
    <div class="navbar-title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="navbar-right">
      <slot name="right"></slot>
    </div>
  </div>
  <div v-if="!transparent" class="navbar-placeholder"></div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
  transparent: { type: Boolean, default: false }
})

const router = useRouter()

const handleBack = () => {
  if (props.showBack) {
    router.back()
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: $navbar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-md;
  background-color: $bg-white;
  z-index: 99;
  
  &.navbar-transparent {
    background-color: transparent;
  }
}

.navbar-placeholder {
  height: $navbar-height;
}

.navbar-left {
  width: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: $font-lg;
  font-weight: 500;
  color: $text-primary;
}

.navbar-right {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
