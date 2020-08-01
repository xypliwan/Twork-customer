import Layout from '@/layout/Index'

//流程管理
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'flowManage', //流程管理
        name: 'FlowManage',
        component: () => import('@/views/flowManage/Index.vue'),
        meta: {
          title: '流程管理',
          name: 'FlowManage',
          authentication: true
        }
      }
    ]
  }
]
