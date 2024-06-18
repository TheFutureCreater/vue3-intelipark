<script setup>
import { userLoginService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const checkBox = ref(true)
const adminOrScreen = ref(true)
const form = ref()
const userStore = useUserStore()
const router = useRouter()
const formModel = ref({
  username: '',
  password: '',
  repassword: '',
  phoneNum: ''
}) // 整个的用于提交的form数据对象

// 电话号码校验规则
function checkPhoneNum(rule, value, callback) {
  const pass = /^\d{11}$/.test(value) // 11位数字的电话号码格式
  // 使用正则表达式进行校验
  if (pass) callback()
  else callback(new Error('请输入有效的手机号'))
}

// 密码校验规则
function checkPassword(rule, value, callback) {
  const pass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
  // 使用正则表达式进行校验
  if (pass) callback()
  else callback(new Error('请输入有效的金额（保留两位小数）'))
}

const rules = {
  username: [
    { required: true, message: '未输入用户名', trigger: 'blur' },
    { min: 5, message: '用户名必须是 5位 以上的字符', trigger: 'blur' }
  ],
  phoneNum: [
    { required: true, message: '未输入电话号码', trigger: 'manual' },
    { validator: checkPhoneNum, trigger: 'manual' }
  ],
  password: [
    { required: true, message: '未输入密码', trigger: 'manual' },
    { min: 8, message: '密码长度至少为8个字符', trigger: 'manual' },
    { validator: checkPassword, message: '密码需要包含字母和数字', trigger: 'manual' }
  ],
  repassword: [
    { required: true, message: '未输入密码', trigger: 'manual' },
    { min: 8, message: '密码长度至少为8个字符', trigger: 'manual' },
    { validator: checkPassword, message: '密码需要包含字母和数字', trigger: 'manual' },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

const login = async () => {
  await form.value.validate()
  const res = await userLoginService({
    username: formModel.value.username,
    password: formModel.value.password
  })
  // userStore.token = res.data.data.token
  // 提取Authorization头中的token
  const authHeader = res.headers['authorization'] || res.headers['Authorization'] || ''
  // 去除头部的"Bearer "以获取纯token
  userStore.token = authHeader ? authHeader.split(' ')[1] : ''
  userStore.user = {
    username: formModel.value.username,
    phoneNum: formModel.value.phoneNum
  }
  ElMessage.success('登录成功')
  if (adminOrScreen.value) router.push('/admin')
  else router.push('/screen')
}

const handleForget = () => {
  ElMessage.warning('仔细想想 就想起来了')
}
</script>

<template>
  <div class="login-page">
    <div class="bg"></div>
    <div class="form">
      <!-- 登录相关表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off">
        <el-form-item>
          <h1 v-if="adminOrScreen">管理端登录</h1>
          <h1 v-else>大屏端登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox v-model="checkBox">记住我</el-checkbox>
            <el-link type="primary" :underline="false" @click="handleForget">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-row justify="space-between">
          <el-form-item style="width: 120px">
            <el-button @click="login" class="button" type="primary"> 登录 </el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="adminOrScreen" @click="adminOrScreen = false" type="success">
              切换大屏端
            </el-button>
            <el-button v-else @click="adminOrScreen = true" type="primary"> 切换管理端 </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: flex;

  .bg {
    width: 55%;
    height: 100%;
    background:
      url('@/assets/imgs/logo.png') no-repeat 60% center / 240px auto,
      url('@/assets/imgs/login_bg.jpg') no-repeat center / cover;
    // border-radius: 0 20px 20px 0;
  }

  .form {
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    padding: 0 150px;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
