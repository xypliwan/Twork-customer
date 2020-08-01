import Storage from 'web-storage-cache'

const localStorage = new Storage()

// 设置
export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}

//获取指定key
export function getLocalStorage(key) {
  return localStorage.get(key)
}

// 清除指定key
export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

//清除所有
export function clearLocalStorage() {
  return localStorage.clear()
}
