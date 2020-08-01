import axios from '@/utils/exportAxios'

//获取地址栏参数
export function getUrlKey(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.href
      ) || [, ''])[1].replace(/\+/g, '%20')
    ) || null
  )
}

export function isPone(phone) {
  let phones = Number(phone)
  let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!myreg.test(phones)) {
    return false
  } else {
    return true
  }
}

export function formatMessage(data) {
  let message = ''
  if (Array.isArray(data)) {
    data.forEach(el => {
      message += `<p>${el}</p>`
    })
  } else {
    message = `<p>${data}</p>`
  }
  return message
}

//根据数组的某个key值去重
export function arrDeWeight(arr, key) {
  let result = []
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i][key]]) {
      result.push(arr[i])
      obj[arr[i][key]] = true
    }
  }
  return result
}

export function formateExcl(url, methods, data = {}, title) {
  axios({
    method: methods,
    url, // 请求地址
    params: data,
    data, // 参数
    responseType: 'blob' //  表明返回服务器返回的数据类型  这里注意要加上responseType
  })
    .then(res => {
      // 处理返回的文件流
      // 注意 返回的res 无需做任何处理，有时在用框架封装的请求之后会出现返回response.text() 等情况导致文件流下载失败。
      const content = res
      const blob = new Blob([content])
      const fileName = title + '.xls'
      const alink = document.createElement('a')
      alink.download = fileName
      alink.style.display = 'none'
      alink.href = URL.createObjectURL(blob) // 这里是将文件流转化为一个文件地址
      document.body.appendChild(alink)
      alink.click()
      URL.revokeObjectURL(alink.href) // 释放URL 对象
      document.body.removeChild(alink)
    })
    .catch(error => {
      this._message(error)
    })
}

//判断当前是上午、下午、还是晚上
//上午0  下午1  晚上2
export function isMorAorN() {
  let index = null
  let nowHours = new Date().getHours()
  if (nowHours > 6 && nowHours < 12) {
    index = 0
  } else if (nowHours >= 12 && nowHours < 18) {
    index = 1
  } else {
    index = 2
  }
  return index
}

//获取at的人员名字
export function getAtUserName(str) {
  let reg = /@([^\s]*?)\s/g
  let ret = []
  let arr = []
  while ((arr = reg.exec(str))) ret.push(arr[1])
  return ret
}

//获取at的人员ID
export function getAtUserId(allUser, selectUser) {
  let arr = []
  selectUser.forEach(el => {
    allUser.forEach(ev => {
      if (el == ev.username) {
        arr.push(ev.user_id)
      }
    })
  })
  return arr
}

// 判断数值是对象或数组或其他 返回Object或 Array或空字符串
export function isType(obj) {
  var type = Object.prototype.toString.call(obj)
  if (type == '[object Array]') {
    return 'Array'
  } else if (type == '[object Object]') {
    return 'Object'
  } else {
    return ''
  }
}

// 处理企业成员信息
export function formateAllUser(arr) {
  arr.forEach(el => {
    el['select'] = false
    if (el.children) {
      if (el.people && el.people.length > 0) {
        el.people.forEach(peopleItem => {
          peopleItem['select'] = false
        })
      }
      formateAllUser(el.children)
    } else {
      if (el.people && el.people.length > 0) {
        el['children'] = []
        el['disabled'] = false
        el.people.forEach(peopleItem => {
          peopleItem['select'] = false
        })
      }
    }
  })
  return arr
}

/**
 * @arr { Array } 原始组织架构数据
 * @userData { Object } 用户的历史数据
 * { department部门: Array, user人员信息: Array, nameArr中文名: Array } = userData
 * @obj { Object } 返回最新的组织架构人员信息
 */
export function resetDepartmentAndUserFromId(arr, userData) {
  let obj = JSON.parse(JSON.stringify(userData))
  obj.nameArr = []
  recursiveFn(arr, obj)
  let departmentNamrArr = obj.department.map(el => el.department_name)
  let userNameArr = obj.user.map(el => el.username)
  obj.nameArr = [...departmentNamrArr, ...userNameArr]
  obj['txt'] = obj.nameArr.join('、')
  return obj
}

function recursiveFn(arr, obj) {
  arr.forEach(el => {
    if (el.people) {
      el.people.forEach(peopleItem => {
        obj.user.forEach(userItem => {
          if (peopleItem.user_id == userItem.user_id) {
            userItem.username = peopleItem.username
          }
        })
      })
    }
    obj.department.forEach(departmentItem => {
      if (el.department_id == departmentItem.department_id) {
        departmentItem.department_name = el.department_name
      }
    })
    if (el.children) {
      recursiveFn(el.children, obj)
    }
  })
}

//处理js精度运算问题
export function add(a, b) {
  var c, d, e
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) + mul(b, e)) / e
}
export function mul(a, b) {
  /* eslint-disable */
  var c = 0,
    d = a.toString(),
    e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) {}
  try {
    c += e.split('.')[1].length
  } catch (f) {}
  return (
    (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c)
  )
  /* eslint-disable */
}

// date 代表指定的日期，格式：2018-09-27
// day 传-1表始前一天，传1表始后一天
// JS获取指定日期的前一天，后一天
export function getNextDate(date, day) {
  var dd = new Date(date)
  dd.setDate(dd.getDate() + day)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
  return y + '-' + m + '-' + d
}
