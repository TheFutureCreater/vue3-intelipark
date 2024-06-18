<template>
  <el-autocomplete
    style="width: 100%"
    input-style="height: 46px; width: 100%;"
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入园区名称"
    debounce="700"
    clearable="true"
    @select="handleSelect"
  >
    <template #default="{ item }">
      <span class="value" style="font-weight: 700">{{ item.value }}</span>
      <span class="link" style="color: #0000ff7f; position: absolute; right: 20px"
        >({{ item.parkId }})</span
      >
    </template>
    <template #append>
      <el-button @click="goSearch" :icon="Search" />
    </template>
  </el-autocomplete>
</template>

<script setup>
import { useScreenStore } from '@/stores'
import { getParkInfoListService } from '@/api/park'
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const screenStore = useScreenStore()
const state = ref('')
const links = ref([])
const searchParkId = ref(0)

const loadAll = async () => {
  const res = []
  let data = (await getParkInfoListService({ pageNum: 1, pageSize: 10, searchWord: '' })).data.data
  data.records.forEach((el) => {
    res.push({ regionName: el.regionName, parkId: el.parkId })
    // console.log({ value: el.regionName, parkid: el.parkId })
  })
  console.log(res)
  return res
}

// let timeout
const querySearchAsync = async (queryString, cb) => {
  const results = queryString
    ? (await getParkInfoListService({ pageNum: 1, pageSize: 10, searchWord: queryString })).data.data
        .records
    : links.value
  const data = []
  console.log(links.value)
  console.log(results)
  results.forEach((el) => {
    // console.log({ value: el.regionName, parkId: el.parkId })
    data.push({ value: el.regionName, parkId: el.parkId })
  })
  console.log(results)
  cb(data)
  // clearTimeout(timeout)
  // timeout = setTimeout(() => {
  //   cb(data)
  // }, 500)
}

const handleSelect = (item) => {
  searchParkId.value = item.parkId
}

const goSearch = async () => {
  if (state.value.trim() == '') {
    alert('输入不能为空')
    return
  }
  screenStore.dateInit()
  let res = (await getParkInfoListService({ pageNum: 1, pageSize: 10, searchWord: state.value })).data
    .data
  if (res.records.length == 0) {
    alert('园区不存在')
    return
  }
  // state.value = ''
  searchParkId.value = res.records[0].parkId
  router.push({
    path: '/screen/charts',
    query: {
      parkid: searchParkId.value
    }
  })
}

onMounted(async () => {
  links.value = await loadAll()
  state.value = '第一园区'
  goSearch()
})
</script>
