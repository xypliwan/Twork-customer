import axios from '@/utils/axios'
//目标地图

// 获取目标地图
export function targetListMap(data = {}) {
  return axios({
    url: `/target/list-chart`,
    method: 'get',
    params: data
  })
}

//目标地图列表模式二级部门信息
export function getDepartmentNameList(data = {}) {
  return axios({
    url: `/target/list-chart-list-second-department`,
    method: 'get',
    params: data
  })
}

//目标地图列表模式二级部门具体目标信息
export function getDepartmentSecondList(data = {}) {
  return axios({
    url: `/target/list-chart-list`,
    method: 'get',
    params: data
  })
}
