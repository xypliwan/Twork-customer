import Layout from '@/layout/Index'

//公共
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'accept', //认可
        name: 'Accept',
        component: () => import('@/views/accept/Index.vue'),
        meta: {
          title: '认可',
          name: 'Accept',
          authentication: true
        }
      }
    ]
  }
]
