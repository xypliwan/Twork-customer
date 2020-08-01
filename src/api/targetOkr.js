import axios from '@/utils/axios'
//okr模块

// 获取目标
export function getSearchTargetList(data = {}) {
  return axios({
    url: `/target/search`,
    method: 'get',
    params: data
  })
}

// 添加目标
export function addTarget(data = {}) {
  return axios({
    url: `/target/add`,
    method: 'post',
    data
  })
}

//获取目标列表
export function getTargetList(data = {}) {
  return axios({
    url: `/target/list`,
    method: 'get',
    params: data
  })
}

//设置/取消关注
export function setTargetFocus(data = {}) {
  return axios({
    url: `/target/focus`,
    method: 'post',
    data
  })
}

//目标详情
export function getTargetDetail(data = {}) {
  return axios({
    url: `/target/detail`,
    method: 'get',
    params: data
  })
}

//置顶目标
export function setTargetTop(data = {}) {
  return axios({
    url: `/target/top`,
    method: 'post',
    data
  })
}

//归档
export function setTargetPlaceOnFile(data = {}) {
  return axios({
    url: `/target/place-on-file`,
    method: 'post',
    data
  })
}

//kr 列表
export function getKrList(data = {}) {
  return axios({
    url: `/target/kr-list`,
    method: 'get',
    params: data
  })
}

//快速创建kr(目标已经存在的情况)
export function createKr(data = {}) {
  return axios({
    url: `/target/create-kr`,
    method: 'post',
    data
  })
}

//更新kr
export function updateKr(data = {}) {
  return axios({
    url: `/target/update-kr`,
    method: 'post',
    data
  })
}

//kr复盘
export function saveSummary(data = {}) {
  return axios({
    url: `/target/save-summary`,
    method: 'post',
    data
  })
}

//kr评分
export function setKrMark(data = {}) {
  return axios({
    url: `/target/mark`,
    method: 'post',
    data
  })
}

//删除kr
export function delKr(data = {}) {
  return axios({
    url: `/target/del-kr`,
    method: 'post',
    data
  })
}

//获取任务标签
export function getTaskTag() {
  return axios({
    url: `/common/get-task-tag`,
    method: 'get'
  })
}

//kr列表简易
export function getKrListSimple(data = {}) {
  return axios({
    url: `/target/kr-list-simple`,
    method: 'get',
    params: data
  })
}

//创建任务
export function createTask(data = {}) {
  return axios({
    url: `/target/create-task`,
    method: 'post',
    data
  })
}

//获取任务列表
export function getTaskList(data = {}) {
  return axios({
    url: `/task/target-task-list`,
    method: 'get',
    params: data
  })
}

//获取任务列表
export function updateTask(data = {}) {
  return axios({
    url: `/task/update`,
    method: 'post',
    data
  })
}

//设置任务的标志
export function setTaskTag(data = {}) {
  return axios({
    url: `/task/set-tag`,
    method: 'post',
    data
  })
}

//删除任务
export function delTask(data = {}) {
  return axios({
    url: `/task/del`,
    method: 'post',
    data
  })
}

//任务详情
export function getTaskDetail(data = {}) {
  return axios({
    url: `/task/detail`,
    method: 'get',
    params: data
  })
}

//修改任务信息
export function updateTaskInfo(data = {}) {
  return axios({
    url: `/task/update`,
    method: 'post',
    data
  })
}

//创建子任务
export function createChildTask(data = {}) {
  return axios({
    url: `/task/add-son`,
    method: 'post',
    data
  })
}

//获取子任务列表
export function getSonList(data = {}) {
  return axios({
    url: `/task/son-list`,
    method: 'get',
    params: data
  })
}

//设置子任务状态 完成/取消
export function setSonStatus(data = {}) {
  return axios({
    url: `/task/set-son-status`,
    method: 'post',
    data
  })
}

//删除子任务
export function delSon(data = {}) {
  return axios({
    url: `/task/del-son`,
    method: 'post',
    data
  })
}

//修改子任务进度
export function updateSonProcess(data = {}) {
  return axios({
    url: `/task/update-son-process`,
    method: 'post',
    data
  })
}

//添加团队指标
export function addTeamNorm(data = {}) {
  return axios({
    url: `/target/add-team-norm`,
    method: 'post',
    data
  })
}

//获取任务日志
export function getActionLog(data = {}) {
  return axios({
    url: `/target/action-log`,
    method: 'get',
    params: data
  })
}

//获取图表接口
export function getTargetChartList(data = {}) {
  return axios({
    url: `/target/score-chart`,
    method: 'get',
    params: data
  })
}

//kr动态添加新动态
export function addCommentActionLog(data = {}) {
  return axios({
    url: `/target/add-comment-action-log`,
    method: 'post',
    data
  })
}

//获取目标列表(简易字段)
export function targetListSimple(data = {}) {
  return axios({
    url: `/target/list-simple`,
    method: 'get',
    params: data
  })
}

//获取kr列表（返回所有）
export function targetKrListAll(data = {}) {
  return axios({
    url: `/target/kr-list-all`,
    method: 'get',
    params: data
  })
}

//获取任务列表（返回所有）
export function allTargetTaskList(data = {}) {
  return axios({
    url: `/task/all-target-task-list`,
    method: 'get',
    params: data
  })
}

//获取目标详情（简易）
export function getDetailSimple(data = {}) {
  return axios({
    url: `/target/detail-simple`,
    method: 'get',
    params: data
  })
}

//更新目标
export function updateTargetDetail(data = {}) {
  return axios({
    url: `/target/update`,
    method: 'post',
    data
  })
}

//动态里面添加回复
export function targetReply(data = {}) {
  return axios({
    url: `/target/reply`,
    method: 'post',
    data
  })
}

//任务日志列表
export function taskActionLogList(data = {}) {
  return axios({
    url: `/task/action-log-list`,
    method: 'get',
    params: data
  })
}

//添加任务全部评论
export function addTaskCommnetReply(data = {}) {
  return axios({
    url: `/task/add-action-log`,
    method: 'post',
    data
  })
}

//添加任务日志回复
export function addTaskUserReply(data = {}) {
  return axios({
    url: `/task/reply`,
    method: 'post',
    data
  })
}

//获取参与人列表
export function getTaskPlayerList(data = {}) {
  return axios({
    url: `/task/player-list`,
    method: 'get',
    params: data
  })
}

//更新参与人
export function updatePlayerList(data = {}) {
  return axios({
    url: `/task/update-player`,
    method: 'post',
    data
  })
}

//删除目标
export function delTarget(data = {}) {
  return axios({
    url: `/target/del-target`,
    method: 'post',
    data
  })
}
