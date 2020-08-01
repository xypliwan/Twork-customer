import Layout from '@/layout/Index'

//公共
export default [
  {
    path: '/entrance/login',
    component: () => import('@/views/entrance/Login.vue'),
    meta: {
      authentication: false,
      keepAlive: false
    }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'home', //首页
        name: 'Home',
        component: () => import('@/views/home/Indexs.vue'),
        meta: {
          title: '首页',
          name: 'Home',
          authentication: true
          // keepAlive: true
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'user-center', //个人中心
        name: 'UserCenter',
        component: () => import('@/views/userCenter/Index.vue'),
        meta: {
          title: '个人中心',
          name: 'UserCenter',
          authentication: true
          // keepAlive: true
        }
      }
    ]
  },
  {
    path: '/okr',
    component: Layout,
    children: [
      {
        path: 'list', //ORK管理
        name: 'OkrManage',
        component: () => import('@/views/okrManage/Index.vue'),
        meta: {
          title: 'OKR管理',
          name: 'OkrManage',
          authentication: true
          // keepAlive: true
        }
      }
    ]
  },
  {
    path: '/target',
    component: Layout,
    children: [
      {
        path: 'target-kanban', //目标看板
        name: 'target-kanban',
        component: () => import('@/views/targetKanban/index.vue'),
        meta: {
          title: '目标看板',
          name: 'target-kanban',
          authentication: true,
          keepAlive: true
        }
      }
    ]
  }
]
