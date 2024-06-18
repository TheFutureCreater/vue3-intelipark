<template>
  <!--    style="width: 100%"
    input-style="height: 46px; width: 100%;" -->
  <el-autocomplete
    style="width: 80%; left: 10%; top: 50%"
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入充电站名称"
    debounce="700"
    clearable="true"
    @select="handleSelect"
  >
    <template #default="{ item }">
      <span class="value" style="font-weight: 700">{{ item.value }}</span>
      <span class="link" style="color: #0000ff6f; position: absolute; right: 20px"
        >({{ item.stid }})</span
      >
    </template>
    <template #append>
      <el-button @click="goSearch" :icon="Search" />
    </template>
  </el-autocomplete>
</template>

<script setup>
import { useScreenStore } from '@/stores'
import { getStationInfoListService } from '@/api/station'
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
// import { useRouter } from 'vue-router'
const route = useRoute()
const screenStore = useScreenStore()
const state = ref('')
const links = ref([])
const searchStId = ref(0)

const loadAll = async () => {
  const res = []
  let data = (
    await getStationInfoListService({
      pageNum: 1,
      pageSize: 10,
      searchWord: '',
      parkId: route.query.parkid
    })
  ).data.data
  data.records.forEach((el) => {
    res.push({ stationName: el.stationName, stationId: el.stationId })
  })
  return res
}

// let timeout
const querySearchAsync = async (queryString, cb) => {
  const results = queryString
    ? (
        await getStationInfoListService({
          pageNum: 1,
          pageSize: 10,
          searchWord: queryString,
          parkId: route.query.parkid
        })
      ).data.data.records
    : links.value
  const data = []
  results.forEach((el) => {
    data.push({ value: el.stationName, stid: el.stationId })
  })
  cb(data)
  // clearTimeout(timeout)
  // timeout = setTimeout(() => {
  //   cb(data)
  // })
}

const handleSelect = (item) => {
  // console.log(item)
  searchStId.value = item.stid
  // console.log(item.stationId)
  // console.log(searchStId.value)
}

const goSearch = async () => {
  if (state.value.trim() == '') {
    alert('输入不能为空')
    return
  }
  let res = (
    await getStationInfoListService({
      pageNum: 1,
      pageSize: 10,
      searchWord: state.value,
      parkId: route.query.parkid
    })
  ).data.data
  if (res.records.length == 0) {
    alert('充电站不存在')
    return
  }
  // state.value = ''
  screenStore.stationId = res.records[0].stationId
}

onMounted(async () => {
  links.value = await loadAll()
  state.value = '某某充电站'
  goSearch()
})
</script>
