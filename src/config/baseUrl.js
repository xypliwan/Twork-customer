/* eslint-disable */

let baseURL = {
  requestUrl: '', //twork客户端接口地址
  backUrl: '' //后台链接地址
}

if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_FLAG === 'pro') {
    //production 生产环境
    baseURL.requestUrl = 'http://tw-api.ecgtool.com'
    baseURL.backUrl = 'http://tw-manage.ecgtool.com'
  } else if (process.env.VUE_APP_FLAG === 'test') {
    //test 测试环境
    baseURL.requestUrl = 'http://tw-api-test.ecgtool.com'
    baseURL.backUrl = 'http://tw-manage-test.ecgtool.com'
  }
} else {
  //dev 开发环境
  // baseURL = "http://172.16.20.6:8083";
  // baseURL.requestUrl = 'http://173.16.0.63:8083'
  baseURL.requestUrl = 'http://tw-api-test.ecgtool.com'
  baseURL.backUrl = '自行启动服务填写'
}
/* eslint-disable */

export default baseURL
