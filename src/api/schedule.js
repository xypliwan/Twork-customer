import axios from '@/utils/axios'
//日程模块

// 日程组列表
export function scheduleGroupList(params) {
  return axios({
    url: `/schedule-group/list`,
    method: 'get',
    params
  })
}

// 获取日程组明细
export function scheduleGroupDetail(params) {
  return axios({
    url: `/schedule-group/detail`,
    method: 'get',
    params
  })
}
// 添加日程组
export function scheduleGroupAdd(data = {}) {
  return axios({
    url: `/schedule-group/add`,
    method: 'post',
    data
  })
}

// 更新日程组详情
export function scheduleGroupUpdate(data) {
  return axios({
    url: `/schedule-group/update`,
    method: 'post',
    data
  })
}
// 删除日程组
export function scheduleGroupDel(data) {
  return axios({
    url: `/schedule-group/del`,
    method: 'post',
    data
  })
}
// 添加日程
export function scheduleAdd(data) {
  return axios({
    url: `/schedule/add`,
    method: 'post',
    data
  })
}

// 日程详情
export function scheduleDetail(params) {
  return axios({
    url: `/schedule/detail`,
    method: 'get',
    params
  })
}
// 更新日程
export function scheduleUpdate(data) {
  return axios({
    url: `/schedule/update`,
    method: 'post',
    data
  })
}
// 我的日程任务列表
export function scheduleGetMyList(params) {
  return axios({
    url: `/schedule/get-my-list`,
    method: 'get',
    params
  })
}

// 日程列表(搜索框下)
export function scheduleList(params) {
  return axios({
    url: `/schedule/list`,
    method: 'get',
    params
  })
}
// 任务列表(搜索框下)
export function scheduleTaskList(params) {
  return axios({
    url: `/schedule/task-list`,
    method: 'get',
    params
  })
}

// 获取日程模块列表
export function getScheduleModule(params) {
  return axios({
    url: `/schedule/get-schedule-module`,
    method: 'get',
    params
  })
}

// 日程组前置条件
export function scheduleGroupfilter(params) {
  return axios({
    url: `/schedule-group/get-list-filter`,
    method: 'get',
    params
  })
}
// 获取可订阅日程组列表
export function getOpenList(params) {
  return axios({
    url: `/schedule-group/get-open-list`,
    method: 'get',
    params
  })
}
//订阅日程组
export function userSubscribe(data) {
  return axios({
    url: `/schedule-group-user/subscribe`,
    method: 'post',
    data
  })
}
//退出参与日程
export function userQuit(data) {
  return axios({
    url: `/schedule-group-user/quit`,
    method: 'post',
    data
  })
}
