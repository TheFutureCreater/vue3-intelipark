import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { userGetInfoService } from '../../api/user'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'intellipark-user',
  () => {
    const token = ref('')
    const user = ref({})

    return {
      token,
      user
    }
  },
  {
    persist: true
  }
)
