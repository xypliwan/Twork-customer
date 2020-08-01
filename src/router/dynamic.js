import Layout from '@/layout/Index'

//公共
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'dynamic', //动态
        name: 'Dynamic',
        component: () => import('@/views/dynamic/Index.vue'),
        meta: {
          title: '协同动态',
          name: 'Dynamic',
          authentication: true
        }
      }
    ]
  }
]
