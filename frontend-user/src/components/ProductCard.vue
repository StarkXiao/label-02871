<template>
  <div class="product-card" @click="goDetail">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <span v-if="product.isNew" class="tag tag-new">新品</span>
      <span v-if="product.isHot" class="tag tag-hot">热卖</span>
    </div>
    <div class="product-info">
      <h3 class="product-name ellipsis-2">{{ product.name }}</h3>
      <div class="product-price">
        <span class="price">{{ product.price }}</span>
        <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
      </div>
      <div class="product-sales">已售 {{ product.sales }}</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  product: { type: Object, required: true }
})

const router = useRouter()

const goDetail = () => {
  router.push(`/product/${props.product.id}`)
}
</script>

<style lang="scss" scoped>
.product-card {
  background-color: $bg-white;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background-color: $bg-gray;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.tag {
  position: absolute;
  top: $spacing-sm;
  left: $spacing-sm;
  padding: 2px 6px;
  font-size: $font-xs;
  color: #fff;
  border-radius: $radius-sm;
  
  &.tag-new {
    background-color: $primary-color;
  }
  
  &.tag-hot {
    background-color: $danger-color;
  }
}

.product-info {
  padding: $spacing-sm;
}

.product-name {
  font-size: $font-md;
  font-weight: 400;
  color: $text-primary;
  line-height: 1.4;
  height: 2.8em;
  margin-bottom: $spacing-xs;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: $spacing-xs;
  margin-bottom: $spacing-xs;
  
  .price {
    font-size: $font-lg;
  }
  
  .original-price {
    font-size: $font-sm;
    color: $text-placeholder;
    text-decoration: line-through;
  }
}

.product-sales {
  font-size: $font-xs;
  color: $text-secondary;
}
</style>
