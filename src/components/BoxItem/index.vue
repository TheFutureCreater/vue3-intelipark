<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: {
    type: Boolean
  },
  size: Number
})

// 设置样式
const contentStyle = computed(() => {
  return {
    height: `${props.size}px`
  }
})
</script>

<template>
  <div class="box-item">
    <div v-if="title" class="header">
      <slot name="header"></slot>
    </div>

    <div class="content" :style="contentStyle">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box-item {
  height: auto;
  font-size: 16px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.5s;
  border-radius: 3px;
  margin-right: 20px;

  .header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgb(211, 211, 211);
    padding: 10px;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
}

.box-item:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
</style>
