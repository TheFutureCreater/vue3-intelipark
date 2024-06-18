<script setup></script>

<template>
  <div class="box-container">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.box-container {
  display: flex;
  justify-content: center;
  height: auto;
  margin: 20px;
}
</style>
