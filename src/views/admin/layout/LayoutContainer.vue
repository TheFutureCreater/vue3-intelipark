<script setup>
import {
  User,
  SwitchButton,
  House,
  Compass,
  MessageBox,
  Operation,
  OfficeBuilding,
  ChatLineRound,
  Tickets,
  CreditCard,
  Switch
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const router = useRouter()
import { useRouter } from 'vue-router'
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
  await ElMessageBox.confirm('你确认要切换到大屏端么？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  router.push('/screen')
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-scrollbar>
        <div class="el-aside__logo"></div>
        <div class="layout-title">数智充电管理系统</div>
        <el-menu
          active-text-color="#ffd04b"
          background-color="#232323"
          :default-active="$route.path"
          text-color="#fff"
          router
          :default-openeds="['/admin/home', '/admin/basic', '/admin/stats', '/admin/log']"
        >
          <!-- 首页 -->

          <el-menu-item index="/screen">
            <el-icon>
              <House />
            </el-icon>
            <span>大屏总览</span>
          </el-menu-item>

          <!-- 基础信息管理页 -->
          <el-sub-menu index="/admin/basic">
            <template #title>
              <el-icon>
                <MessageBox />
              </el-icon>
              <span>基础信息</span>
            </template>

            <el-menu-item index="/admin/basic/equip">
              <el-icon>
                <OfficeBuilding />
              </el-icon>
              <span>场所设备</span>
            </el-menu-item>
            <el-menu-item index="/admin/basic/location">
              <el-icon>
                <Compass />
              </el-icon>
              <span>地图总览</span>
            </el-menu-item>
            <el-menu-item index="/admin/basic/user">
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 运营规则管理页 -->
          <el-sub-menu index="/admin/log">
            <template #title>
              <el-icon>
                <Operation />
              </el-icon>
              <span>运营规则</span>
            </template>

            <!-- 展开的内容 - 默认插槽 -->
            <el-menu-item index="/admin/log/fee">
              <el-icon>
                <CreditCard />
              </el-icon>
              <span>付费模型</span>
            </el-menu-item>
            <el-menu-item index="/admin/log/charge">
              <el-icon>
                <Tickets />
              </el-icon>
              <span>充电记录</span>
            </el-menu-item>
            <el-menu-item index="/admin/log/feedback">
              <el-icon>
                <ChatLineRound />
              </el-icon>
              <span>用户反馈</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header height="60px">
        <div></div>
        <div
          style="
            display: flex;
            align-items: center;
            background-color: rgb(255, 255, 255, 60%);
            padding: 0 10px;
          "
        >
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
      </el-header>
      <el-main style="user-select: text; padding: 0">
        <RouterView />
      </el-main>
      <!-- <el-footer>===========================</el-footer> -->
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background: url('@/assets/imgs/asideBg.png') no-repeat left bottom / 200px auto;
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/imgs/logo3.png') no-repeat center / 80px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .layout-title {
    font-weight: bold;
    font-size: large;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
  }

  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url('@/assets/imgs/headerBg.png') no-repeat right top / auto 60px;
    background-color: #fff;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
