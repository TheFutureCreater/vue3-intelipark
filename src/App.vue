<script setup>
// 国际化处理
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
</script>

<template>
  <el-config-provider :locale="zh">
    <router-view />
  </el-config-provider>
</template>

<style scoped></style>
