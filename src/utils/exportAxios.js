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

//请求拦截器
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
      type: 'error'
    })
    return Promise.reject(error)
  }
)
// 添加响应拦截器
service.interceptors.response.use(
  response => {
    let res = response.data
    if (res.code == 200) {
      return res
    } else if (res.code == 1002) {
      removeLocalStorage('userinfo')
      router.push('/entran/login')
      return Promise.reject(formatMessage(res.msg))
    } else {
      //出错
      return res
    }
  },
  error => {
    Message.error({
      message: `服务端错误：${JSON.stringify(error)}`,
      type: 'error'
    })
    return Promise.reject(error)
  }
)
export default service

// 此请求方法只用来请求下载乱码的二进制流文件
