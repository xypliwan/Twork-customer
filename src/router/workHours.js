import Layout from '@/layout/Index'

//工时管理
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'work-hours',
        name: 'WorkHours',
        redirect: 'work-hours/write-work-hours',
        component: () => import('@/views/workHours/index.vue'),
        meta: {
          title: '填报工时',
          name: 'WorkHours',
          authentication: true
        },
        children: [
          {
            path: 'write-work-hours',
            name: 'WriteWorkHours',
            component: () =>
              import('@/views/workHours/writeWorkHours/index.vue'),
            meta: {
              title: '填报工时',
              name: 'WriteWorkHours',
              authentication: true
            }
          },
          {
            path: 'task-management',
            name: 'TaskManagement',
            component: () =>
              import('@/views/workHours/taskManagement/index.vue'),
            meta: {
              title: '任务管理',
              name: 'TaskManagement',
              authentication: true
            }
          },
          {
            path: 'my-working-hours',
            name: 'MyWorkingHours',
            component: () =>
              import('@/views/workHours/MyWorkingHours/index.vue'),
            meta: {
              title: '我的工时',
              name: 'MyWorkingHours',
              authentication: true
            }
          },
          {
            path: 'task-type',
            name: 'TaskType',
            component: () => import('@/views/workHours/taskType/index.vue'),
            meta: {
              title: '任务类型',
              name: 'TaskType',
              authentication: true
            }
          },
          {
            path: 'personnel-cost',
            name: 'PersonnelCost',
            component: () =>
              import('@/views/workHours/personnelCost/index.vue'),
            meta: {
              title: '人员成本费率',
              name: 'PersonnelCost',
              authentication: true
            }
          },
          {
            path: 'task-label',
            name: 'TaskLabel',
            component: () => import('@/views/workHours/taskLabel/index.vue'),
            meta: {
              title: '任务标签',
              name: 'TaskLabel',
              authentication: true
            }
          },
          {
            path: 'user-search',
            name: 'UserSearch',
            component: () => import('@/views/workHours/userSearch/index.vue'),
            meta: {
              title: '工时填报查询',
              name: 'UserSearch',
              authentication: true
            }
          },
          {
            path: 'statistical-report',
            name: 'StatisticalReport',
            component: () =>
              import('@/views/workHours/statisticalReport/index.vue'),
            meta: {
              title: '统计报表',
              name: 'StatisticalReport',
              authentication: true
            }
          },
          {
            path: 'project',
            name: 'Project',
            component: () => import('@/views/workHours/project/index.vue'),
            meta: {
              title: '项目',
              name: 'Project',
              authentication: true
            }
          },
          {
            path: 'project-list',
            name: 'ProjectList',
            component: () => import('@/views/workHours/projectList/index.vue'),
            meta: {
              title: '项目列表',
              name: 'ProjectList',
              authentication: true
            }
          }
        ]
      },
      {
        path: 'create-project',
        name: 'CreateProject',
        component: () => import('@/views/workHours/createProject/index.vue'),
        meta: {
          title: '新建项目',
          name: 'CreateProject',
          authentication: true
        }
      },
      {
        path: 'create-task',
        name: 'CreateTask',
        component: () => import('@/views/workHours/createTask/index.vue'),
        meta: {
          title: '新建任务',
          name: 'CreateTask',
          authentication: true
        }
      }
    ]
  }
]
