<script setup>
import { Delete, EditPen, Search, Plus, Refresh, ArrowDown } from '@element-plus/icons-vue'
import VehicleTable from './VehicleTable.vue'
import { ref } from 'vue'
import {
  getUserInfoListService,
  getUserInfoByIdService,
  addPersonInfoService,
  editPersonInfoService,
  delUserInfoListService
} from '@/api/user'

const pageLoading = ref(true)
const pageTotalUser = ref(0) // 数据总数
const pageDataUser = ref({
  pageNum: 1,
  pageSize: 20,
  searchWord: '',
  state: '',
  vip: '',
  role: '',
  userId: ''
}) // 分页条件数据
const tableDataUser = ref([]) // 获取的数据列表
const multipleSelectionUser = ref([]) // 多选数组容器
const selectShowUser = ref(false) // 对话框是否打开
const editOrAdd = ref(true) // 是否为编辑操作，否则为添加操作
const fromDataUser = ref() // 存储编辑或添加操作的当行对象
const ruleFormRefUser = ref() // 表单绑定

// 响应更改url参数
const handleUrlChange = () => {
  const urlParams = new URLSearchParams(window.location.search)
  if (pageDataUser.value.userId) urlParams.set('userId', pageDataUser.value.userId)

  // 检查 urlParams 是否包含任何参数
  const newUrl = urlParams.toString() === '' ? window.location.pathname : `?${urlParams}`
  // 使用当前的 history.state
  const currentState = history.state ? history.state : null
  // 替换当前历史记录，同时保留现有的 history.state
  window.history.replaceState(currentState, '', newUrl)
}

// 获取url请求参数
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const userId = urlParams.get('userId')
  if (userId) pageDataUser.value.userId = userId
  handleUrlChange()
}
getUrlParams()

// 确认对话框操作
const DoneUserEditOrAdd = async (operation) => {
  if (operation === 2) {
    selectShowUser.value = !selectShowUser.value
    console.log('取消对话框操作')
    if (ruleFormRefUser.value) ruleFormRefUser.value.resetFields()
  } else if (operation === 1) {
    console.log('确认对话框操作')
    // 提交表单进行校验
    if (ruleFormRefUser.value) await ruleFormRefUser.value.validate()
    selectShowUser.value = !selectShowUser.value
    if (editOrAdd.value) {
      const rs = (await editPersonInfoService(fromDataUser.value)).data.code
      if (rs === 200) ElMessage.success('编辑成功')
    } else {
      const rs = (await addPersonInfoService(fromDataUser.value)).data.code
      if (rs === 200) ElMessage.success('添加成功')
    }
    getUserInfoList()
  } else if (operation === 3) {
    console.log('重置对话框操作')
    // 重置表单校验
    if (ruleFormRefUser.value) ruleFormRefUser.value.resetFields()
  } else {
    console.log(Promise.reject('对话框返回数字错误'))
  }
  console.log('结束对话框操作')
  // getUserInfoList()
}

// 请求后端获取信息
const getUserInfoList = async () => {
  pageLoading.value = true
  const rs = await getUserInfoListService(pageDataUser.value)
  pageTotalUser.value = rs.data.data.totalRow
  tableDataUser.value = rs.data.data.records
  pageLoading.value = false
  handleUrlChange()
}

// 请求后端获取信息
const getUserInfoById = async () => {
  pageLoading.value = true
  const rs = await getUserInfoByIdService(pageDataUser.value.userId)
  pageTotalUser.value = 1
  tableDataUser.value = [rs.data.data]
  pageLoading.value = false
}

pageDataUser.value.userId ? getUserInfoById() : getUserInfoList()

// 处理多选逻辑
const handleSelectionChangeUser = (val) => {
  multipleSelectionUser.value = val
}

// 提交筛选条件
const onSubmitUser = () => {
  console.log('submit!')
  getUserInfoList()
}

// 信息添加逻辑
const handleAddUser = () => {
  console.log('信息添加逻辑')
  fromDataUser.value = {
    id: 0,
    username: '',
    state: 1,
    phoneNum: '',
    balance: 0,
    vip: 0,
    vipDisableTime: '',
    password: '',
    role: 'admin'
  }
  editOrAdd.value = false
  selectShowUser.value = !selectShowUser.value
}

// 单行编辑操作
const handleEditUser = (rowData) => {
  console.log('单行编辑操作')
  fromDataUser.value = JSON.parse(JSON.stringify(rowData))
  editOrAdd.value = true
  selectShowUser.value = !selectShowUser.value
}

// 单行删除操作
const handleDeleteUser = async (id) => {
  console.log('单行删除操作' + id)
  await ElMessageBox.confirm('你确认要删除该条信息么？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const rs = (await delUserInfoListService([id])).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getUserInfoList()
    })
    .catch(() => {
      return
    })
}

// 删除多行操作
const handleDelAllUser = async () => {
  if (multipleSelectionUser.value.length === 0) {
    ElMessage.error('未选中任何数据')
    return
  }
  const idArray = multipleSelectionUser.value.map((item) => item.id)
  await ElMessageBox.confirm('你确认要删除多条信息么？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const rs = (await delUserInfoListService(idArray)).data.code
      if (rs === 200) ElMessage.success('删除成功')
      getUserInfoList()
    })
    .catch(() => {
      return
    })
}

// 每页显示数量改变
const handleSizeChange = () => {
  console.log(pageDataUser.value.pageSize)
  getUserInfoList()
}

// 页码发生变化
const handleCurrentChange = () => {
  console.log(pageDataUser.value.pageNum)
  getUserInfoList()
}

// 会员到期日校验规则
function checkDisableTime(rule, value, callback) {
  const givenDate = new Date(value)
  const currentDate = new Date()
  console.log(value)
  if (givenDate > currentDate) callback()
  else callback(new Error('所选日期应该大于当前时间'))
}

// 电话号码校验规则
function checkPhoneNum(rule, value, callback) {
  const pass = /^\d{11}$/.test(value) // 11位数字的电话号码格式
  // 使用正则表达式进行校验
  if (pass) callback()
  else callback(new Error('请输入有效的手机号'))
}

// 金额校验规则
function checkBalance(rule, value, callback) {
  const pass = /^\d+(\.\d{2})?$/.test(value)
  // 使用正则表达式进行校验
  if (pass) callback()
  else callback(new Error('请输入有效的金额（保留两位小数）'))
}

// 密码校验规则
function checkPassword(rule, value, callback) {
  const pass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
  // 使用正则表达式进行校验
  if (pass) callback()
  else callback(new Error('请输入有效的金额（保留两位小数）'))
}

// 校验规则
const rulesUser = {
  username: [
    { required: true, message: '未输入用户名', trigger: 'manual' },
    { min: 1, max: 20, message: '用户名长度为1-20个字符', trigger: 'manual' }
  ],
  phoneNum: [
    { required: true, message: '未输入电话号码', trigger: 'manual' },
    { validator: checkPhoneNum, trigger: 'manual' }
  ],
  vipDisableTime: [
    { required: true, message: '未选择日期', trigger: 'manual' },
    { validator: checkDisableTime, trigger: 'manual' }
  ],
  balance: [
    { required: true, message: '未输入余额', trigger: 'manual' },
    { validator: checkBalance, trigger: 'manual' }
  ],
  password: [
    { required: true, message: '未输入密码', trigger: 'manual' },
    { min: 8, message: '密码长度至少为8个字符', trigger: 'manual' },
    { validator: checkPassword, message: '密码需要包含字母和数字', trigger: 'manual' }
  ]
}

// 重置查询表单
const resetPageFromUser = () => {
  console.log('重置查询表单')
  pageDataUser.value = {
    pageNum: 1,
    pageSize: 20,
    searchWord: '',
    state: '',
    vip: '',
    role: ''
  }
}
</script>

<template>
  <DialogBox
    :selectShow="selectShowUser"
    :dialogTitle="'用户基础信息' + (editOrAdd ? '编辑' : '添加')"
    @done-edit-add="DoneUserEditOrAdd"
  >
    <el-form
      ref="ruleFormRefUser"
      :model="fromDataUser"
      :rules="rulesUser"
      label-width="auto"
      status-icon
    >
      <el-row justify="space-between">
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="fromDataUser.role">
            <el-radio-button value="user">普通用户</el-radio-button>
            <el-radio-button value="admin">系统管理员</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户名" prop="username" style="width: 360px" clearable>
          <el-input v-model="fromDataUser.username" placeholder="请输入用户名" />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="账户状态" prop="state" style="width: 360px">
          <el-select v-model="fromDataUser.state" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="锁定" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNum" style="width: 360px" clearable>
          <el-input v-model="fromDataUser.phoneNum" placeholder="请输入电话号码" />
        </el-form-item>
      </el-row>

      <el-row justify="space-between">
        <el-form-item label="VIP身份" prop="vip">
          <el-switch
            v-model="fromDataUser.vip"
            :disabled="fromDataUser.role === 'admin'"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item
          label="VIP到期时间"
          :prop="fromDataUser.vip === 1 ? 'vipDisableTime' : ''"
          style="width: 360px"
        >
          <el-date-picker
            v-model="fromDataUser.vipDisableTime"
            type="datetime"
            placeholder="选择时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD h:m:s"
            :disabled="fromDataUser.vip === 0"
          />
        </el-form-item>
      </el-row>
      <el-row justify="space-between">
        <el-form-item label="用户余额" prop="balance" style="width: 360px">
          <el-input
            v-model="fromDataUser.balance"
            :disabled="fromDataUser.role === 'admin'"
            placeholder="输入用户余额"
          />
        </el-form-item>
        <el-form-item label="登录密码" prop="password" style="width: 360px">
          <el-input
            v-model="fromDataUser.password"
            type="password"
            placeholder="输入密码"
            show-password
          />
        </el-form-item>
      </el-row>
    </el-form>
  </DialogBox>

  <PageContainer :title="true">
    <template #header>
      <span>用户基础信息管理</span>
      <div>
        <el-button type="success" @click="handleAddUser" :icon="Plus">添加</el-button>
      </div>
    </template>

    <template #content>
      <div class="top-elform-query">
        <el-dropdown class="el-dropdown-del-all">
          <el-button type="primary">
            {{ multipleSelectionUser.length === 0 ? '未选中' : `选中${multipleSelectionUser.length}行` }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleDelAllUser">全部删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-form :inline="true" :model="pageDataUser" style="text-align: end">
          <el-form-item label="搜索关键字">
            <el-input
              v-model="pageDataUser.searchWord"
              placeholder="输入关键字"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="用户ID">
            <el-input
              v-model="pageDataUser.userId"
              :formatter="(value) => value.replace(/\D/g, '')"
              :parser="(value) => value.replace(/\D/g, '')"
              placeholder="输入用户ID"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="账户状态">
            <el-select v-model="pageDataUser.state" placeholder="请选择" clearable style="width: 200px">
              <el-option label="正常" value="1" />
              <el-option label="锁定" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="VIP身份">
            <el-select v-model="pageDataUser.vip" placeholder="请选择" clearable style="width: 200px">
              <el-option label="VIP用户" value="1" />
              <el-option label="非VIP用户" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="pageDataUser.role" placeholder="请选择" clearable style="width: 200px">
              <el-option label="普通用户" value="user" />
              <el-option label="系统管理员" value="admin" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button plain type="warning" @click="resetPageFromUser" :icon="Refresh">重置</el-button>
            <el-button type="primary" @click="onSubmitUser" :icon="Search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="pageLoading"
        :data="tableDataUser"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChangeUser"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="expand">
          <template #default="props">
            <div v-if="props.row.role === 'user'">
              <VehicleTable :userId="props.row.id" />
            </div>
            <div v-else style="text-align: center">无车辆信息</div>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="id" label="ID" width="100" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <span>{{ scope.row.role === 'admin' ? '管理员' : '用户' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="200" />
        <el-table-column prop="state" label="状态" width="100">
          <template #default="scope">
            <span>{{ scope.row.state === 1 ? '正常' : '锁定' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phoneNum" label="手机号" width="180" />
        <el-table-column prop="balance" label="账户余额" width="160" />
        <el-table-column prop="vip" label="VIP身份" min-width="300">
          <template #default="scope">
            <span>
              {{ scope.row.vip === 1 ? `VIP到期时间：${scope.row.vipDisableTime}` : '非VIP用户' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="单行操作" width="200">
          <template #default="scope">
            <el-button
              text
              bg
              type="primary"
              size="small"
              @click="handleEditUser(scope.row)"
              :icon="EditPen"
            >
              编辑
            </el-button>
            <el-button
              text
              bg
              type="danger"
              size="small"
              @click="handleDeleteUser(scope.row.id)"
              :icon="Delete"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="height: 20px"></div>
      <el-pagination
        v-model:current-page="pageDataUser.pageNum"
        v-model:page-size="pageDataUser.pageSize"
        :page-sizes="[10, 15, 20, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotalUser"
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
</style>
