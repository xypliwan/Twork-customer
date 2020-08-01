<template>
  <div class="top-navigation">
    <div class="flex-left">
      <img class="logo" src="../../assets/images/new_logo1.png" alt />&nbsp;
      <span style="color:#fff;font-size:15px;">Twork协同</span>
    </div>
    <div class="flex-center">
      <el-menu
        :router="true"
        :default-active="activeIndex2"
        mode="horizontal"
        @select="handleSelect"
        background-color="#333854"
        text-color="#ffffff80"
        active-text-color="#ffffff"
      >
        <template v-for="(item, index) in userInfo.menu">
          <el-menu-item v-if="!item.child" :index="item.path" :key="index">
            <el-badge
              :value="dynamicNum"
              class="item"
              :hidden="item.code !== '/dynamic' || dynamicNum == 0"
            >
              <span>{{ item.name }}</span>
            </el-badge>
          </el-menu-item>
          <el-submenu v-if="item.child" :index="item.path" :key="index">
            <template slot="title">{{ item.name }}</template>
            <el-menu-item
              v-for="(el, i) in item.child"
              :key="i"
              :index="el.path"
              >{{ el.name }}</el-menu-item
            >
          </el-submenu>
        </template>
        <!-- <el-menu-item :index="item.path" :key="index">
            <el-badge
              :value="dynamicNum"
              class="item"
              :hidden="item.code !== '/dynamic' || dynamicNum == 0"
            >
              <span>{{ item.name }}</span>
            </el-badge>
          </el-menu-item> -->
      </el-menu>
    </div>

    <el-dropdown>
      <span class="el-dropdown-link outher-icon">
        <i class="iconfont icon-jiahao1"></i>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toOkr">建立OKR</el-dropdown-item>
        <el-dropdown-item @click.native="toProcess">发起流程</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <span class="ecs-box" @click="toEcs">
      <el-tooltip
        class="item"
        effect="dark"
        content="客户服务"
        placement="bottom"
      >
        <el-badge
          :value="ecsMsgNum"
          size="mini"
          :hidden="ecsMsgNum == 0"
          class="item"
        >
          <i class="iconfont icon-renyuan"></i>
        </el-badge>
      </el-tooltip>
    </span>

    <span v-if="_menuPermission('manage_perform')">
      <el-tooltip
        class="item"
        effect="dark"
        content="后台管理"
        placement="bottom"
      >
        <a
          style="text-decoration: none;"
          :href="
            backUrl +
              '/#/home?access_token=' +
              access_token +
              '&company_id=' +
              userInfo.company_id +
              ''
          "
          target="_blank"
        >
          <i class="iconfont icon-shezhi1" @click="record"></i>
        </a>
      </el-tooltip>
    </span>
    <div class="flex-right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="iconfont icon-zhanghao"></i>
          {{ userInfo.username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="toUserCenter"
            >个人中心</el-dropdown-item
          >
          <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import baseURL from '@/config/baseUrl'
import { getEcsMsg, targetAddLog, userAddLog } from '@/api/common'

export default {
  name: 'TopNavigation',
  props: {},
  data() {
    return {
      backUrl: baseURL.backUrl,
      activeIndex2: '/home',
      ecsUrl: ''
    }
  },
  watch: {
    userInfo() {
      this.getEcsMsg()
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'tabList',
      'access_token',
      'ecsMsgNum',
      'dynamicList'
    ]),
    dynamicNum() {
      let num = null
      if (this.dynamicList.length) {
        num = this.dynamicList.find(el => el.dynamit_type_name == '全部').num
      }
      return num
    }
  },
  methods: {
    ...mapActions([
      'clearUserInfo',
      'clearToken',
      'setNeedCreateOkr',
      'setEcsMsgNum'
    ]),

    toEcs() {
      if (this.ecsUrl.length <= 0) {
        this._message('此账号未绑定工单系统', 'warning')
        return
      }

      window.open(this.ecsUrl, '_blank')
    },
    async getEcsMsg() {
      try {
        let {
          data: { num, ecs_url }
        } = await getEcsMsg()
        this.setEcsMsgNum(num)
        this.ecsUrl = ecs_url
      } catch (error) {
        this._message(error)
      }
    },
    toProcess() {
      this.$router.push({ path: '/flowManage' })
    },
    async toOkr() {
      this.$router.push({
        path: '/target/target-kanban',
        query: { create: 'okr' }
      })
      this.setNeedCreateOkr()
      try {
        // 记录点击
        await targetAddLog()
      } catch (error) {
        this._message(error)
      }
    },
    async record() {
      try {
        // 记录点击
        await userAddLog()
      } catch (error) {
        this._message(error)
      }
    },
    handleSelect() {},
    toUserCenter() {
      this.$router.push('/user-center')
    },
    loginOut() {
      this.clearToken()
      this.$router.push('/entrance/login')
    }
  }
}
</script>

<style scoped lang="scss">
$bgc: #333854;
$color: #adb0b8;
.top-navigation {
  width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  color: $color;
  background-color: $bgc;
  display: flex;
  font-size: 14px;
  .flex-left,
  .flex-right {
    padding: 0 20px;
    img {
      vertical-align: middle;
    }
  }
  .flex-center {
    flex: 1;
    min-width: 500px;
    ::v-deep .el-badge__content.is-fixed {
      top: 14px;
      right: 4px;
    }
  }
  .outher-icon {
    margin-right: 20px;
  }
  .ecs-box {
    margin-right: 20px;
    cursor: pointer;
    .icon-renyuan {
      color: #fff;

      font-size: 19px;
    }
    ::v-deep .el-badge__content.is-fixed {
      top: 14px;
    }
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .logo {
    width: 24px;
    margin-right: 5px;
  }
  ::v-deep .el-menu.el-menu--horizontal {
    height: 50px;
    border: 0;
    background: red;
  }
  ::v-deep .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 0px solid #fff;
    background-color: red;
  }
  ::v-deep .el-menu.el-menu--horizontal .el-menu-item,
  ::v-deep .el-menu--horizontal > .el-submenu .el-submenu__title {
    height: 50px;
    line-height: 50px;
    border-bottom: 0px solid #fff;
  }
  a {
    color: #fff;
  }
  ::v-deep .is-active {
    background: rgba(255, 255, 255, 0.2) !important;
  }
  ::v-deep .el-menu-item {
    width: 96px;
    text-align: center;
  }
}
::v-deep .el-badge__content {
  z-index: 99 !important;
}
</style>
