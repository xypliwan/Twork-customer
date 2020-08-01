import Layout from '@/layout/Index'

//公共
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'report', //汇报
        name: 'Report',
        component: () => import('@/views/report/index.vue'),
        meta: {
          title: '汇报',
          name: 'Report',
          authentication: true
        }
      },
      {
        path: 'write-report', //写汇报
        name: 'WriteReport',
        component: () => import('@/views/report/write-report/index.vue'),
        meta: {
          title: '写汇报',
          name: 'WriteReport',
          authentication: true
        }
      }
    ]
  }
]
