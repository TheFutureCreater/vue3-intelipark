<script setup>
import { SwitchButton, Switch } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import ParkNameInput from './ParkNameInput.vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const router = useRouter()
// const userStore = useUserStore()
const routerWord = ref('')

// 导入路由，获取当前路由参数，经过处理保留二级路由，保证当前路由页面高亮
onMounted(() => {
  routerWord.value = router.currentRoute.value.path
})
router.beforeEach((to, from, next) => {
  routerWord.value = to.path
  next()
})
const handleCommand = async () => {
  // 退出操作
  await ElMessageBox.confirm('你确认要进行退出么？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })

  // 清除本地的数据 (token + user信息)
  userStore.token = ''
  userStore.user = {}
  router.push('/login')
}

const changeApp = async () => {
  await ElMessageBox.confirm('你确认要切换到管理端么？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  router.push('/admin')
}
</script>

<template>
  <div class="page-header">
    <div class="container">
      <div class="header-left">
        <h1 class="logo">
          <RouterLink to="/">数智充电</RouterLink>
        </h1>
        <div class="inputShell">
          <!-- <input type="text" v-model="parkid" placeholder="input your parkID" /> -->
          <ParkNameInput></ParkNameInput>
          <!-- <a href="javascripts:;" @click="goChart"></a> -->
        </div>
        <div style="display: flex; align-items: center; color: #fff; margin: 0 20px 0 auto">
          <strong style="margin-right: 10px">
            <div>{{ userStore.user.username }}</div>
            <div>{{ userStore.user.phoneNum }}</div>
          </strong>
          <span class="el-dropdown__box">
            <el-avatar src="https://img01.51jobcdn.com/yjs/img/avatar-big@2x-dbbbba5.png" />
            <el-icon size="18" @click="handleCommand" style="cursor: pointer">
              <SwitchButton />
            </el-icon>
            <el-icon size="18" @click="changeApp" style="cursor: pointer">
              <Switch />
            </el-icon>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-header {
  height: 60px;
  background-color: $ptscAColor;

  .container {
    justify-content: space-between;
    white-space: nowrap; /* 将文本处理为单行 */

    .header-left {
      display: flex;
      align-items: center;
      height: 60px;

      .el-dropdown__box {
        display: flex;
        align-items: center;

        .el-icon {
          color: #fff;
          margin-left: 10px;
        }

        &:active,
        &:focus {
          outline: none;
        }
      }

      .logo {
        width: 120px;
        margin-right: 20px;

        a {
          display: block;
          height: 60px;
          width: 100%;
          text-indent: -9999px;
          background: url('@/assets/imgs/logo3.png') no-repeat center / 40px auto;
        }
      }
    }

    // .app-header-nav {
    //   display: flex;
    //   height: 60px;
    //   align-items: center;

    //   li {
    //     font-size: 16px;
    //     height: 100%;

    //     a {
    //       padding: 0 20px;
    //       display: flex;
    //       align-items: center;
    //       height: 100%;
    //       width: 100%;
    //       color: #fff;
    //     }
    //   }
    // }
    .inputShell {
      width: 640px;
      height: 48px;
      // background-color: #fff;
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, 0);
      // border-radius: 24px;
      // border-radius: 0px;
      // input {
      //   width: 90%;
      //   height: 100%;
      //   border-top-left-radius: 24px;
      //   border-bottom-left-radius: 24px;
      //   font-size: 24px;
      //   text-indent: 1em;
      //   background-color: #fff;
      // }
      a {
        position: absolute;
        display: inline-block;
        height: 100%;
        width: 10%;
        border-top-right-radius: 24px;
        border-bottom-right-radius: 24px;
        background: #71c9ce no-repeat center url(/src/assets/screen/search.svg);
        transition: 0.3s;
        &:hover {
          box-shadow: 1px 1px 20px rgba($color: #ddd, $alpha: 0.3);
          background: steelblue no-repeat center url(/src/assets/screen/search.svg);
        }
      }
    }

    .highlight-font:hover {
      font-weight: bolder;
      color: #fff;
    }

    #current-menu {
      font-weight: bolder;
      box-shadow: inset 0 -3px 0 0 #409eff;

      span {
        color: #409eff;
      }
    }
  }
}
</style>
