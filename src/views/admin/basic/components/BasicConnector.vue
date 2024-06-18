<script setup>
import {
  Delete,
  Upload,
  EditPen,
  Search,
  Refresh,
  ArrowDown,
  ChatDotSquare,
  Download,
  Check,
  Close
} from '@element-plus/icons-vue'
import connectorTypeStatic from '@/assets/json/connectorTypeStatic'
import connectorStateStatic from '@/assets/json/connectorStateStatic'
import lockStatusStatic from '@/assets/json/lockStatusStatic'
import vehicleModel from '@/assets/json/vehicleModel'
import { ref } from 'vue'
import {
  getConnectorInfoListService,
  addConnectorInfoService,
  editConnectorInfoService,
  delConnectorInfoListService
} from '@/api/connector'
import { useFacilityStore } from '@/stores'
import { useRouter } from 'vue-router'
import { connectorCustomHttpRequest } from '@/api/upload'

const router = useRouter()
const pageLoading = ref(true)
const emit = defineEmits(['url-change'])
const facilityStore = useFacilityStore()
const pageTotal = ref(0)
const pageData = ref({
  pageNum: 1,
  pageSize: 20,
  searchWord: '',
  state: '',
  lockStatus: '',
  matchCars: '',
  equipmentId: ''
})
const tableData = ref([])
const multipleSelection = ref([]) // 多选数组容器
const selectShow = ref(false) // 对话框是否打开
const editOrAdd = ref(true) // 是否为编辑操作，否则为添加操作
const fromData = ref() // 存储编辑或添加操作的当行对象
const ruleFormRef = ref() // 表单绑定
const showUploadBox = ref(false) // 显示上传盒子与否

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
      const rs = (await editConnectorInfoService(fromData.value)).data.code
      if (rs === 200) ElMessage.success('编辑成功')
    } else {
      const rs = (await addConnectorInfoService(fromData.value)).data.code
      if (rs === 200) ElMessage.success('添加成功')
    }
    getStationInfoList()
  } else if (operation === 3) {
    console.log('重置对话框操作')
    // 重置表单校验
    if (ruleFormRef.value) ruleFormRef.value.resetFields()
  } else {
    console.log(Promise.reject('对话框返回数字错误'))
  }
  console.log('结束对话框操作')
  // getStationInfoList()
}

// 请求后端获取信息
const getStationInfoList = async () => {
  pageLoading.value = true
  pageData.value.equipmentId = facilityStore.fatherId[2] || ''
  const rs = await getConnectorInfoListService(pageData.value)
  pageTotal.value = rs.data.data.totalRow
  tableData.value = rs.data.data.records
  pageLoading.value = false
}
getStationInfoList()

// 处理多选逻辑
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 提交筛选条件
const onSubmit = () => {
  console.log('submit!')
  facilityStore.fatherId[2] = pageData.value.equipmentId
  emit('url-change')
  getStationInfoList()
}

// 信息添加逻辑
const handleAdd = () => {
  console.log('充电站信息添加逻辑')
  fromData.value = {}
  fromData.value.stationId = facilityStore.fatherId[2]
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
      const rs = (await delConnectorInfoListService([id])).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getStationInfoList()
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
      const rs = (await delConnectorInfoListService(idArray)).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getStationInfoList()
    })
    .catch(() => {
      return
    })
}

const handleExtend = (id) => {
  router.push(`/admin/log/charge?connectorId=${id}`)
}

// 每页显示数量改变
const handleSizeChange = () => {
  console.log(pageData.value.pageSize)
  getStationInfoList()
}

// 页码发生变化
const handleCurrentChange = () => {
  console.log(pageData.value.pageNum)
  getStationInfoList()
}

// 校验规则
const rules = {
  connectorName: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  equipmentId: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  connectorType: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  voltage: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  current: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  power: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  nationalStandard: [{ required: true, message: '未输入任何内容', trigger: 'manual' }]
}

// 重置查询表单
const resetPageFrom = () => {
  console.log('重置查询表单')
  pageData.value = {
    pageNum: 1,
    pageSize: 20,
    searchWord: '',
    state: '',
    lockStatus: '',
    matchCars: '',
    fatherId: ''
  }
}

defineExpose({
  handleAdd
})
</script>
<template>
  <el-dialog
    v-model="showUploadBox"
    title="批量添加充电站信息"
    width="400"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <el-upload
      v-model:file-list="fileList"
      :action="`${baseURL}/connections/excel`"
      :http-request="connectorCustomHttpRequest"
      accept=".xlsx"
      :limit="1"
      with-credentials="true"
    >
      <el-button :icon="Upload" type="primary">选择文件</el-button>
      <el-link
        @click.stop
        href="https://intelli-park.oss-cn-beijing.aliyuncs.com/connector-info.xlsx"
        :icon="Download"
        type="primary"
        style="margin-left: 10px"
      >
        下载模板
      </el-link>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showUploadBox = false">
          <el-icon class="el-icon--left"><Close /></el-icon> 取消
        </el-button>
        <el-button
          type="primary"
          @click="
            () => {
              showUploadBox = false
              getStationInfoList()
            }
          "
        >
          <el-icon class="el-icon--left"><Check /></el-icon>确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <DialogBox
    :selectShow="selectShow"
    :dialogTitle="'设备接口信息' + (editOrAdd ? '编辑' : '添加')"
    @done-edit-add="DoneEditOrAdd"
  >
    <el-form ref="ruleFormRef" :model="fromData" :rules="rules" label-width="auto" status-icon>
      <el-row justify="space-between">
        <el-form-item label="接口名称" prop="connectorName" style="width: 360px">
          <el-input v-model="fromData.connectorName" placeholder="输入接口名称" clearable />
        </el-form-item>
        <el-form-item label="所属设备ID" prop="equipmentId" style="width: 360px">
          <el-input v-model="fromData.equipmentId" placeholder="输入所属设备ID" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="接口类型" prop="connectorType" style="width: 360px">
          <el-select v-model="fromData.connectorType" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in connectorTypeStatic"
              :key="index"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="额定电压" prop="voltage" style="width: 360px">
          <el-input v-model="fromData.voltage" placeholder="请输入额定电压" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="额定电流" prop="current" style="width: 360px">
          <el-input v-model="fromData.current" placeholder="输入额定电流" clearable />
        </el-form-item>
        <el-form-item label="额定功率" prop="power" style="width: 360px">
          <el-input v-model="fromData.power" placeholder="输入额定功率" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="国家标准" prop="nationalStandard" style="width: 360px">
          <el-input v-model="fromData.nationalStandard" placeholder="输入国家标准" clearable />
        </el-form-item>
      </el-row>
    </el-form>
  </DialogBox>

  <div class="top-elform-query">
    <div>
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

      <el-button @click="showUploadBox = true" style="margin-top: 17px" :icon="Upload" type="primary">
        文件上传
      </el-button>
    </div>

    <el-form :inline="true" :model="pageData" style="text-align: end">
      <el-form-item label="搜索关键字">
        <el-input
          v-model="pageData.searchWord"
          placeholder="输入关键字"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="接口状态">
        <el-select v-model="pageData.state" placeholder="请选择" clearable style="width: 200px">
          <el-option
            v-for="(item, index) in connectorStateStatic"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地锁状态">
        <el-select v-model="pageData.lockStatus" placeholder="请选择" clearable style="width: 120px">
          <el-option
            v-for="(item, index) in lockStatusStatic"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="适用车型">
        <el-select v-model="pageData.matchCars" placeholder="请选择" clearable style="width: 180px">
          <el-option
            v-for="(item, index) in vehicleModel"
            :key="index"
            :label="item"
            :value="index + 1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="充电设备ID">
        <el-input
          v-model="pageData.equipmentId"
          :formatter="(value) => value.replace(/\D/g, '')"
          :parser="(value) => value.replace(/\D/g, '')"
          placeholder="输入充电设备id"
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
    <el-table-column fixed show-overflow-tooltip prop="connectorId" label="ID" width="100" />
    <el-table-column prop="connectorName" label="接口名称" width="200" />
    <el-table-column prop="connectorType" label="设备类型" width="180">
      <template #default="scope">
        <span>{{ connectorTypeStatic.find((item) => item.key === scope.row.connectorType).value }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="state" label="接口状态" width="180">
      <template #default="scope">
        <span>{{ connectorStateStatic.find((item) => item.key === scope.row.state).value }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="lockStatus" label="地锁状态" width="150">
      <template #default="scope">
        <span>{{ lockStatusStatic.find((item) => item.key === scope.row.lockStatus).value }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="matchCars" label="适用车型" width="180">
      <template #default="scope">
        <span>{{ vehicleModel[scope.row.matchCars - 1] || '未知' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="voltage" label="额定电压" width="150" />
    <el-table-column prop="current" label="额定电流" width="150" />
    <el-table-column prop="power" label="额定功率" width="150" />
    <el-table-column prop="nationalStandard" label="国家标准" min-width="200" />

    <el-table-column fixed="right" label="单行操作" width="270">
      <template #default="scope">
        <el-button
          text
          bg
          size="small"
          @click="handleExtend(scope.row.connectorId)"
          :icon="ChatDotSquare"
        >
          记录
        </el-button>
        <el-button text bg type="primary" size="small" @click="handleEdit(scope.row)" :icon="EditPen">
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

<style lang="scss" scoped>
.top-elform-query {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.extend-content {
  margin-bottom: 5px;
}
</style>
