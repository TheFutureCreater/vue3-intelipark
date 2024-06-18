<script setup>
import { CloseBold, Select, Refresh } from '@element-plus/icons-vue'
import { ref, watch, computed } from 'vue'

// 组件显示
const props = defineProps({
  selectShow: Boolean,
  dialogTitle: String
})
const emit = defineEmits(['done-edit-add'])

const dialogVisible = ref(false)

watch(
  computed(() => {
    return props.selectShow
  }),
  () => {
    dialogVisible.value = !dialogVisible.value
  }
)

// 返回父级
const backToParent = (operation) => {
  emit('done-edit-add', operation)
  // if (operation !== 3) dialogVisible.value = false
}
</script>

<template>
  <!-- <client-only> -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="850px">
    <div style="padding: 20px">
      <slot></slot>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button plain type="warning" @click="backToParent(3)" :icon="Refresh">重置</el-button>
        <el-button @click="backToParent(2)" :icon="CloseBold"> 取消 </el-button>
        <el-button type="primary" @click="backToParent(1)" :icon="Select"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- </client-only> -->
</template>

<style lang="scss" scoped></style>
