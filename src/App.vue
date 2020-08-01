<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
html,
body {
  background: #eff1f6;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #eff1f6;
  height: 100vh;
  overflow: hidden;
}
//解决popover组件生效后会被渲染在最外层，所以要在外层指定.el-popover的样式
.taskItem {
  background-color: #eff1f6;
  margin: 10px 0;
  span {
    font-weight: bold;
  }
}
</style>
