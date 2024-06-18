<script setup>
import { useScreenStore } from '@/stores'

const dayStore = useScreenStore()
// import { onMounted, ref } from 'vue'
// import { getEqList, getEqState } from '@/api/equipments'
// import { getUserList, getUserStats } from '@/api/userinfo'
// import { getIncomeInfo } from '@/api/income'
// const date = ref(0)

// const pardid = ref('123456789')

// onMounted(async () => {
//   //用户信息统计
//   const userStats = await getUserStats(pardid.value)
//   ////充电榜单的用户信息
//   const userList = await getUserList(pardid.value)

//   console.log(userList.data)
//   console.log(userStats.data)
// })
</script>

<template>
  <div class="switch-date">
    <button :class="{ date: true, slt: dayStore.days === 1 }" @click="dayStore.days = 1">近30天</button>
    <button :class="{ date: true, slt: dayStore.days === 0 }" @click="dayStore.days = 0">近7天</button>
  </div>
</template>

<style lang="scss" scoped>
.switch-date {
  height: 24px;
  width: 100%;
  pointer-events: all;
  .date {
    transition: 0.3s;
    color: white;
    float: right;
    width: 60px;
    height: 24px;
    line-height: 20px;
    text-align: center;
    font-style: italic;
    border: 2px solid white;
    border-radius: 12px;
    margin-right: 5px;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
  }
  .slt {
    border: 2px solid skyblue;
    color: skyblue;
  }
}
</style>
