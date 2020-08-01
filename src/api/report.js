import axios from '@/utils/axios'
// 汇报模块

//模板列表
export function reportList() {
  return axios({
    url: `/report-frontend/list`,
    method: 'get'
  })
}

// 模板详情
export function reportDetail(data = {}) {
  return axios({
    url: `/report-frontend/detail`,
    method: 'get',
    params: data
  })
}

//获取任务/流程等内容
export function reportFrontendContent(data = {}) {
  return axios({
    url: `/report-frontend/content`,
    method: 'get',
    params: data
  })
}

// 添加汇报
export function addReportCont(data = {}) {
  return axios({
    url: `/report-frontend/add-list`,
    method: 'post',
    data
  })
}

// 汇报列表
export function getReportList(data = {}) {
  return axios({
    url: `/report-frontend/get-list`,
    method: 'get',
    params: data
  })
}

// 汇报详情
export function listDetail(data = {}) {
  return axios({
    url: `/report-frontend/list-detail`,
    method: 'get',
    params: data
  })
}

//汇报点赞或者取消点赞
export function setLink(data = {}) {
  return axios({
    url: `/report-frontend/like-or-unlike`,
    method: 'post',
    data
  })
}

// 汇报评论
export function reportFrontendReply(data = {}) {
  return axios({
    url: `/report-frontend/reply`,
    method: 'post',
    data
  })
}
