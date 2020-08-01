<template>
  <div class="work-hours">
    <div
      class="extend-box"
      :class="isExtend ? 'active-extend' : ''"
      @click="isExtend = false"
    >
      <i class="iconfont icon-zhankai2"></i>
    </div>
    <div class="left" :class="isExtend ? 'active-width' : ''">
      <div class="left-inner">
        <div class="task-management">
          <div class="task-txt">项目管理</div>
          <div class="task-icon">
            <el-tooltip
              class="item"
              effect="dark"
              content="收起"
              placement="top"
            >
              <i class="el-icon-caret-left" @click="isExtend = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="search-box">
          <el-input
            size="mini"
            placeholder="输入项目名称"
            v-model="input1"
            @keyup.enter.native="onSubmit"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="onSubmit"
            ></i>
          </el-input>
        </div>
        <div class="nav-box" v-loading="listLoading">
          <el-menu
            :router="true"
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            :default-openeds="openeds"
          >
            <el-submenu v-for="item in navList" :index="item.id" :key="item.id">
              <template slot="title">
                <!-- <i class="iconfont title-icon " :class="item.icon"></i> -->
                <i
                  class="el-icon-circle-plus titleIcon"
                  v-if="item.id == '2'"
                  @click="goProjectPage()"
                ></i>
                <span>{{ item.title }}</span>
              </template>
              <template v-if="item.id == '2'">
                <el-menu-item-group v-for="(ev, j) in item.child" :key="j">
                  <el-menu-item
                    :index="`/work-hours/project?id=${ev.project_id}`"
                  >
                    <div class="projectTitleWrap">
                      <div class="move">
                        <el-tooltip
                          effect="dark"
                          content="上移"
                          placement="top-start"
                        >
                          <i
                            class="el-icon-top"
                            @click.stop="moveProject('up', ev, j)"
                          ></i>
                        </el-tooltip>
                        <el-tooltip
                          effect="dark"
                          content="下移"
                          placement="top-start"
                        >
                          <i
                            class="el-icon-bottom"
                            @click.stop="moveProject('down', ev, j)"
                          ></i>
                        </el-tooltip>
                      </div>
                      <div class="projectTitleLeft">
                        <i
                          class="iconfont"
                          :class="ev.icon"
                          :style="{ color: ev.color }"
                        ></i>
                        <el-tooltip
                          effect="dark"
                          :content="ev.project_name"
                          placement="top-start"
                        >
                          <span>{{ ev.project_name }}</span>
                        </el-tooltip>
                      </div>
                      <div class="projectTitleRight">
                        <el-tooltip
                          effect="dark"
                          content="复制"
                          placement="top-start"
                        >
                          <i
                            class="el-icon-document-copy opeart-icon"
                            @click.stop="copyProject(ev)"
                          ></i>
                        </el-tooltip>
                        <el-tooltip
                          effect="dark"
                          content="编辑"
                          placement="top-start"
                          v-if="ev.can_update == 1"
                        >
                          <i
                            class="el-icon-setting opeart-icon"
                            @click.stop="editProject(ev.project_id)"
                          ></i>
                        </el-tooltip>
                        <el-tooltip
                          effect="dark"
                          content="删除"
                          placement="top-start"
                          v-if="ev.can_del == 1"
                        >
                          <i
                            class="el-icon-close opeart-icon"
                            @click.stop="delProject(ev, j)"
                          ></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="/work-hours/project-list" class="all"
                    >查看全部项目</el-menu-item
                  >
                </el-menu-item-group>
              </template>
              <template v-else>
                <el-menu-item-group v-for="(ev, j) in item.child" :key="j">
                  <el-menu-item :index="ev.path"
                    ><i class="iconfont" :class="ev.icon"></i>
                    {{ ev.title }}</el-menu-item
                  >
                </el-menu-item-group>
              </template>
            </el-submenu>
          </el-menu>
        </div>
      </div>
    </div>
    <div class="right">
      <keep-alive :include="keepAliveArr">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { delProject, projectCopy, authRole, projectSort } from '@/api/workHours'
export default {
  name: 'WorkHours',
  data () {
    return {
      input1: '',
      isExtend: false,
      openeds: ['1', '2', '3', '4'],
      defaultActive: '/work-hours/write-work-hours',
      navList: [
        {
          id: '1',
          title: '我的任务',
          icon: 'icon-tianxie',
          child: [
            // {
            //   title: '任务管理',
            //   icon: 'icon-gongshitianbao',
            //   path: '/work-hours/task-management'
            // },
            // {
            //   title: '我的工时',
            //   icon: 'icon-gongshitianbao',
            //   path: '/work-hours/my-working-hours'
            // },
            {
              title: '填报工时',
              icon: 'icon-tianxie',
              path: '/work-hours/write-work-hours'
            }
          ]
        }
        // {
        //   id: '2',
        //   title: '项目列表',
        //   icon: 'icon-shousuo',
        //   child: []
        // }
        // {
        //   id: '3',
        //   title: '项目资源',
        //   icon: 'icon-shousuo',
        //   child: [
        //     {
        //       title: '工时填报查询',
        //       icon: 'icon-ziyuan2',
        //       path: '/work-hours/user-search'
        //     }
        //     // {
        //     //   title: '统计报表',
        //     //   icon: 'icon-ren',
        //     //   path: '/work-hours/statistical-report'
        //     // }
        //   ]
        // },
        // {
        //   id: '4',
        //   title: '项目配置',
        //   icon: 'icon-shousuo',
        //   child: [
        //     // {
        //     //   title: '任务标签',
        //     //   icon: 'icon-leixing',
        //     //   path: '/work-hours/task-label'
        //     // },
        //     // {
        //     //   title: '人员成本费率',
        //     //   icon: 'icon-leixing',
        //     //   path: '/work-hours/personnel-cost'
        //     // },
        //     {
        //       title: '任务类型',
        //       icon: 'icon-leixing',
        //       path: '/work-hours/task-type'
        //     }
        //   ]
        // }
      ],
      projectList: [],
      listLoading: false
    }
  },
  created () {
    this.setDefaultActive(this.$route.path)
    // this.getProjectListFn()
    this.getauthRole()
  },
  watch: {
    $route (newVal) {
      this.setDefaultActive(newVal.path)
    }
  },
  computed: {
    ...mapGetters(['keepAliveArr'])
  },
  methods: {
    ...mapActions(['setProjectList']),
    copyProject (item) {
      this.$confirm(`确定复制 ${item.project_name} 项目吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.copyProjectFn(item.project_id)
        })
        .catch(() => { })
    },
    async copyProjectFn (id) {
      try {
        let { message } = await projectCopy({ project_id: id })
        this._message(message, 'success')
        // this.getProjectListFn()
        this.getauthRole()
      } catch (error) {
        this._message(error)
      }
    },
    async getauthRole () {
      try {
        this.listLoading = true
        let { data } = await authRole({ project_name: this.input1 })
        this.navList = [
          {
            id: '1',
            title: '我的任务',
            icon: 'icon-tianxie',
            child: [
              {
                title: '填报工时',
                icon: 'icon-tianxie',
                path: '/work-hours/write-work-hours'
              }
            ]
          }
        ]
        data.map(item => {
          if (item.code === 'project_source') {
            this.navList.push({
              id: '3',
              title: '项目资源',
              icon: 'icon-shousuo',
              child: [
                {
                  title: '工时填报查询',
                  icon: 'icon-ziyuan2',
                  path: '/work-hours/user-search'
                }
              ]
            })
          } else if (item.code === 'project_config') {
            this.navList.push(
              {
                id: '4',
                title: '项目配置',
                icon: 'icon-shousuo',
                child: [
                  {
                    title: '任务类型',
                    icon: 'icon-leixing',
                    path: '/work-hours/task-type'
                  }
                ]
              }
            )
          } else if (item.code === 'project_list') {
            let list = item.list
            list.map((item, i) => {
              if (item.project_id === '1') {
                list.splice(i, 1)
              }
            })
            this.projectList = item.list
            this.navList.push(
              {
                id: '2',
                title: '项目列表',
                icon: 'icon-shousuo',
                child: item.list
              }
            )
          }
        })
        this.listLoading = false
      } catch (error) {
        this._message(error)
      }
    },
    delProject (item, i) {
      this.$confirm(`确定删除 ${item.project_name} 项目吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delProjectFn(item.project_id, i)
        })
        .catch(() => { })
    },
    async delProjectFn (id) {
      try {
        let { message } = await delProject({ project_id: id })
        this._message(message, 'success')
        // this.projectList.splice(i, 1)
        this.getauthRole()
      } catch (error) {
        this._message(error)
      }
    },
    editProject (id) {
      this.$router.push(`/create-project?id=${id}`)
    },
    // async getProjectListFn () {
    //   this.listLoading = true
    //   try {
    //     let { data } = await getProjectList({
    //       project_name: this.input1,
    //       status: '1'
    //     })
    //     this.projectList = data
    //     this.projectList.map((item, index) => {
    //       if (item.project_id === '1') {
    //         this.projectList.splice(index, 1)
    //       }
    //     })
    //     this.setProjectList(data)
    //   } catch (error) {
    //     this._message(error)
    //   }
    //   this.listLoading = false
    // },
    setDefaultActive (path) {
      if (path === '/work-hours/project') {
        //如果是项目页面的，特殊处理
        this.defaultActive = '/work-hours/project?id=' + this.$route.query.id
      } else if (path === '/work-hours/project-list') {
        this.defaultActive = '/work-hours/project-list'
      } else {
        this.navList.forEach(el => {
          el.child.forEach(ev => {
            if (path == ev.path) {
              this.defaultActive = ev.path
            }
          })
        })
      }
    },
    goProjectPage () {
      this.$router.push(`/create-project`)
    },
    onSubmit () {
      this.getauthRole()
    },
    moveProject (tip, item, index) {
      // console.log(tip, item, index)
      let change_project_id //操作的id
      let be_project_id //被替换的id
      if (tip === 'up') { // 向上移
        if (index !== 0) { // 第一位不做处理
          change_project_id = this.projectList[index].project_id
          be_project_id = this.projectList[index - 1].project_id
          this.projectSort({ change_project_id: change_project_id, be_project_id: be_project_id })
        }
      } else if (tip === 'down') {
        if (index + 1 !== this.projectList.length) { // 最后一位不做处理
          change_project_id = this.projectList[index].project_id
          be_project_id = this.projectList[index + 1].project_id
          this.projectSort({ change_project_id: change_project_id, be_project_id: be_project_id })
        }
      }
    },
    async projectSort (obj) {
      try {
        let { message } = await projectSort(obj)
        this._message(message, 'success')
        this.getauthRole()
      } catch (error) {
        this._message(error)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.work-hours {
  display: flex;
  height: 100%;
  .extend-box {
    position: fixed;
    top: 90px;
    left: 0px;
    z-index: 999;
    width: 25px;
    height: 25px;
    background: rgba(64, 158, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0px 15px 15px 0;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s linear;
    transform: translateX(-100%);
    &.active-extend {
      transform: translateX(0%);
    }
    i {
      font-size: 16px;
    }
  }
  .left {
    width: 300px;
    background: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 0.2s linear;
    &::-webkit-scrollbar {
      background-color: transparent;
      width: 0px;
    }
    &.active-width {
      width: 0;
    }
    .all {
      text-decoration: underline;
      // color: #526ecc;
    }
    .left-inner {
      width: 300px;
      padding: 10px 10px;
      .task-management {
        display: flex;
        .task-txt {
          flex: 1;
          font-size: 15px;
          color: #333;
          font-weight: 700;
        }
        .task-icon {
          cursor: pointer;
          color: #777;
          .icon-shousuo {
            transform: rotate(90deg);
            margin-left: 10px;
            display: inline-block;
          }
        }
      }
      .search-box {
        margin: 8px 0;
        padding: 8px 0;
        border-bottom: 1px solid #f1f1f1;
        ::v-deep .el-input__inner {
          background: #f1f1f1;
        }
      }
      .nav-box {
        .title-icon {
          font-size: 17px;
          margin-right: 10px;
        }
        ::v-deep .el-submenu {
          position: relative;
        }
        ::v-deep .el-submenu:hover {
          .titleIcon {
            display: block;
          }
        }
        .titleIcon {
          font-size: 17px;
          margin-right: 10px;
          color: #526ecc;
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: -9px;
          display: none;
        }
        ::v-deep .el-menu {
          border-right: none;
        }
        ::v-deep .el-submenu__title {
          padding: 0px;
        }
        ::v-deep .el-menu-item {
          padding-right: 0;
          .opeart-icon {
            font-size: 16px;
            margin: 0 3px;
          }
        }
      }
    }
    ::v-deep .el-submenu__icon-arrow {
      left: 0 !important;
      right: auto !important;
    }
    ::v-deep .el-menu-item.is-active {
      color: #526ecc;
      background-color: #eef1fa;
    }
    ::v-deep .el-menu-item-group {
      &:hover {
        .move {
          display: block;
        }
      }
    }
    .projectTitleWrap {
      display: flex;
      position: relative;
      .move {
        position: absolute;
        left: -35px;
        display: none;
        // height: ;
      }
      .projectTitleLeft {
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        i {
          margin-right: 5px;
        }
      }
      .projectTitleRight {
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
  .right {
    margin-left: 10px;
    padding: 10px;
    background: #fff;
    flex: 1;
    overflow-y: auto;
  }
}
</style>
