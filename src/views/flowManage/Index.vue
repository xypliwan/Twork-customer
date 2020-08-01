<template>
  <div class="flow-manage">
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="发起流程" name="first"></el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label"
            >待我处理的
            <el-badge
              class="mark"
              :value="countCom('deal')"
              :hidden="countCom('deal') == 0"
            />
          </span>
        </el-tab-pane>
        <el-tab-pane label="我已处理的" name="third"></el-tab-pane>
        <el-tab-pane name="fourth">
          <span slot="label"
            >我发起的
            <el-badge
              class="mark"
              :value="countCom('my_create')"
              :hidden="countCom('deal') == 0"
            />
          </span>
        </el-tab-pane>
        <el-tab-pane name="five">
          <span slot="label"
            >抄送我的
            <el-badge
              class="mark"
              :value="countCom('cc_me')"
              :hidden="countCom('deal') == 0"
            />
          </span>
        </el-tab-pane>
      </el-tabs>
      <div class="search fr">
        <el-input
          v-show="activeName == 'first'"
          size="small"
          placeholder="请输入发起流程的名称"
          v-model="names"
          @keyup.enter.native="search"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="search"
          ></i>
        </el-input>
        <el-input
          v-show="activeName != 'first'"
          size="small"
          placeholder="请输入发起流程的名称"
          v-model="keyword"
          @keyup.enter.native="search"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="search"
          ></i>
        </el-input>
        <el-button
          v-show="activeName != 'first'"
          style="margin-left:5px;"
          type="text"
          @click="isOpen = !isOpen"
        >
          高级搜索
          <i :class="[isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
        </el-button>
      </div>
    </div>
    <initiate-process
      v-show="activeName == 'first'"
      ref="initiate"
    ></initiate-process>
    <waiting-process
      v-show="activeName != 'first'"
      :status="status"
      :type="type"
      :keyword="keyword"
      :isOpen="isOpen"
      ref="waiting"
      @clearKeywork="clearKeywork"
    ></waiting-process>
    <!-- <waiting-process v-show="activeName=='third'" status="2" type="deal_done" :keyword="keyword" :isOpen="isOpen" ref="processed"></waiting-process>
    <waiting-process v-show="activeName=='fourth'" status="3" type="my_create" :keyword="keyword" :isOpen="isOpen" ref="initiator"></waiting-process>
    <waiting-process v-show="activeName=='five'" status="4" type="cc_me" :keyword="keyword" :isOpen="isOpen" ref="copyTo"></waiting-process>-->
  </div>
</template>

<script>
import InitiateProcess from './components/initiateProcess/Index'
import WaitingProcess from './components/waitingProcess/Index'
import { getListCountAll } from '@/api/flowManage'
export default {
  name: 'FlowManage',
  components: { InitiateProcess, WaitingProcess },
  data() {
    return {
      activeName: 'first',
      isOpen: false,
      names: '',
      keyword: '',
      status: '',
      type: '',
      countList: []
    }
  },
  created() {
    this.getNum()
  },
  activated() {
    let status = this.$route.query.status
    if (status) {
      switch (status) {
        case 'upcom':
          this.activeName = 'second'
          this.type = 'deal'
          this.status = '1'
          this.$refs.waiting.getList()
          break
        case 'cc':
          this.activeName = 'five'
          this.type = 'cc_me'
          this.status = '4'
          this.$refs.waiting.getList()
          break
        case 'completed':
          this.activeName = 'third'
          this.type = 'deal_done'
          this.status = '2'
          this.$refs.waiting.getList()
          break
      }
    }
  },
  computed: {
    countCom() {
      return key => {
        let item = this.countList.find(el => el.key == key)
        return item ? item.count : 0
      }
    }
  },
  methods: {
    async getNum() {
      try {
        let { data } = await getListCountAll()
        this.countList = data
      } catch (error) {
        this._message(error)
      }
    },
    handleClick(tab) {
      switch (tab.name) {
        case 'first':
          this.$refs.initiate.getGroupList(this.names)
          break
        case 'second':
          this.type = 'deal'
          this.status = '1'
          this.$refs.waiting.getList()
          break
        case 'third':
          this.type = 'deal_done'
          this.status = '2'
          this.$refs.waiting.getList()
          break
        case 'fourth':
          this.type = 'my_create'
          this.status = '3'
          this.$refs.waiting.getList()
          break
        case 'five':
          this.type = 'cc_me'
          this.status = '4'
          this.$refs.waiting.getList()
          break

        default:
          break
      }
    },
    search() {
      switch (this.activeName) {
        case 'first':
          this.$refs.initiate.getGroupList(this.names)
          break
        case 'second':
        case 'third':
        case 'fourth':
        case 'five':
          this.$refs.waiting.getList()
          break
      }
    },
    clearKeywork() {
      this.keyword = ''
    }
  }
}
</script>

<style scoped lang="scss">
.flow-manage {
  min-width: 900px;
  overflow: auto;
  min-height: calc(100vh - 100px);
  padding: 10px 20px;
  background-color: #fff;
  .tabs {
    box-shadow: #eee 0px -2px 0px inset;
    margin-bottom: 10px;
    .el-tabs {
      display: inline-block;
    }
    ::v-deep .el-tabs__header {
      margin: 0;
    }
    ::v-deep .el-tabs__nav-wrap::after {
      height: 0;
    }
    .search {
      min-width: 250px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
