<script setup>
import { Search, Refresh, ChatDotSquare } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getChargeInfoListService } from '@/api/chargingRecords'
import chargeStateStatic from '@/assets/json/chargeStateStatic'
import { useRouter } from 'vue-router'

const router = useRouter()
const pageLoading = ref(true)
const pageTotal = ref(0)
const pageData = ref({
  pageNum: 1,
  pageSize: 20,
  searchWord: '',
  connectorId: '',
  userId: '',
  vehicleId: '',
  state: ''
})

const tableData = ref([])

// 获取url请求参数
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  pageData.value.userId = urlParams.get('userId') || ''
  pageData.value.chargeId = urlParams.get('chargeId') || ''
  pageData.value.connectorId = urlParams.get('connectorId') || ''
}
getUrlParams()

// 响应更改url参数
const handleUrlChange = () => {
  const { userId, chargeId, connectorId } = pageData.value
  const urlParams = new URLSearchParams(window.location.search)

  if (userId) urlParams.set('userId', userId)
  else urlParams.delete('userId')

  if (chargeId) urlParams.set('chargeId', chargeId)
  else urlParams.delete('chargeId')

  if (connectorId) urlParams.set('connectorId', connectorId)
  else urlParams.delete('connectorId')

  // 检查 urlParams 是否包含任何参数
  const newUrl = urlParams.toString() === '' ? window.location.pathname : `?${urlParams}`
  // 使用当前的 history.state
  const currentState = history.state ? history.state : null
  // 替换当前历史记录，同时保留现有的 history.state
  window.history.replaceState(currentState, '', newUrl)
}

// 请求后端获取信息
const getChargeInfoList = async () => {
  pageLoading.value = true
  const rs = await getChargeInfoListService(pageData.value)
  pageTotal.value = rs.data.data.totalRow
  tableData.value = rs.data.data.records
  handleUrlChange()
  pageLoading.value = false
}
getChargeInfoList()

// 提交筛选条件
const onSubmit = () => {
  console.log('submit!')
  getChargeInfoList()
}

// 每页显示数量改变
const handleSizeChange = () => {
  console.log(pageData.value.pageSize)
  getChargeInfoList()
}

// 页码发生变化
const handleCurrentChange = () => {
  console.log(pageData.value.pageNum)
  getChargeInfoList()
}

const handleExtend = (id) => {
  router.push(`/admin/basic/user?userId=${id}`)
}

// 重置查询表单
const resetPageFrom = () => {
  console.log('重置查询表单')
  pageData.value = {
    pageNum: 1,
    pageSize: 20,
    searchWord: '',
    connectorId: '',
    userId: '',
    vehicleId: '',
    state: ''
  }
}
</script>

<template>
  <PageContainer :title="true">
    <template #header>
      <span>充电记录日志管理</span>
      <div>
        <!-- <el-button type="success" @click="handleAdd" :icon="Plus">添加</el-button> -->
      </div>
    </template>

    <template #content>
      <div class="top-elform-query">
        <div></div>

        <el-form :inline="true" :model="pageData" style="text-align: end">
          <el-form-item label="搜索关键字">
            <el-input
              v-model="pageData.searchWord"
              placeholder="输入关键字"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="充电接口ID">
            <el-input
              v-model="pageData.connectorId"
              :formatter="(value) => value.replace(/\D/g, '')"
              :parser="(value) => value.replace(/\D/g, '')"
              placeholder="输入充电接口id"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="用户ID">
            <el-input
              v-model="pageData.userId"
              :formatter="(value) => value.replace(/\D/g, '')"
              :parser="(value) => value.replace(/\D/g, '')"
              placeholder="输入用户id"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="用户记录ID">
            <el-input
              v-model="pageData.chargeId"
              :formatter="(value) => value.replace(/\D/g, '')"
              :parser="(value) => value.replace(/\D/g, '')"
              placeholder="输入用户记录id"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item>
            <el-button plain type="warning" @click="resetPageFrom" :icon="Refresh">重置</el-button>
            <el-button type="primary" @click="onSubmit" :icon="Search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="pageLoading"
        :data="tableData"
        style="width: 100%"
        stripe
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed show-overflow-tooltip prop="chargeId" label="记录ID" width="120" />
        <el-table-column show-overflow-tooltip prop="connectorId" label="接口ID" width="120" />
        <el-table-column prop="state" label="订单状态" width="120">
          <template #default="scope">
            <span>{{ chargeStateStatic.find((item) => item.key === scope.row.state).value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="electricity" label="所充电量" width="120" />
        <el-table-column prop="cost" label="费用" width="120" />
        <el-table-column show-overflow-tooltip prop="userId" label="用户ID" width="120" />
        <el-table-column show-overflow-tooltip prop="vehicleId" label="车辆ID" width="120" />
        <el-table-column prop="startElectricity" label="初始电量" width="120" />
        <el-table-column prop="endElectricity" label="结束电量" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="200" />
        <el-table-column prop="endTime" label="结束时间" width="200" />
        <el-table-column fixed="right" label="单行操作" width="120">
          <template #default="scope">
            <el-button
              text
              bg
              size="small"
              @click="handleExtend(scope.row.userId)"
              :icon="ChatDotSquare"
            >
              查看用户
            </el-button>
            <!-- <el-button
              text
              bg
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              :icon="EditPen"
            >
              编辑
            </el-button> -->
            <!-- <el-button
              text
              bg
              type="danger"
              size="small"
              @click="handleDelete(scope.row.feedbackId)"
              :icon="Delete"
            >
              删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <div style="height: 20px"></div>
      <el-pagination
        v-model:current-page="pageData.pageNum"
        v-model:page-size="pageData.pageSize"
        :page-sizes="[10, 15, 20, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div style="height: 10px"></div>
    </template>
  </PageContainer>
</template>

<style lang="scss" scoped>
.top-elform-query {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
