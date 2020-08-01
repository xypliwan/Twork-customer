import axios from '@/utils/axios'
//动态模块

//获取配置
export function getDynamicSet() {
  return axios({
    url: `/dynamic/detail`,
    method: 'get'
  })
}

//更新配置
export function updateDynamicSet(data = {}) {
  return axios({
    url: `/dynamic/update`,
    method: 'post',
    data
  })
}

//获取动态
export function getDynamicList(data = {}) {
  return axios({
    url: `/dynamic/list`,
    method: 'get',
    params: data
  })
}

//设置已读
export function setDynamicRead(data = {}) {
  return axios({
    url: `/dynamic/set-read`,
    method: 'post',
    data
  })
}

//设置全部已读
export function setAllRead(params) {
  return axios({
    url: `/dynamic/set-all-read`,
    method: 'get',
    params
  })
}

//获取未读总数量
export function getDynamicNum(data = {}) {
  return axios({
    url: `/dynamic/unread`,
    method: 'get',
    data
  })
}
