import Vue from 'vue'

// 自定义滚动到底触发事件
Vue.directive('loadmore', {
  bind(el, binding) {
    // 是否执行回调事件
    let eventAction = true
    el.addEventListener(
      'scroll',
      function(e) {
        var scrollTop = e.target.scrollTop
        var eHeight = e.target.offsetHeight
        var sHeight = e.target.scrollHeight
        //  滚动到指定区域执行回调事件
        if (
          typeof binding.value === 'function' &&
          scrollTop + eHeight >= sHeight &&
          eventAction
        ) {
          // 执行事件回调函数
          binding.value()
          eventAction = false
        } else if (scrollTop + eHeight < sHeight) {
          eventAction = true
        }
      },
      true
    )
  }
})
