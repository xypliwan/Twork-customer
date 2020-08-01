import Layout from '@/layout/Index'

//目标
export default [
  {
    path: '/target',
    component: Layout,
    children: [
      {
        path: 'target-kanban', //看吧
        name: 'target-kanban',
        component: () => import('@/views/targetKanban/index.vue'),
        meta: {
          title: '目标看板',
          name: 'target-kanban',
          authentication: true,
          keepAlive: true
        }
      },
      {
        path: 'target-map', //地图
        name: 'target-map',
        component: () => import('@/views/targetMap/index.vue'),
        meta: {
          title: '目标地图',
          name: 'target-map',
          authentication: true,
          keepAlive: true
        }
      }
    ]
  }
]
