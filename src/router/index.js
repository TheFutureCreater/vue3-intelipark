import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores'
import LoginPage from '@/views/login/LoginPage.vue'
import AdminLayoutContainer from '@/views/admin/layout/LayoutContainer.vue'
import ScreenLayout from '@/views/screen/layout/index.vue'
import AdminHomeIndex from '@/views/admin/home/index.vue'
import BasicScreen from '@/views/screen/basic/index.vue'
import BasicIndex from '@/views/admin/basic/index.vue'
import BasicUser from '@/views/admin/basic/components/BasicUser.vue'
import LogIndex from '@/views/admin/log/index.vue'
import LogCharge from '@/views/admin/log/components/LogCharge.vue'
import LogFee from '@/views/admin/log/components/LogFee.vue'
import LogFeedback from '@/views/admin/log/components/LogFeedback.vue'
import FacilityContainer from '@/views/admin/basic/components/FacilityContainer.vue'
import StationLocation from '@/views/admin/basic/components/StationLocation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginPage },
    {
      path: '/admin',
      redirect: '/admin/basic/location',
      component: AdminLayoutContainer,
      children: [
        {
          path: '/admin/home',
          component: AdminHomeIndex
        },
        {
          path: '/admin/basic',
          component: BasicIndex,
          children: [
            { path: '/admin/basic/equip', component: FacilityContainer },
            { path: '/admin/basic/location', component: StationLocation },
            { path: '/admin/basic/user', component: BasicUser }
          ]
        },
        {
          path: '/admin/log',
          component: LogIndex,
          children: [
            { path: '/admin/log/feedback', component: LogFeedback },
            { path: '/admin/log/fee', component: LogFee },
            { path: '/admin/log/charge', component: LogCharge }
          ]
        }
      ]
    },
    {
      path: '/screen',
      // redirect: '/screen/charts',
      component: ScreenLayout,
      children: [{ path: '/screen/charts', component: BasicScreen }]
    }
  ]
})

// 登录访问拦截 => 默认是直接放行的,根据返回值决定，是放行还是拦截
// 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
// router.beforeEach((to) => {
//   const useStore = useUserStore()
//   if (!useStore.token && to.path !== '/login') return '/login'
// })

export default router
