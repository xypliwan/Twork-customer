import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import { getLocalStorage } from '_u/localStorage'
import common from './common' //公共
import dynamic from './dynamic' //动态
import report from './report' //汇报
import accept from './accept' //认可
import Layout from '@/layout/Index'
import target from './target' //目标
import flowManage from './flowManage' //流程管理
import schedule from './schedule' //日程管理
import workHours from './workHours' //工时管理

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

//authentication: true, 需要登录成功才能访问的页面

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  ...common,
  ...dynamic,
  ...report,
  ...accept,
  ...target,
  ...flowManage,
  ...schedule,
  ...workHours,
  {
    path: '*',
    component: Layout,
    children: [
      {
        path: '*',
        name: 'ErrorPage',
        component: () => import('@/views/404/Index.vue'),
        meta: {
          title: '404',
          name: 'ErrorPage',
          authentication: false
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.authentication && !getLocalStorage('access_token')) {
    next({
      path: '/entrance/login'
    })
    // next()
  } else {
    next()
  }
})
export default router
