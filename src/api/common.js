import axios from '@/utils/axios'
//公共模块

//上传图片/文件
export function commonUpload(data = {}) {
  return axios({
    url: `/common/upload`,
    method: 'post',
    data
  })
}

// 部门信息和相关人员
export function getDepartmentInfo(data = {}) {
  return axios({
    url: `/department/info`,
    method: 'get',
    params: data
  })
}
// 部门信息一级数组
export function departmentGetArr() {
  return axios({
    url: `/department/get-arr`,
    method: 'get'
  })
}

// 获取周期列表
export function getPeriodList() {
  return axios({
    url: `/period/list`,
    method: 'get'
  })
}

//获取目标类型
export function getTargetProjectList() {
  return axios({
    url: `/common/get-target-project`,
    method: 'get'
  })
}

//获取所有人员
export function getUserList() {
  return axios({
    url: `/user/list`,
    method: 'get'
  })
}

//获取工单消息和连接
export function getEcsMsg() {
  return axios({
    url: `/ecs/message-num`,
    method: 'get'
  })
}

//获取websocket服务器链接
export function getSocketUrl() {
  return axios({
    url: `/websocket/uri`,
    method: 'get'
  })
}

//设置用户的会话
export function setUserFd(data = {}) {
  return axios({
    url: `/websocket/set-user-fd`,
    method: 'post',
    data
  })
}

//添加广告访问量
export function adAddLog(data = {}) {
  return axios({
    url: `/ad/add-log`,
    method: 'post',
    data
  })
}
//添加公告访问量
export function announcementAddLog(data = {}) {
  return axios({
    url: `/announcement/add-log`,
    method: 'post',
    data
  })
}
//记录OKR点击次数
export function targetAddLog(data = {}) {
  return axios({
    url: `/target/add-log`,
    method: 'post',
    data
  })
}
//添加流程访问量
export function processAddLog(data = {}) {
  return axios({
    url: `/process/add-log`,
    method: 'post',
    data
  })
}
//添加访问后台访问量
export function userAddLog(data = {}) {
  return axios({
    url: `/user/add-log`,
    method: 'post',
    data
  })
}
