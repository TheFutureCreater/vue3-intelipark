<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  state: String,
  size: Number
})

// const iconColors = [
//   { state: 'free', inner: '#67C23A', outer: '#b3e19d' },
//   { state: 'busy', inner: '#409EFF', outer: '#a0cfff' },
//   { state: 'warn', inner: '#E6A23C', outer: '#f3d19e' },
//   { state: 'error', inner: '#F56C6C', outer: '#fab6b6' },
//   { state: 'disable', inner: '#909399', outer: '#c8c9cc' }
// ]

const currentColor = ref()

// 设置样式
const iconStyle = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundColor: currentColor.value.inner,
    boxShadow: `0 0 2px rgba(0, 0, 0, 0.1)`
  }
})
</script>

<template>
  <div class="state-icon" :style="iconStyle"></div>
</template>

<style lang="scss" scoped>
.state-icon {
  font-size: 16px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.5s;
  border-radius: 3px;
}
</style>
