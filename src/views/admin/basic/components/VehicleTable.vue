<script setup>
import { Delete, EditPen, Search, Plus, Refresh, ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'
import vehicleModelStatic from '@/assets/json/vehicleModel.json'
import {
  getVehicleInfoListService,
  delVehicleInfoByIdService,
  addVehicleInfoService,
  editVehicleInfoService,
  delVehicleInfoListService
} from '@/api/vehicle'

const pageLoading = ref(true)
const fatherProps = defineProps({
  userId: Number
})

console.log('车辆Box获取user-id:' + fatherProps.userId)

const pageTotal = ref(0)
const pageData = ref({
  pageNum: 1,
  pageSize: 20,
  searchWord: '',
  vehicleModel: '',
  userId: fatherProps.userId
})
const tableData = ref([])
const multipleSelection = ref([]) // 多选数组容器
const selectShow = ref(false) // 对话框是否打开
const editOrAdd = ref(true) // 是否为编辑操作，否则为添加操作
const fromData = ref() // 存储编辑或添加操作的当行对象
const ruleFormRef = ref() // 表单绑定

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
      const rs = (await editVehicleInfoService(fromData.value)).data.code
      if (rs === 200) ElMessage.success('编辑成功')
    } else {
      const rs = (await addVehicleInfoService(fromData.value)).data.code
      if (rs === 200) ElMessage.success('添加成功')
    }
    getVehicleInfoList()
  } else if (operation === 3) {
    console.log('重置对话框操作')
    // 重置表单校验
    if (ruleFormRef.value) ruleFormRef.value.resetFields()
  } else {
    console.log(Promise.reject('对话框返回数字错误'))
  }
  console.log('结束对话框操作')
  // getVehicleInfoList()
}

// 请求后端获取信息
const getVehicleInfoList = async () => {
  pageLoading.value = true
  const rs = await getVehicleInfoListService(pageData.value)
  pageTotal.value = rs.data.data.totalRow
  tableData.value = rs.data.data.records
  pageLoading.value = false
}
getVehicleInfoList()

// 处理多选逻辑
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 提交筛选条件
const onSubmit = () => {
  console.log('submit!')
  getVehicleInfoList()
}

// 信息添加逻辑
const handleAdd = () => {
  console.log('信息添加逻辑')
  fromData.value = {
    vehicleId: 0,
    userId: 0,
    vehicleBrand: '',
    vehicleModel: 1,
    licencePlate: '',
    electricity: 0
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
  if (multipleSelection.value.length === 0) {
    ElMessage.error('未选中任何数据')
    return
  }
  const idArray = multipleSelection.value.map((item) => item.id)
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
  console.log(pageData.value.pageSize)
  getVehicleInfoList()
}

// 页码发生变化
const handleCurrentChange = () => {
  console.log(pageData.value.pageNum)
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
  pageData.value = {
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
    :selectShow="selectShow"
    :dialogTitle="'车辆基础信息' + (editOrAdd ? '编辑' : '添加')"
    @done-edit-add="DoneEditOrAdd"
  >
    <el-form ref="ruleFormRef" :model="fromData" :rules="rules" label-width="auto" status-icon>
      <el-row justify="space-between">
        <el-form-item label="用户id" prop="userId">
          <el-input
            v-model="fromData.userId"
            :formatter="(value) => value.replace(/\D/g, '')"
            :parser="(value) => value.replace(/\D/g, '')"
            placeholder="输入用户id"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="汽车品牌" prop="vehicleBrand" style="width: 360px" clearable>
          <el-input v-model="fromData.vehicleBrand" placeholder="请输入汽车品牌" />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="充电车型" prop="vehicleModel" style="width: 360px">
          <el-select v-model="fromData.vehicleModel" placeholder="请选择">
            <el-option label="直流快充" :value="1" />
            <el-option label="交流慢充" :value="2" />
            <el-option label="交直流混合充电" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="licencePlate" style="width: 360px" clearable>
          <el-input v-model="fromData.licencePlate" placeholder="请输入车牌号" />
        </el-form-item>
      </el-row>

      <el-row justify="space-between">
        <el-form-item label="电池容量" prop="electricity" style="width: 360px" clearable>
          <el-input v-model="fromData.electricity" placeholder="请输入电池容量" />
        </el-form-item>
      </el-row>
    </el-form>
  </DialogBox>

  <div class="box-container">
    <!-- <el-input
            v-model="pageData.userId"
            :formatter="(value) => value.replace(/\D/g, '')"
            :parser="(value) => value.replace(/\D/g, '')"
            placeholder="输入用户id"
            clearable
            style="width: 200px"
          /> -->
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
      <h1>用户车辆信息</h1>

      <el-form :inline="true" :model="pageData" style="text-align: end">
        <el-form-item label="搜索关键字">
          <el-input
            v-model="pageData.searchWord"
            placeholder="输入关键字"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="充电车型">
          <el-select v-model="pageData.vehicleModel" placeholder="请选择" clearable style="width: 150px">
            <el-option label="直流快充" value="1" />
            <el-option label="交流慢充" value="2" />
            <el-option label="交直流混合充电" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain type="warning" @click="resetPageFrom" :icon="Refresh">重置</el-button>
          <el-button type="primary" @click="onSubmit" :icon="Search">查询</el-button>
          <el-button type="success" @click="handleAdd" :icon="Plus">添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      border
      v-loading="pageLoading"
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column fixed show-overflow-tooltip prop="vehicleId" label="车辆ID" width="100" />
      <el-table-column fixed show-overflow-tooltip prop="userId" label="用户ID" width="100" />
      <el-table-column prop="vehicleBrand" label="车辆品牌" width="200" />
      <el-table-column prop="vehicleModel" label="充电车型" width="200">
        <template #default="scope">
          <div>
            {{
              [1, 2, 3].includes(scope.row.vehicleModel)
                ? vehicleModelStatic[scope.row.vehicleModel - 1]
                : '未知车型'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="licencePlate" label="车牌号" width="200" />
      <el-table-column prop="electricity" label="电池容量" min-width="200">
        <template #default="scope">
          <div>{{ scope.row.electricity + ' kWh' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="单行操作" width="200">
        <template #default="scope">
          <el-button text bg type="primary" size="small" @click="handleEdit(scope.row)" :icon="EditPen">
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

    <el-pagination
      style="margin-top: 10px"
      v-model:current-page="pageData.pageNum"
      v-model:page-size="pageData.pageSize"
      :page-sizes="[10, 15, 20, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      hide-on-single-page
    />
  </div>
</template>

<style lang="scss" scoped>
.box-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 20px 50px;
}

.top-elform-query {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 40px;
}
</style>
