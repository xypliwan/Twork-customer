import Layout from '@/layout/Index'

//系统设置
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'schedule', //日程
        name: 'schedule',
        component: () => import('@/views/schedule/Index.vue'),
        meta: {
          title: '日程',
          name: 'schedule',
          authentication: true
        }
      }
    ]
  }
]
