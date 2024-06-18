import axios from 'axios'
import { useUserStore } from '@/stores'
// import { ElMessage } from 'element-plus'
import router from '@/router'
// const baseURL = 'http://127.0.0.1:7069'
// const baseURL = 'https://intellipark.2ndtool.top'
const baseURL = 'https://mock.apipark.cn/m1/4245692-3886994-default'

const request = axios.create({
  // 基础地址，超时时间
  baseURL,
  timeout: 8000,
  withCredentials: true // 确保跨域请求时发送Cookie
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 1. 从pinia获取token数据
    const userStore = useUserStore()
    // 2. 按照后端的要求拼接token数据
    const token = userStore.token
    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (e) => Promise.reject(e)
)

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    // 摘取核心响应数据
    if (res.data.code === 200) {
      return res
    }

    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (res.data.code === 401) {
      ElMessage.error('请重新登录')
      router.push('/login')
    }

    // 处理业务失败, 给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
  },
  (err) => {
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      ElMessage.error('请重新登录')
      router.push('/login')
    }

    // 错误的特殊情况404
    if (err.response?.status === 404) {
      ElMessage.error('404 请求资源不存在')
      return
    }

    // 错误的特殊情况 => 断网或网络错误
    if (!err.response) {
      ElMessage.error('网络连接失败，请检查网络状态')
      return
    }

    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response.data.message || '服务异常')
    console.log(Promise.reject(err))
    return
  }
)

export default request
export { baseURL }
