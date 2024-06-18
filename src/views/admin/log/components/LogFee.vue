<script setup>
import {
  Delete,
  EditPen,
  Search,
  Refresh,
  ArrowDown,
  // ChatDotSquare,
  Plus
} from '@element-plus/icons-vue'
// import { ref, watch, onMounted } from 'vue'
import { ref } from 'vue'
import {
  getFeeInfoListService,
  addFeeInfoService,
  editFeeInfoService,
  delFeeInfoListService
} from '@/api/fee'
// import { useRouter } from 'vue-router'
// import { useFacilityStore } from '@/stores'

// const facilityStore = useFacilityStore()
const pageLoading = ref(true)
// const router = useRouter()
const pageTotal = ref(0)
const pageData = ref({
  pageNum: 1,
  pageSize: 20,
  searchWord: '',
  operatorId: ''
})
const tableData = ref([])
const multipleSelection = ref([]) // 多选数组容器
const selectShow = ref(false) // 对话框是否打开
const editOrAdd = ref(true) // 是否为编辑操作，否则为添加操作
const fromData = ref() // 存储编辑或添加操作的当行对象
const ruleFormRef = ref() // 表单绑定
const blockValue = [
  {
    type: '尖费率',
    color: '#13678a'
  },
  {
    type: '峰费率',
    color: '#45c4b0'
  },
  {
    type: '平费率',
    color: '#dafdba'
  },
  {
    type: '谷费率',
    color: '#E4E7ED'
  }
]

// 确认对话框操作
const DoneEditOrAdd = async (operation) => {
  if (operation === 2) {
    selectShow.value = !selectShow.value
    console.log('取消对话框操作')
    if (ruleFormRef.value) ruleFormRef.value.resetFields()
  } else if (operation === 1) {
    console.log('确认对话框操作')
    // 提交表单进行校验
    if (ruleFormRef.value) await ruleFormRef.value.validate()
    selectShow.value = !selectShow.value
    if (editOrAdd.value) {
      const rs = (await editFeeInfoService(fromData.value)).data.code
      if (rs === 200) ElMessage.success('编辑成功')
    } else {
      const rs = (await addFeeInfoService(fromData.value)).data.code
      if (rs === 200) ElMessage.success('添加成功')
    }
    getFeeModelInfoList()
  } else if (operation === 3) {
    console.log('重置对话框操作')
    // 重置表单校验
    if (ruleFormRef.value) ruleFormRef.value.resetFields()
  } else {
    console.log(Promise.reject('对话框返回数字错误'))
  }
  console.log('结束对话框操作')
  // getFeeModelInfoList()
}

// 获取url请求参数
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  pageData.value.operatorId = urlParams.get('operatorId') || ''
}
getUrlParams()

// 响应更改url参数
const handleUrlChange = () => {
  const operatorId = pageData.value.operatorId
  const urlParams = new URLSearchParams(window.location.search)

  if (operatorId !== '') urlParams.set('operatorId', operatorId)
  else urlParams.delete('operatorId')

  // 检查 urlParams 是否包含任何参数
  const newUrl = urlParams.toString() === '' ? window.location.pathname : `?${urlParams}`
  // 使用当前的 history.state
  const currentState = history.state ? history.state : null
  // 替换当前历史记录，同时保留现有的 history.state
  window.history.replaceState(currentState, '', newUrl)
}

// 请求后端获取信息
const getFeeModelInfoList = async () => {
  pageLoading.value = true
  const rs = await getFeeInfoListService(pageData.value)
  pageTotal.value = rs.data.data.totalRow
  tableData.value = rs.data.data.records
  handleUrlChange()
  pageLoading.value = false
}
getFeeModelInfoList()

// 处理多选逻辑
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 提交筛选条件
const onSubmit = () => {
  console.log('submit!')
  getFeeModelInfoList()
}

// 信息添加逻辑
const handleAdd = () => {
  console.log('充电站信息添加逻辑')
  fromData.value = {
    feeCode: '',
    operatorId: '',
    feeName: '',
    topPrice: {
      power: '',
      service: ''
    },
    highPrice: {
      power: '',
      service: ''
    },
    normalPrice: {
      power: '',
      service: ''
    },
    lowPrice: {
      power: '',
      service: ''
    },
    lossPercent: '',
    feeTypes: [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 2, 1, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],
    createdAt: '',
    updatedAt: ''
  }
  editOrAdd.value = false
  selectShow.value = !selectShow.value
}

// 单行编辑操作
const handleEdit = (rowData) => {
  console.log('单行编辑操作')
  fromData.value = JSON.parse(JSON.stringify(rowData))
  editOrAdd.value = true
  selectShow.value = !selectShow.value
}

// 单行删除操作
const handleDelete = async (id) => {
  console.log('单行删除操作' + id)
  await ElMessageBox.confirm('你确认要删除该条信息么？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const rs = (await delFeeInfoListService([id])).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getFeeModelInfoList()
    })
    .catch(() => {
      return
    })
}

// 删除多行操作
const handleDelAll = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.error('未选中任何数据')
    return
  }
  const idArray = multipleSelection.value.map((item) => item.connectorId)
  await ElMessageBox.confirm('你确认要删除多条信息么？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const rs = (await delFeeInfoListService(idArray)).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getFeeModelInfoList()
    })
    .catch(() => {
      return
    })
}

// const handleExtend = (id) => {
//   console.log('设备接口界面展开按钮：' + id)
//   router.push(`/admin/basic/equip?stage=运营商`)
//   facilityStore.fatherId[0] = id
//   // ++facilityStore.stageValue
// }

// 每页显示数量改变
const handleSizeChange = () => {
  console.log(pageData.value.pageSize)
  getFeeModelInfoList()
}

// 页码发生变化
const handleCurrentChange = () => {
  console.log(pageData.value.pageNum)
  getFeeModelInfoList()
}

// 校验规则
const rules = {
  operatorId: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  feeName: [{ required: true, message: '未输入任何内容', trigger: 'manual' }]
  // power: [{ required: true, message: '未输入任何内容', trigger: 'manual' }]
}

// 重置查询表单
const resetPageFrom = () => {
  console.log('重置查询表单')
  pageData.value = {
    pageNum: 1,
    pageSize: 20,
    searchWord: '',
    connectorState: '',
    lockStatus: '',
    matchCars: ''
  }
}
</script>

<template>
  <DialogBox
    :selectShow="selectShow"
    :dialogTitle="'付费模型信息' + (editOrAdd ? '编辑' : '添加')"
    @done-edit-add="DoneEditOrAdd"
  >
    <el-form ref="ruleFormRef" :model="fromData" :rules="rules" label-width="auto" status-icon>
      <el-row justify="space-between">
        <el-form-item label="运营商ID" prop="operatorId" style="width: 360px">
          <el-input v-model="fromData.operatorId" placeholder="输入运营商ID" clearable />
        </el-form-item>
        <el-form-item label="模型名称" prop="feeName" style="width: 360px">
          <el-input v-model="fromData.feeName" placeholder="输入模型名称" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="center">
        <span style="margin: 10px 0; font-size: 15px">尖费率</span>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="用电费率" prop="power" style="width: 360px">
          <el-input v-model="fromData.topPrice.power" placeholder="请输入用电费率" clearable />
        </el-form-item>
        <el-form-item label="服务费率" prop="power" style="width: 360px">
          <el-input v-model="fromData.topPrice.service" placeholder="请输入服务费率" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="center">
        <span style="margin: 10px 0; font-size: 15px">峰费率</span>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="用电费率" prop="power" style="width: 360px">
          <el-input v-model="fromData.highPrice.power" placeholder="请输入用电费率" clearable />
        </el-form-item>
        <el-form-item label="服务费率" prop="power" style="width: 360px">
          <el-input v-model="fromData.highPrice.service" placeholder="请输入服务费率" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="center">
        <span style="margin: 10px 0; font-size: 15px">平费率</span>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="用电费率" prop="power" style="width: 360px">
          <el-input v-model="fromData.normalPrice.power" placeholder="请输入用电费率" clearable />
        </el-form-item>
        <el-form-item label="服务费率" prop="power" style="width: 360px">
          <el-input v-model="fromData.normalPrice.service" placeholder="请输入服务费率" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="center">
        <span style="margin: 10px 0; font-size: 15px">谷费率</span>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="用电费率" prop="power" style="width: 360px">
          <el-input v-model="fromData.lowPrice.power" placeholder="请输入用电费率" clearable />
        </el-form-item>
        <el-form-item label="服务费率" prop="power" style="width: 360px">
          <el-input v-model="fromData.lowPrice.service" placeholder="请输入服务费率" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="计损比例" prop="power" style="width: 360px">
          <el-input v-model="fromData.lossPercent" placeholder="请输入计损比例" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="center">
        <span style="margin: 10px 0; font-size: 15px">逐小时计费规则</span>
      </el-row>
      <div style="display: flex; justify-content: center">
        <el-dropdown v-for="(item, index) in fromData.feeTypes" :key="index">
          <span
            :key="index"
            class="from-color-block"
            :style="`background-color: ${blockValue[item].color};`"
            ><span class="from-time">{{ index }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                class="table-block-text"
                v-for="(item2, index2) in blockValue"
                :key="index2"
                @click="fromData.feeTypes[index] = index2"
              >
                <span class="table-color-block" :style="`background-color: ${item2.color};`"></span>
                <span class="text-next-color">{{ '使用' + item2.type }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-form>
  </DialogBox>

  <PageContainer :title="true">
    <template #header>
      <span>计费模型信息管理</span>
      <div>
        <el-button type="success" @click="handleAdd" :icon="Plus">添加</el-button>
      </div>
    </template>
    <template #content>
      <div class="top-elform-query">
        <el-dropdown class="el-dropdown-del-all">
          <el-button type="primary">
            {{ multipleSelection.length === 0 ? '未选中' : `选中${multipleSelection.length}行` }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleDelAll">全部删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-form :inline="true" :model="pageData" style="text-align: end">
          <el-form-item label="搜索关键字">
            <el-input
              v-model="pageData.searchWord"
              placeholder="输入关键字"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="运营商ID">
            <el-input
              v-model="pageData.operatorId"
              :formatter="(value) => value.replace(/\D/g, '')"
              :parser="(value) => value.replace(/\D/g, '')"
              placeholder="输入运营商id"
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
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column fixed show-overflow-tooltip prop="feeCode" disabled label="ID" width="100" />
        <el-table-column show-overflow-tooltip prop="operatorId" label="运营商ID" width="100" />
        <el-table-column prop="feeName" label="模型名称" width="200" />
        <el-table-column label="尖费率">
          <el-table-column prop="topPrice.power" label="用电费率" width="100" />
          <el-table-column prop="topPrice.service" label="服务费率" width="100" />
        </el-table-column>
        <el-table-column label="峰费率">
          <el-table-column prop="highPrice.power" label="用电费率" width="100" />
          <el-table-column prop="highPrice.service" label="服务费率" width="100" />
        </el-table-column>
        <el-table-column label="平费率">
          <el-table-column prop="normalPrice.power" label="用电费率" width="100" />
          <el-table-column prop="normalPrice.service" label="服务费率" width="100" />
        </el-table-column>
        <el-table-column label="谷费率">
          <el-table-column prop="lowPrice.power" label="用电费率" width="100" />
          <el-table-column prop="lowPrice.service" label="服务费率" width="100" />
        </el-table-column>
        <el-table-column prop="feeTypes" label="规则时段" width="675">
          <template #header>
            <div>时段规则： &nbsp;从0到23时 逐小时计费规则</div>
            <div style="display: flex; margin-top: 5px">
              <span class="table-block-text" v-for="(item, index) in blockValue" :key="index">
                <span class="table-color-block" :style="`background-color: ${item.color};`"></span>
                <span class="text-next-color">{{ '使用' + item.type }}</span>
              </span>
            </div>
          </template>
          <template #default="scope">
            <div>
              <span
                v-for="(item, index) in scope.row.feeTypes"
                :key="index"
                class="column-color-block"
                :style="`background-color: ${blockValue[item].color};`"
                >{{ index }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="lossPercent" label="计损比例" min-width="100" />
        <el-table-column prop="updatedAt" label="更新时间" min-width="200" />

        <el-table-column fixed="right" label="单行操作" width="200">
          <template #default="scope">
            <el-button
              text
              bg
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              :icon="EditPen"
            >
              编辑
            </el-button>
            <el-button
              text
              bg
              type="danger"
              size="small"
              @click="handleDelete(scope.row.connectorId)"
              :icon="Delete"
            >
              删除
            </el-button>
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
        hide-on-single-page
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

.extend-content {
  margin-bottom: 5px;
}

.table-block-text {
  display: flex;
  align-items: center;

  .table-color-block {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    margin-right: 3px;
  }

  .text-next-color {
    margin-right: 15px;
  }
}

.column-color-block {
  text-align: center;
  user-select: none; // 阻止用户选中文本
  color: rgb(0, 0, 0, 0);
  font-weight: bold;
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 3px;
  margin-right: 3px;
}

.column-color-block:hover {
  color: #ffb30d;
}

.from-color-block {
  text-align: center;
  user-select: none; // 阻止用户选中文本
  color: #000;
  font-weight: bold;
  display: inline-block;
  line-height: 29px;
  width: 29px;
  height: 29px;
  border-radius: 4px;
  margin: 24px 3px 0 0;
  position: relative;
  cursor: pointer;

  .from-time {
    width: 18px;
    position: absolute;
    left: 6px;
    top: -25px;
  }
}
</style>
