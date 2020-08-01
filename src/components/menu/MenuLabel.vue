<template>
  <div class="menu-label">
    <div class="tags">
      <!-- <el-tag
        v-for="(tab, index) in tabList"
        :key="index"
        :closable="tab.title == '首页' ? false : true"
        :type="currentPage == tab.name ? 'success' : 'info'"
        size="small"
        @click="toTargetRoute(tab, index)"
        @close="handleClose(tab, index)"
      >{{ tab.title }}</el-tag>-->
      <!-- <div class="tag">
        首页&nbsp;
        <span class="el-icon-close el-icon-circle-close"></span>
      </div>-->
      <div
        class="tag"
        v-for="(tab, index) in tabList"
        :key="index"
        :class="{ 'tag-active': currentPage == tab.name }"
        @click="toTargetRoute(tab, index)"
      >
        <span v-if="tab.title == '首页'" class="el-icon-s-home"></span>
        {{ tab.title }}&nbsp;
        <span
          :class="{ 'el-icon-close': tab.title != '首页' }"
          @click.stop="handleClose(tab, index)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['tabList', 'currentPage'])
  },
  methods: {
    ...mapActions(['addTablist', 'deleteTablist', '']),
    //  点击标签触发跳转路由
    toTargetRoute(tab) {
      if (tab.name === 'Project') {
        this.$router.push({ name: tab.name, query: { id: tab.project_id } })
      } else {
        this.$router.push({
          name: tab.name
        })
      }
    },
    handleClose(tab, index) {
      this.deleteTablist(tab) //关闭当前标签
      if (index == this.tabList.length) {
        if (this.tabList[index - 1].name === 'Project') {
          //关闭的时候如果是跳转到项目列表也没的话做特殊处理
          this.$router.push({
            name: this.tabList[index - 1].name,
            query: { id: this.tabList[index - 1].project_id }
          })
        } else {
          this.$router.push({
            name: this.tabList[index - 1].name
          })
        }
      } else {
        if (this.tabList[index].name === 'Project') {
          this.$router.push({
            name: this.tabList[index].name,
            query: { id: this.tabList[index].project_id }
          })
        } else {
          this.$router.push({
            name: this.tabList[index].name
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-label {
  height: 30px;
  line-height: 30px;
  // padding: 0 10px;
  background-color: #fff;
  .tags {
    white-space: nowrap;
    width: 100%;
    overflow-x: auto;
    font-size: 12px;
  }
  .tags::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
  }
  .tags::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #d4dce6;
  }
  .tags::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
  .tag {
    display: inline-block;
    background-color: #eee;
    padding: 0px 10px;
    box-shadow: inset #e7e7e8 -1px 0px 1px;
  }
  .tag:hover {
    background-color: #fff;
    cursor: pointer;
  }
  .tag-active {
    background-color: #fff;
    color: $themeColor;
  }
}
</style>
