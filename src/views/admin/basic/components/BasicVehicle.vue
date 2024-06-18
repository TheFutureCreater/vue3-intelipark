<script setup>
import { Delete, EditPen, Search, Plus, Refresh, ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'
import vehicleModelStatic from '@/assets/json/vehicleModel.json'
import {
  getVehicleInfoListService,
  // getVehicleInfoByIdService,
  delVehicleInfoByIdService,
  addVehicleInfoService,
  editVehicleInfoService,
  delVehicleInfoListService
} from '@/api/vehicle'

const pageLoading = ref(true)
const pageTotalCar = ref(0)
const pageDataCar = ref({
  pageNum: 1,
  pageSize: 20,
  searchWord: '',
  vehicleModel: '',
  userId: ''
})
const defaultFromDataCar = {
  vehicleId: 0,
  userId: 0,
  vehicleBrand: '',
  vehicleModel: 1,
  licencePlate: '',
  electricity: 0
}
const tableDataCar = ref([])
const multipleSelectionCar = ref([]) // 多选数组容器
const selectShowCar = ref(false) // 对话框是否打开
const editOrAdd = ref(true) // 是否为编辑操作，否则为添加操作
const fromDataCar = ref(defaultFromDataCar) // 存储编辑或添加操作的当行对象
const ruleFormRefCar = ref() // 表单绑定

// 确认对话框操作
const DoneCarEditOrAdd = async (operation) => {
  if (operation === 2) {
    selectShowCar.value = !selectShowCar.value
    console.log('取消对话框操作')
    if (ruleFormRefCar.value) ruleFormRefCar.value.resetFields()
  } else if (operation === 1) {
    console.log('确认对话框操作')
    // 提交表单进行校验
    if (ruleFormRefCar.value) await ruleFormRefCar.value.validate()
    selectShowCar.value = !selectShowCar.value
    if (editOrAdd.value) {
      const rs = (await editVehicleInfoService(fromDataCar.value)).data.code
      if (rs === 200) ElMessage.success('编辑成功')
    } else {
      const rs = (await addVehicleInfoService(fromDataCar.value)).data.code
      if (rs === 200) ElMessage.success('添加成功')
    }
    getVehicleInfoList()
  } else if (operation === 3) {
    console.log('重置对话框操作')
    // 重置表单校验
    if (ruleFormRefCar.value) ruleFormRefCar.value.resetFields()
  } else {
    console.log(Promise.reject('对话框返回数字错误'))
  }
  console.log('结束对话框操作')
  // getVehicleInfoList()
}

// 请求后端获取信息
const getVehicleInfoList = async () => {
  pageLoading.value = true
  const rs = await getVehicleInfoListService(pageDataCar.value)
  pageTotalCar.value = rs.data.data.totalRow
  tableDataCar.value = rs.data.data.records
  pageLoading.value = false
}
getVehicleInfoList()

// 处理多选逻辑
const handleSelectionChangeCar = (val) => {
  multipleSelectionCar.value = val
}

// 提交筛选条件
const onSubmitCar = () => {
  console.log('submit!')
  getVehicleInfoList()
}

// 信息添加逻辑
const handleAdd = () => {
  console.log('信息添加逻辑')
  fromDataCar.value = defaultFromDataCar
  editOrAdd.value = false
  selectShowCar.value = !selectShowCar.value
}

// 单行编辑操作
const handleEdit = (rowData) => {
  console.log('单行编辑操作')
  fromDataCar.value = JSON.parse(JSON.stringify(rowData))
  editOrAdd.value = true
  selectShowCar.value = !selectShowCar.value
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
      const rs = (await delVehicleInfoByIdService(id)).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getVehicleInfoList()
    })
    .catch(() => {
      return
    })
}

// 删除多行操作
const handleDelAll = async () => {
  if (multipleSelectionCar.value.length === 0) {
    ElMessage.error('未选中任何数据')
    return
  }
  const idArray = multipleSelectionCar.value.map((item) => item.id)
  await ElMessageBox.confirm('你确认要删除多条信息么？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const rs = (await delVehicleInfoListService(idArray)).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getVehicleInfoList()
    })
    .catch(() => {
      return
    })
}

// 每页显示数量改变
const handleSizeChange = () => {
  console.log(pageDataCar.value.pageSize)
  getVehicleInfoList()
}

// 页码发生变化
const handleCurrentChange = () => {
  console.log(pageDataCar.value.pageNum)
  getVehicleInfoList()
}

// 校验规则
function checkLicencePlate(rule, value, callback) {
  const pass =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(
      value
    )
  // 使用正则表达式进行校验
  if (pass) callback()
  else callback(new Error('请输入有效的车牌'))
}

// 校验规则
function checkElectricity(rule, value, callback) {
  const pass = /^\d+(\.\d{2})?$/.test(value)

  // 使用正则表达式进行校验
  if (pass) callback()
  else callback(new Error('请输入有效的电量（保留两位小数）'))
}

// 校验规则
const rules = {
  userId: [{ required: true, message: '未输入用户ID', trigger: 'manual' }],
  vehicleBrand: [{ required: true, message: '未输入汽车品牌', trigger: 'manual' }],
  licencePlate: [
    { required: true, message: '未输入车牌', trigger: 'manual' },
    { validator: checkLicencePlate, trigger: 'manual' }
  ],
  electricity: [
    { required: true, message: '未输入电量', trigger: 'manual' },
    { validator: checkElectricity, trigger: 'manual' }
  ]
}

// 重置查询表单
const resetPageFrom = () => {
  console.log('重置查询表单')
  pageDataCar.value = {
    pageNum: 1,
    pageSize: 20,
    searchWord: '',
    vehicleModel: '',
    userId: ''
  }
}
</script>

<template>
  <DialogBox
    :selectShow="selectShowCar"
    :dialogTitle="'车辆基础信息' + (editOrAdd ? '编辑' : '添加')"
    @done-edit-add="DoneCarEditOrAdd"
  >
    <el-form ref="ruleFormRefCar" :model="fromDataCar" :rules="rules" label-width="auto" status-icon>
      <el-row justify="space-between">
        <el-form-item label="用户id" prop="userId">
          <el-input
            v-model="fromDataCar.userId"
            :formatter="(value) => value.replace(/\D/g, '')"
            placeholder="输入用户id"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="汽车品牌" prop="vehicleBrand" style="width: 360px" clearable>
          <el-input v-model="fromDataCar.vehicleBrand" placeholder="请输入汽车品牌" />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="充电车型" prop="vehicleModel" style="width: 360px">
          <el-select v-model="fromDataCar.vehicleModel" placeholder="请选择">
            <el-option label="直流快充" :value="1" />
            <el-option label="交流慢充" :value="2" />
            <el-option label="交直流混合充电" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="licencePlate" style="width: 360px" clearable>
          <el-input v-model="fromDataCar.licencePlate" placeholder="请输入车牌号" />
        </el-form-item>
      </el-row>

      <el-row justify="space-between">
        <el-form-item label="电池容量" prop="electricity" style="width: 360px" clearable>
          <el-input v-model="fromDataCar.electricity" placeholder="请输入电池容量" />
        </el-form-item>
      </el-row>
    </el-form>
  </DialogBox>

  <PageContainer :title="true">
    <template #header>
      <span>用户车辆信息管理</span>
      <div>
        <el-button type="success" @click="handleAdd" :icon="Plus">添加</el-button>
      </div>
    </template>
    <template #content>
      <!-- <el-input
            v-model="pageDataCar.userId"
            :formatter="(value) => value.replace(/\D/g, '')"
            placeholder="输入用户id"
            clearable
            style="width: 200px"
          /> -->
      <div class="top-elform-query">
        <el-dropdown class="el-dropdown-del-all">
          <el-button type="primary">
            {{ multipleSelectionCar.length === 0 ? '未选中' : `选中${multipleSelectionCar.length}行` }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleDelAll">全部删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-form :inline="true" :model="pageDataCar" style="text-align: end">
          <el-form-item label="搜索关键字">
            <el-input
              v-model="pageDataCar.searchWord"
              placeholder="输入关键字"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="充电车型">
            <el-select
              v-model="pageDataCar.vehicleModel"
              placeholder="请选择"
              clearable
              style="width: 150px"
            >
              <el-option label="直流快充" value="1" />
              <el-option label="交流慢充" value="2" />
              <el-option label="交直流混合充电" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户id或用户名">
            <el-input
              v-model="pageDataCar.userId"
              placeholder="输入用户信息"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item>
            <el-button plain type="warning" @click="resetPageFrom" :icon="Refresh">重置</el-button>
            <el-button type="primary" @click="onSubmitCar" :icon="Search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="pageLoading"
        :data="tableDataCar"
        style="width: 100%"
        stripe
        highlight-current-row
        @selection-change="handleSelectionChangeCar"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column fixed show-overflow-tooltip prop="vehicleId" label="车辆ID" width="100" />
        <el-table-column fixed show-overflow-tooltip prop="userId" label="用户ID" width="100" />
        <el-table-column prop="vehicleBrand" label="车辆品牌" width="200" />
        <el-table-column prop="vehicleModel" label="充电车型" width="200">
          <template #default="scope">
            <span>{{
              [1, 2, 3].includes(scope.row.vehicleModel)
                ? vehicleModelStatic[scope.row.vehicleModel - 1]
                : '未知车型'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="licencePlate" label="车牌号" width="200" />
        <el-table-column prop="electricity" label="电池容量" min-width="200">
          <template #default="scope">
            <span>{{ scope.row.electricity + ' kWh' }}</span>
          </template>
        </el-table-column>
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
              @click="handleDelete(scope.row.vehicleId)"
              :icon="Delete"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="height: 20px"></div>
      <el-pagination
        v-model:current-page="pageDataCar.pageNum"
        v-model:page-size="pageDataCar.pageSize"
        :page-sizes="[10, 15, 20, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotalCar"
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
