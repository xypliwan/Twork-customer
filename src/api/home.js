import axios from '@/utils/axios'

//首页广告
export function adList() {
  return axios({
    url: `/ad/list`,
    method: 'get'
  })
}

//前台及后台管理系统首页广告
export function listAllUrl() {
  return axios({
    url: `/ad/list-all-url`,
    method: 'get'
  })
}

//首页公告
export function announcementList(data = {}) {
  return axios({
    url: `/announcement/list`,
    method: 'get',
    params: data
  })
}

//首页公告详情
export function announcementDetail(data = {}) {
  return axios({
    url: `/announcement/detail`,
    method: 'get',
    params: data
  })
}

//首页任务统计
export function taskListCount() {
  return axios({
    url: `/task/all-target-task-list-count`,
    method: 'get'
  })
}

//首页任务折线图
export function taskCountLog(data) {
  return axios({
    url: `/task-count-log/list`,
    method: 'get',
    params: data
  })
}

//首页关闭未绑定的微信提示
export function closeWxTip(data) {
  return axios({
    url: `/user/close-wx-tip`,
    method: 'post',
    data
  })
}

//首页流程数量统计
export function flowCount() {
  return axios({
    url: `/process/get-home-process-num`,
    method: 'get'
  })
}
