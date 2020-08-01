import axios from '@/utils/axios'
//流程管理

// 分组列表
export function groupList(data) {
  return axios({
    url: `/process-frontend/list`,
    method: 'get',
    params: data
  })
}
// 流程详情
export function processDetail(data) {
  return axios({
    url: `/process/detail`,
    method: 'get',
    params: data
  })
}
// 流程审批提交
export function processFrontendAdd(data) {
  return axios({
    url: `/process-frontend/add`,
    method: 'post',
    data
  })
}
// 流程列表
export function processGetList(data) {
  return axios({
    url: `/process-frontend/get-list`,
    method: 'get',
    params: data
  })
}
// 流程详情
export function processListDetail(data) {
  return axios({
    url: `/process-frontend/list-detail`,
    method: 'get',
    params: data
  })
}
// 更新流程状态或者节点状态
export function updateStepStatus(data) {
  return axios({
    url: `/process-frontend/update-step-or-list-status`,
    method: 'post',
    data
  })
}

// 新增检查项
export function addCheck(data) {
  return axios({
    url: `/process-frontend/add-check`,
    method: 'post',
    data
  })
}
// 编辑检查项
export function updateCheck(data) {
  return axios({
    url: `/process-frontend/update-check`,
    method: 'post',
    data
  })
}
// 删除检查项
export function deleteCheck(data) {
  return axios({
    url: `/process-frontend/delete-check`,
    method: 'post',
    data
  })
}
// 完成检查项
export function completeCheck(data) {
  return axios({
    url: `/process-frontend/complete-check`,
    method: 'post',
    data
  })
}
// 完成或取消检查项
export function completeOrCancleCheck(data) {
  return axios({
    url: `/process-frontend/complete-or-cancle-check`,
    method: 'post',
    data
  })
}

// 评论
export function processrreply(data) {
  return axios({
    url: `process-frontend/reply`,
    method: 'post',
    data
  })
}

// 显示我的审批数目
export function getListCountAll() {
  return axios({
    url: `/process-frontend/get-list-count-all`,
    method: 'get'
  })
}

// 转交审批步骤处理人
export function updateProcessListPeople(data) {
  return axios({
    url: `/process-frontend/update-process-list-people`,
    method: 'post',
    data
  })
}
// 获取审批明细
export function listDetail(data) {
  return axios({
    url: `/process-frontend/list-detail`,
    method: 'get',
    params: data
  })
}
// 流程催办
export function addUrge(data) {
  return axios({
    url: `/process-frontend/add-urge`,
    method: 'post',
    data
  })
}
