import axios from 'axios'
import { getLocalStorage, removeLocalStorage } from '@/utils/localStorage'
import { Message } from 'element-ui'
import baseURL from '@/config/baseUrl'
import router from '@/router/index'
import { formatMessage } from '_u/utils'

const service = axios.create({
  baseURL: baseURL.requestUrl,
  timeout: 40000
})

service.interceptors.request.use(
  config => {
    let access_token = getLocalStorage('access_token')
    if (access_token) {
      config.headers['Content-Type'] = 'application/json'
      config.headers['Access-Token'] = `${access_token}`
    }
    return config
  },
  error => {
    Message.error({
      message: JSON.stringify(error),
      showClose: true,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    let res = response.data
    if (res.code == 200 && res.error == 1001) {
      removeLocalStorage('access_token')
      router.push('/entrance/login')
      Message.closeAll()
      return Promise.reject(formatMessage('登录过期，请重新登录'))
    } else if (
      res.code == 200 &&
      (res.error == 0 || res.error == 6666 || res.error == 2000)
    ) {
      return res
    } else {
      return Promise.reject(formatMessage(res.message)) //接口其他类型出错
    }
  },
  error => {
    if (process.env.NODE_ENV == 'development') {
      if (error.message.indexOf('timeout of') != -1) {
        Message.error({
          message: `请求超时`,
          showClose: true,
          type: 'error'
        })
      } else {
        Message.error({
          message: `服务端错误：${JSON.parse(JSON.stringify(error)).message}`,
          showClose: true,
          type: 'error'
        })
      }
    } else {
      Message.error({
        message: `服务器异常`,
        showClose: true,
        type: 'error'
      })
    }
  }
)
export default service
