import axios from '@/utils/axios'
//工时模块

// 添加项目
export function addProject (data = {}) {
  return axios({
    url: `/project/add`,
    method: 'post',
    data
  })
}

//项目列表
export function getProjectList (data = {}) {
  return axios({
    url: `/project/list`,
    method: 'get',
    params: data
  })
}

//项目详情
export function getProjectDetail (data = {}) {
  return axios({
    url: `/project/detail`,
    method: 'get',
    params: data
  })
}

//更新项目详情
export function updateProjectDetail (data = {}) {
  return axios({
    url: `/project/update`,
    method: 'post',
    data
  })
}

// 删除项目
export function delProject (data = {}) {
  return axios({
    url: `/project/del`,
    method: 'post',
    data
  })
}

//添加分类/分组
export function addTaskGroup (data = {}) {
  return axios({
    url: `/project-task-category/add`,
    method: 'post',
    data
  })
}

//分类列表
export function getGroupList (data = {}) {
  return axios({
    url: `/project-task-category/list`,
    method: 'get',
    params: data
  })
}

//更新分组
export function updateGroup (data = {}) {
  return axios({
    url: `/project-task-category/update`,
    method: 'post',
    data
  })
}

//删除分组
export function delGroup (data = {}) {
  return axios({
    url: `/project-task-category/del`,
    method: 'post',
    data
  })
}

//任务列表
export function taskList (data = {}) {
  return axios({
    url: `/project-task/list`,
    method: 'post',
    data
  })
}

//修改任务列表
export function updateTaskList (data = {}) {
  return axios({
    url: `project-task/update-info`,
    method: 'post',
    data
  })
}
//添加任务
export function addTask (data = {}) {
  return axios({
    url: `project-task/add`,
    method: 'post',
    data
  })
}
//成员列表
export function taskPeopleList (data = {}) {
  return axios({
    url: `/project-task-people/list`,
    method: 'get',
    params: data
  })
}
//修改项目开始还是结束状态
export function projectUpdateStata (data = {}) {
  return axios({
    url: `/project/update-info`,
    method: 'post',
    data
  })
}
//添加成员
export function addProjectPeople (data = {}) {
  return axios({
    url: `/project/update-people`,
    method: 'post',
    data
  })
}
//当前用户权限
export function roleAuthority (data = {}) {
  return axios({
    url: `/project/get-user-role`,
    method: 'post',
    data
  })
}
//删除任务
export function delProjectTask (data = {}) {
  return axios({
    url: `/project-task/del`,
    method: 'post',
    data
  })
}
//工时列表
export function workHourList (data = {}) {
  return axios({
    url: `/project-work-hour/list`,
    method: 'get',
    params: data
  })
}
//任务类型
export function taskCategoryList (data = {}) {
  return axios({
    url: `/project-task-category/list`,
    method: 'get',
    params: data
  })
}

//添加/更新工时
export function updateWorkHours (data = {}) {
  return axios({
    url: `/project-work-hour/save`,
    method: 'post',
    data
  })
}

// 获取工时的详情
export function workHoursDetail (data = {}) {
  return axios({
    url: `/project-work-hour/detail`,
    method: 'get',
    params: data
  })
}

// 可用人员列表
export function useUserList (data = {}) {
  return axios({
    url: `/project-work-hour/get-user-list`,
    method: 'post',
    data
  })
}

//任务管理列表
export function manageList (data = {}) {
  return axios({
    url: `/project-task/manage-list`,
    method: 'get',
    params: data
  })
}

//我的任务工时列表
export function myWorkHourList (data = {}) {
  return axios({
    url: `/project-task/work-hour-list`,
    method: 'get',
    params: data
  })
}

//文档列表
export function docList (data = {}) {
  return axios({
    url: `/project/doc-list`,
    method: 'get',
    params: data
  })
}

//删除文档
export function delDoc (data = {}) {
  return axios({
    url: `/project/del-doc`,
    method: 'post',
    data
  })
}

//上传文档
export function uploadDoc (data = {}) {
  return axios({
    url: `/project/save-file`,
    method: 'post',
    data
  })
}

//填写工时-添加任务按钮
export function taskScreenList (data = {}) {
  return axios({
    url: `/project-task/task-screen-list`,
    method: 'post',
    data
  })
}

//一键保存工时
export function saveWorkHours (data = {}) {
  return axios({
    url: `/project-work-hour/add`,
    method: 'post',
    data
  })
}
//获取所有角色列表
export function getUserRole (data = {}) {
  return axios({
    url: `/role/list`,
    method: 'get',
    params: data
  })
}

//根据分类id获取任务信息
export function getInfoByTaskId (data = {}) {
  return axios({
    url: `/project-task/get-info`,
    method: 'post',
    data
  })
}

//删除项目分类
export function delCategory (data = {}) {
  return axios({
    url: `/project/del-category`,
    method: 'post',
    data
  })
}

//复制分类结构
export function copyCategory (data = {}) {
  return axios({
    url: `/project-task-category/copy`,
    method: 'post',
    data
  })
}

//可用人员任务详情
export function getTaskListByid (data = {}) {
  return axios({
    url: `/project-work-hour/get-task-list`,
    method: 'post',
    data
  })
}
//分类项目列表
export function projectListTask (data = {}) {
  return axios({
    url: `/project-task-category/project-list`,
    method: 'get',
    params: data
  })
}
//分类赋予项目id
export function copyAssign (data = {}) {
  return axios({
    url: `/project-task-category/copy-assign`,
    method: 'post',
    data
  })
}
//添加项目分类
export function addCategory (data = {}) {
  return axios({
    url: `/project-task-category/add-category`,
    method: 'post',
    data
  })
}
//项目剩余列表（分类）
export function projectHasList (data = {}) {
  return axios({
    url: `/project-task-category/project-has-list`,
    method: 'post',
    data
  })
}
//角色列表
export function roleList (data = {}) {
  return axios({
    url: `/project-task-people/role-list`,
    method: 'get',
    params: data
  })
}

//项目内成员id列表
export function nameList (data = {}) {
  return axios({
    url: `/project-task-people/name-list`,
    method: 'post',
    data
  })
}
//修改项目分类名称
export function nupdateCategoryName (data = {}) {
  return axios({
    url: `/project-task-category/update-category-name`,
    method: 'post',
    data
  })
}
//修改项目分类排序
export function updateCategorySort (data = {}) {
  return axios({
    url: `/project-task-category/update-category-sort`,
    method: 'post',
    data
  })
}

//复制项目
export function projectCopy (data = {}) {
  return axios({
    url: `/project/copy`,
    method: 'post',
    data
  })
}
//删除工时
export function workHourDel (data = {}) {
  return axios({
    url: `project-work-hour/del`,
    method: 'post',
    data
  })
}
//项目权限
export function authRole (data = {}) {
  return axios({
    url: `project/auth-role`,
    method: 'get',
    params: data
  })
}
//项目修改排序
export function projectSort (data = {}) {
  return axios({
    url: `/project/sort`,
    method: 'post',
    data
  })
}
//工时查询项目列表
export function workHourProjectList (data = {}) {
  return axios({
    url: `/project/work-hour-project-list`,
    method: 'get',
    params: data
  })
}
//复制上一周工时数据
export function copyLastWeekData (data = {}) {
  return axios({
    url: `/project-work-hour/copy-last-week-data`,
    method: 'post',
    data
  })
}