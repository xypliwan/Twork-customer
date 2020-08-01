import Vue from 'vue'

//   流程管理-对表单动态渲染的不同类型数据进行处理
Vue.filter('myFilter', (val, type, arr) => {
  // console.log(val, type, arr, 222);
  if (type == 'datetimerange' && val) {
    val = val[0].substr(0, 10) + ' / ' + val[1].substr(0, 10)
  } else if (type == 'datetime' && val) {
    val = val.substr(0, 10)
  } else if (type == 'department' && val) {
    let target = arr.find(el => el.department_id == val[val.length - 1])
    val = target.department_name
  }
  return val
})
Vue.filter('nameFilter', name => {
  if (typeof name == 'object' && name.length > 0) {
    name = name[0].username
  }
  if (typeof name == 'string' && name.length > 2) {
    name = name.substr(name.length - 2)
  }
  return name
})
