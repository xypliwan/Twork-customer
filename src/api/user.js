import axios from '@/utils/axios'
//用户模块

// 登陆
export function login(data = {}) {
  return axios({
    url: `/login/login`,
    method: 'post',
    data
  })
}

// 微信登陆
export function loginByWx(data = {}) {
  return axios({
    url: `/login/login-by-wx`,
    method: 'get',
    params: data
  })
}
// 获取用户信息
export function userInfo(data) {
  return axios({
    url: `/user/info`,
    method: 'get',
    params: data
  })
}

// // 退出登陆
// export function logout(data = {}) {
//   return axios({
//     url: `/logout`,
//     method: "get"
//   });
// }

// 修改密码
export function modifyPassword(data = {}) {
  return axios({
    url: `/user/modify-password`,
    method: 'post',
    data
  })
}

// 用户详情
export function infoDetail() {
  return axios({
    url: `/user/info-detail`,
    method: 'get'
  })
}
// 编辑用户详情
export function updateDetail(data = {}) {
  return axios({
    url: `/user/update-detail`,
    method: 'post',
    data
  })
}

//设置用户登录状态
export function setFirstLoginDone(data = {}) {
  return axios({
    url: `/user/set-first-login-done`,
    method: 'post',
    data
  })
}
//获取二维码
export function getQrcode() {
  return axios({
    url: `/wx/get-qrcode`,
    method: 'get'
  })
}
//绑定用户
export function bindUser(data) {
  return axios({
    url: `/wx/bind-user`,
    method: 'post',
    data
  })
}
//解绑用户
export function unBind() {
  return axios({
    url: `/wx/unbind`,
    method: 'post'
  })
}

//用户列表
export function userList(data) {
  return axios({
    url: `/user/list`,
    method: 'get',
    params: data
  })
}
//停用/激活用户
export function setUserStatus(data) {
  return axios({
    url: `/user/set-user-status`,
    method: 'post',
    data
  })
}
//不再提示
export function closeUserStatusSet(data) {
  return axios({
    url: `/user/close-user-status-set`,
    method: 'post',
    data
  })
}

//获取公司简易信息
export function companySimpleInfo() {
  return axios({
    url: `/company/simple-info`,
    method: 'get'
  })
}
