<script setup>
import { ref } from 'vue'
import { Delete, EditPen, Search, Refresh, ArrowDown, ChatDotSquare } from '@element-plus/icons-vue'
import {
  getOperatorInfoListService,
  addOperatorInfoService,
  editOperatorInfoService,
  delOperatorInfoListService
} from '@/api/operator'
import { useFacilityStore } from '@/stores'

const pageLoading = ref(true)
const emit = defineEmits(['url-change'])
const facilityStore = useFacilityStore()
const pageTotal = ref([]) // 数据总数
const pageData = ref({
  pageNum: 1,
  pageSize: 20,
  searchWord: ''
}) // 分页条件数据
const tableData = ref([]) // 获取的数据列表
const ruleFormRef = ref() // 表单绑定
const multipleSelection = ref([]) // 多选数组容器
const selectShow = ref(false) // 对话框是否打开
const fromData = ref() // 存储编辑或添加操作的当行对象
const editOrAdd = ref(true) // 是否为编辑操作，否则为添加操作

const getOperatorInfoList = async () => {
  pageLoading.value = true
  const rs = await getOperatorInfoListService(pageData.value)
  pageTotal.value = rs.data.data.totalRow
  tableData.value = rs.data.data.records
  pageLoading.value = false
}
getOperatorInfoList()

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
      const rs = (await editOperatorInfoService(fromData.value)).data.code
      if (rs === 200) ElMessage.success('编辑成功')
    } else {
      const rs = (await addOperatorInfoService(fromData.value)).data.code
      if (rs === 200) ElMessage.success('添加成功')
    }
    getOperatorInfoList()
  } else if (operation === 3) {
    console.log('重置对话框操作')
    // 重置表单校验
    if (ruleFormRef.value) ruleFormRef.value.resetFields()
  } else {
    console.log(Promise.reject('对话框返回数字错误'))
  }
  console.log('结束对话框操作')
  // getInfoList()
}

// 处理多选逻辑
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 提交筛选条件
const onSubmit = () => {
  emit('url-change')
  console.log('submit!')
  getOperatorInfoList()
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
      const rs = (await delOperatorInfoListService([id])).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getOperatorInfoList()
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
      const rs = (await delOperatorInfoListService(idArray)).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getOperatorInfoList()
    })
    .catch(() => {
      return
    })
}

// 信息添加逻辑
const handleAdd = () => {
  console.log('运营商信息添加逻辑')
  fromData.value = {}
  editOrAdd.value = false
  selectShow.value = !selectShow.value
}

const handleExtend = (id) => {
  facilityStore.stageValue = '充电站'
  facilityStore.fatherId[0] = id
  facilityStore.parkOrOperator = '运营商'
  console.log('数据展开' + id + '==============facilityStore.stageValue: ' + facilityStore.stageValue)
  emit('url-change')
}

// 校验规则
function checkPhoneNum(rule, value, callback) {
  const pass = /^\d{11}$/.test(value) // 11位数字的电话号码格式
  // 使用正则表达式进行校验
  if (pass) callback()
  else callback(new Error('请输入有效的手机号'))
}

// 校验规则
const rules = {
  operatorName: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  operatorRegAddress: [{ required: true, message: '未输入任何内容', trigger: 'manual' }],
  operatorTel1: [
    { required: true, message: '未输入电话号码', trigger: 'manual' },
    { validator: checkPhoneNum, trigger: 'manual' }
  ],
  operatorTel2: [
    { required: true, message: '未输入电话号码', trigger: 'manual' },
    { validator: checkPhoneNum, trigger: 'manual' }
  ]
}

// 每页显示数量改变
const handleSizeChange = () => {
  console.log(pageData.value.pageSize)
  getOperatorInfoList()
}

// 页码发生变化
const handleCurrentChange = () => {
  console.log(pageData.value.pageNum)
  getOperatorInfoList()
}

// 重置查询表单
const resetPageFrom = () => {
  console.log('重置查询表单')
  pageData.value = {
    pageNum: 1,
    pageSize: 20,
    searchWord: ''
  }
}

defineExpose({
  handleAdd
})
</script>

<template>
  <DialogBox
    :selectShow="selectShow"
    :dialogTitle="'运营商基础信息' + (editOrAdd ? '编辑' : '添加')"
    @done-edit-add="DoneEditOrAdd"
  >
    <el-form ref="ruleFormRef" :model="fromData" :rules="rules" label-width="auto" status-icon>
      <el-row justify="space-between">
        <el-form-item label="名称" prop="operatorName">
          <el-input
            v-model="fromData.operatorName"
            placeholder="输入名称"
            clearable
            style="width: 290px"
          />
        </el-form-item>
        <el-form-item label="注册地址" prop="operatorRegAddress" style="width: 360px">
          <el-input v-model="fromData.operatorRegAddress" placeholder="请输入注册地址" clearable />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="手机号1" prop="operatorTel1" style="width: 360px">
          <el-input v-model="fromData.operatorTel1" placeholder="请输入电话1" clearable />
        </el-form-item>
        <el-form-item label="手机号2" prop="operatorTel2" style="width: 360px">
          <el-input v-model="fromData.operatorTel2" placeholder="请输入电话2" clearable />
        </el-form-item>
      </el-row>
    </el-form>
  </DialogBox>

  <div class="park-and-operator">
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
            <h4>备注：</h4>
            <p>{{ props.row.operatorNote }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="operatorId" label="ID" width="120" />
      <el-table-column prop="operatorName" label="名称" width="200" />
      <el-table-column prop="operatorTel1" label="电话1" width="200" />
      <el-table-column prop="operatorTel2" label="电话2" width="200" />
      <el-table-column prop="operatorRegAddress" label="注册地址" min-width="300" />

      <el-table-column fixed="right" label="单行操作" width="270">
        <template #default="scope">
          <el-button
            text
            bg
            size="small"
            @click="handleExtend(scope.row.operatorId)"
            :icon="ChatDotSquare"
          >
            旗下电站
          </el-button>
          <el-button text bg type="primary" size="small" @click="handleEdit(scope.row)" :icon="EditPen">
            编辑
          </el-button>
          <el-button
            text
            bg
            type="danger"
            size="small"
            @click="handleDelete(scope.row.operatorId)"
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
  </div>
</template>

<style lang="scss" scoped>
.park-and-operator {
  width: 100%;
}

.top-elform-query {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
