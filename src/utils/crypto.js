// 登录加密解密
var CryptoJS = require('crypto-js')

var nowTime = Date.parse(new Date())
  .toString()
  .substr(0, 10)

var IV = '8NONwyJtHeeccang'
var KEY = nowTime + '!@ecca'
// var data = 'ABCDEFGH'

// 加密
export function encrypt(str) {
  var key = CryptoJS.enc.Utf8.parse(KEY)
  var iv = CryptoJS.enc.Utf8.parse(IV)
  var encrypted = CryptoJS.AES.encrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  // return encrypted.toString();
  return {
    encrypted: encrypted.toString(),
    nowTime
  }
}

// 解密
export function decrypt(str) {
  var key = CryptoJS.enc.Utf8.parse(KEY)
  var iv = CryptoJS.enc.Utf8.parse(IV)
  var decrypted = CryptoJS.AES.decrypt(str, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
