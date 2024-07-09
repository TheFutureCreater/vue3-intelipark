// import { useUserStore } from '@/stores'

import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/admin',
      redirect: '/admin/basic/location',
      component: () => import('@/views/admin/layout/LayoutContainer.vue'),
      children: [
        {
          path: '/admin/home',
          component: () => import('@/views/admin/home/index.vue')
        },
        {
          path: '/admin/basic',
          component: () => import('@/views/admin/basic/index.vue'),
          children: [
            {
              path: '/admin/basic/equip',
              component: () => import('@/views/admin/basic/components/FacilityContainer.vue')
            },
            {
              path: '/admin/basic/location',
              component: () => import('@/views/admin/basic/components/StationLocation.vue')
            },
            {
              path: '/admin/basic/user',
              component: () => import('@/views/admin/basic/components/BasicUser.vue')
            }
          ]
        },
        {
          path: '/admin/log',
          component: () => import('@/views/admin/log/index.vue'),
          children: [
            {
              path: '/admin/log/feedback',
              component: () => import('@/views/admin/log/components/LogFeedback.vue')
            },
            {
              path: '/admin/log/fee',
              component: () => import('@/views/admin/log/components/LogFee.vue')
            },
            {
              path: '/admin/log/charge',
              component: () => import('@/views/admin/log/components/LogCharge.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/screen',
      component: () => import('@/views/screen/layout/index.vue'),
      children: [{ path: '/screen/charts', component: () => import('@/views/screen/basic/index.vue') }]
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
