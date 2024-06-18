<script setup>
import {
  Delete,
  EditPen,
  Search,
  Refresh,
  ArrowDown,
  ChatDotSquare,
  CircleCloseFilled,
  CircleCheckFilled,
  Location,
  Upload,
  Download,
  Check,
  Close
} from '@element-plus/icons-vue'
import stationConstructionStatic from '@/assets/json/stationConstruction'
import stationStatusStatic from '@/assets/json/stationStatus'
import stationTypeStatic from '@/assets/json/stationType'
import { ref } from 'vue'
import {
  getStationInfoByIdService,
  getStationInfoListService,
  addStationInfoService,
  editStationInfoService,
  delStationInfoListService
} from '@/api/station'
import { useFacilityStore } from '@/stores'
import { baseURL } from '@/utils/request'
import { staionCustomHttpRequest } from '@/api/upload'
// import loadJs from '@/utils/load.js'

const pageLoading = ref(true)
const emit = defineEmits(['url-change'])
const facilityStore = useFacilityStore()
const pageTotal = ref(0)
const pageData = ref({
  pageNum: 1,
  pageSize: 20,
  searchWord: '',
  stationType: '',
  payment: '',
  parkId: '',
  operatorId: '',
  stationId: ''
})
const tableData = ref([])
const multipleSelection = ref([]) // 多选数组容器
const selectShow = ref(false) // 对话框是否打开
const editOrAdd = ref(true) // 是否为编辑操作，否则为添加操作
const formData = ref() // 存储编辑或添加操作的当行对象
const ruleFormRef = ref() // 表单绑定
const innerVisible = ref(false) // 定位对话框的展示与否
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
      const rs = (await editStationInfoService(formData.value)).data.code
      if (rs === 200) ElMessage.success('编辑成功')
    } else {
      const rs = (await addStationInfoService(formData.value)).data.code
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
  if (pageData.value.stationId) {
    const rs = await getStationInfoByIdService(pageData.value.stationId)
    pageTotal.value = 1
    tableData.value = [rs.data.data]
  } else {
    if (facilityStore.parkOrOperator === '园区') pageData.value.parkId = facilityStore.fatherId[0] || ''
    else pageData.value.operatorId = facilityStore.fatherId[0] || ''
    const rs = await getStationInfoListService(pageData.value)
    pageTotal.value = rs.data.data.totalRow
    tableData.value = rs.data.data.records
  }
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
  if (facilityStore.parkOrOperator === '园区') facilityStore.fatherId[0] = pageData.value.parkId || 0
  else facilityStore.fatherId[0] = pageData.value.operatorId || 0
  emit('url-change')
  getStationInfoList()
}

// 信息添加逻辑
const handleAdd = () => {
  console.log('充电站信息添加逻辑')
  formData.value = {}
  if (facilityStore.parkOrOperator === '园区') formData.value.parkId = facilityStore.fatherId[0] || ''
  else formData.value.operatorId = facilityStore.fatherId[0] || ''
  editOrAdd.value = false
  selectShow.value = !selectShow.value
}

// 单行编辑操作
const handleEdit = (rowData) => {
  console.log('单行编辑操作')
  formData.value = JSON.parse(JSON.stringify(rowData))
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
      const rs = (await delStationInfoListService([id])).data.code
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
  const idArray = multipleSelection.value.map((item) => item.stationId)
  await ElMessageBox.confirm('你确认要删除多条信息么？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const rs = (await delStationInfoListService(idArray)).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getStationInfoList()
    })
    .catch(() => {
      return
    })
}

const handleExtend = (id) => {
  facilityStore.fatherId[1] = id
  facilityStore.stageValue = '充电设备'
  emit('url-change')
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
function checkPhoneNum(rule, value, callback) {
  const pass = /^\d{11}$/.test(value) // 11位数字的电话号码格式
  const pass2 = /^(\d{3,4}-)?\d{7,12}$/.test(value)
  // 使用正则表达式进行校验
  if (pass || pass2) callback()
  else callback(new Error('请输入有效的电话号码'))
}

// 校验规则
const rules = {
  feeCode: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  operatorId: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  parkId: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  stationName: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  countryCode: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  areaCode: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  stationAddress: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  stationType: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  stationStatus: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  stationLng: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  stationLat: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  stationConstruction: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  businessHours: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  electricityFee: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  serviceFee: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  parkFee: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  payment: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  serviceTel: [
    { required: true, message: '未输入任何内容', trigger: 'manual' },
    { validator: checkPhoneNum, trigger: 'manual' }
  ]
}

// 重置查询表单
const resetPageFrom = () => {
  console.log('重置查询表单')
  pageData.value = {
    pageNum: 1,
    pageSize: 20,
    searchWord: '',
    StationModel: '',
    Id: ''
  }
}

const handleLocate = async () => {
  console.log('处理定位逻辑')
  innerVisible.value = true
}

const getLocationAndAdress = (info) => {
  formData.value.stationLng = info.lng
  formData.value.stationLat = info.lat
  formData.value.stationAddress = info.address
}

const clearLocationAndAdress = () => {
  formData.value.stationLng = ''
  formData.value.stationLat = ''
  formData.value.stationAddress = ''
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
      :action="`${baseURL}/stations/excel`"
      :http-request="staionCustomHttpRequest"
      accept=".xlsx"
      :limit="1"
      with-credentials="true"
    >
      <el-button :icon="Upload" type="primary">选择文件</el-button>
      <el-link
        @click.stop
        href="https://intelli-park.oss-cn-beijing.aliyuncs.com/station-info.xlsx"
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
    :dialogTitle="'充电站信息' + (editOrAdd ? '编辑' : '添加')"
    @done-edit-add="DoneEditOrAdd"
  >
    <el-drawer
      v-model="innerVisible"
      size="85%"
      title="充电站经纬度获取"
      :show-close="false"
      append-to-body
    >
      <template #header="{ close }">
        <div class="drawer-header-father">
          <div class="drawer-header-content">
            <h3>充电站经纬度获取</h3>
            <span style="display: flex">
              <el-form :inline="true" style="height: 35px" alignment="end">
                <el-form-item label="经度" prop="stationLng" style="width: 200px">
                  <el-input v-model="formData.stationLng" placeholder="输入经度" clearable />
                </el-form-item>
                <el-form-item label="纬度" prop="stationLat" style="width: 200px">
                  <el-input v-model="formData.stationLat" placeholder="输入纬度" clearable />
                </el-form-item>
                <el-form-item label="详细地址" prop="stationAddress" style="width: 500px">
                  <el-input v-model="formData.stationAddress" placeholder="输入详细地址" clearable />
                </el-form-item>
              </el-form>
              <el-button type="warning" @click="clearLocationAndAdress">
                <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
                清空
              </el-button>
              <el-button type="primary" @click="close">
                <el-icon class="el-icon--left"><CircleCheckFilled /></el-icon>
                确认
              </el-button>
            </span>
          </div>
        </div>
      </template>
      <LocationBox
        :lng="formData.stationLng"
        :lat="formData.stationLat"
        @get-location="getLocationAndAdress"
      />
    </el-drawer>
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="auto" status-icon>
      <el-row justify="space-between">
        <el-form-item label="计费模型" prop="feeCode" style="width: 360px">
          <el-input v-model="formData.feeCode" placeholder="输入计费模型" clearable />
        </el-form-item>
        <el-form-item label="园区ID" prop="parkId" style="width: 360px">
          <el-input v-model="formData.parkId" placeholder="请输入园区ID" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="运营商ID" prop="operatorId" style="width: 360px">
          <el-input v-model="formData.operatorId" placeholder="输入运营商ID" clearable />
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours" style="width: 360px">
          <el-date-picker
            v-model="formData.businessHours"
            type="datetime"
            placeholder="选择时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD h:m:s"
            :disabled="formData.vip === 0"
          />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="站名" prop="stationName" style="width: 360px">
          <el-input v-model="formData.stationName" placeholder="输入站名" clearable />
        </el-form-item>
        <el-form-item label="国家代码" prop="countryCode" style="width: 360px">
          <el-input v-model="formData.countryCode" placeholder="输入国家代码" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="辖区编码" prop="areaCode" style="width: 360px">
          <el-input v-model="formData.areaCode" placeholder="输入辖区编码" clearable />
        </el-form-item>
        <el-form-item label="建设场所" prop="areaCode" style="width: 360px">
          <el-select v-model="formData.stationConstruction" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in stationConstructionStatic"
              :key="index"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="服务电话" prop="serviceTel" style="width: 360px">
          <el-input v-model="formData.serviceTel" placeholder="输入服务电话" clearable />
        </el-form-item>
        <el-form-item label="支付方式" prop="payment" style="width: 360px">
          <el-select v-model="formData.payment" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in ['刷卡', '线上', '现金']"
              :key="index"
              :label="item"
              :value="index + 1"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="站点状态" prop="stationStatus" style="width: 360px">
          <el-select v-model="formData.stationStatus" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in stationStatusStatic"
              :key="index"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="站点类型" prop="stationType" style="width: 360px">
          <el-select v-model="formData.stationType" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in stationTypeStatic"
              :key="index"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="经度" prop="stationLng" style="width: 320px">
          <el-input v-model="formData.stationLng" placeholder="输入经度" clearable />
        </el-form-item>
        <el-form-item label="纬度" prop="stationLat" style="width: 320px">
          <el-input v-model="formData.stationLat" placeholder="输入纬度" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLocate" :icon="Location">定位</el-button>
        </el-form-item>
      </el-row>

      <el-row justify="space-between">
        <el-form-item label="详细地址" prop="stationAddress" style="width: 100%">
          <el-input
            v-model="formData.stationAddress"
            placeholder="输入详细地址"
            clearable
            type="textarea"
            :rows="1"
          />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="站点引导" prop="siteGuide" style="width: 100%">
          <el-input
            v-model="formData.siteGuide"
            placeholder="输入站点引导"
            clearable
            type="textarea"
            :rows="1"
          />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="备注" prop="stationNote" style="width: 100%">
          <el-input
            v-model="formData.stationNote"
            placeholder="输入备注"
            clearable
            type="textarea"
            :rows="1"
          />
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
      <el-form-item label="站点类型">
        <el-select v-model="pageData.stationType" placeholder="请选择" clearable style="width: 200px">
          <el-option
            v-for="(item, index) in stationTypeStatic"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="站点状态">
        <el-select v-model="pageData.stationStatus" placeholder="请选择" clearable style="width: 200px">
          <el-option
            v-for="(item, index) in stationStatusStatic"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="建设场所">
        <el-select
          v-model="pageData.stationConstruction"
          placeholder="请选择"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="(item, index) in stationConstructionStatic"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="pageData.payment" placeholder="请选择" clearable style="width: 120px">
          <el-option
            v-for="(item, index) in ['刷卡', '线上', '现金']"
            :key="index"
            :label="item"
            :value="index + 1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="园区ID">
        <el-input
          v-model="pageData.parkId"
          :formatter="(value) => value.replace(/\D/g, '')"
          :parser="(value) => value.replace(/\D/g, '')"
          placeholder="输入园区id"
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
      <el-form-item label="充电站ID">
        <el-input
          v-model="pageData.stationId"
          :formatter="(value) => value.replace(/\D/g, '')"
          :parser="(value) => value.replace(/\D/g, '')"
          placeholder="输入充电站id"
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
    <el-table-column type="expand">
      <template #default="props">
        <div style="padding: 20px 10px 20px 40px">
          <div class="extend-content">
            <strong>园区ID：</strong>
            {{ props.row.parkId }}
          </div>
          <div class="extend-content">
            <strong>运营商ID：</strong>
            {{ props.row.operatorId }}
          </div>
          <div class="extend-content">
            <strong>付费模型ID：</strong>
            {{ props.row.feeCode }}
          </div>
          <div class="extend-content">
            <strong>国家代码：</strong>
            {{ props.row.areaCode }}
          </div>
          <div class="extend-content">
            <strong>省市辖区编码：</strong>
            {{ props.row.operatorId }}
          </div>
          <div class="extend-content">
            <strong>服务电话：</strong>
            {{ props.row.serviceTel }}
          </div>
          <div class="extend-content">
            <strong>经纬度：</strong>
            {{ props.row.stationLng + ', ' + props.row.stationLat }}
          </div>
          <div class="extend-content">
            <strong>营业时间：</strong>
            {{ props.row.businessHours }}
          </div>
          <div class="extend-content">
            <strong>充电费率：</strong>
            {{ props.row.electricityFee }}
          </div>
          <div class="extend-content">
            <strong>服务费率：</strong>
            {{ props.row.serviceFee }}
          </div>
          <div class="extend-content">
            <strong>停车费率：</strong>
            {{ props.row.parkFee }}
          </div>
          <div class="extend-content">
            <strong>详细地址：</strong>
            {{ props.row.stationAddress }}
          </div>
          <div class="extend-content">
            <strong>站点引导：</strong>
            {{ props.row.siteGuide }}
          </div>
          <div class="extend-content">
            <strong>备注：</strong>
            {{ props.row.stationNote }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="stationId" label="ID" width="100" />
    <el-table-column prop="stationName" label="名称" width="200" />
    <el-table-column prop="stationType" label="站点类型" width="180">
      <template #default="scope">
        <span>{{ stationTypeStatic.find((item) => item.key === scope.row.stationType).value }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="stationStatus" label="站点状态" width="180">
      <template #default="scope">
        <span>{{ stationStatusStatic.find((item) => item.key === scope.row.stationStatus).value }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="stationConstruction" label="建设场所" width="200">
      <template #default="scope">
        <span>{{
          stationConstructionStatic.find((item) => item.key === scope.row.stationConstruction).value
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="payment" label="支付方式" min-width="100">
      <template #default="scope">
        <span>{{ ['刷卡', '线上', '现金'][scope.row.payment - 1] }}</span>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="单行操作" width="270">
      <template #default="scope">
        <el-button text bg size="small" @click="handleExtend(scope.row.stationId)" :icon="ChatDotSquare">
          设备
        </el-button>
        <el-button text bg type="primary" size="small" @click="handleEdit(scope.row)" :icon="EditPen">
          编辑
        </el-button>
        <el-button
          text
          bg
          type="danger"
          size="small"
          @click="handleDelete(scope.row.stationId)"
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

.drawer-header-father {
  width: 100%;
  height: 0;
  position: relative;

  .drawer-header-content {
    width: 100%;
    height: 40px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
