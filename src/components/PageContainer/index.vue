<script setup>
defineProps({
  title: {
    type: Boolean
  }
})
</script>

<template>
  <div class="page-container">
    <div v-if="title" class="header">
      <slot name="header"></slot>
    </div>

    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  font-size: 16px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.5s;
  border-radius: 3px;
  margin: 20px;

  .header {
    min-height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgb(211, 211, 211);
    padding: 10px;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
}

.page-container:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
</style>
