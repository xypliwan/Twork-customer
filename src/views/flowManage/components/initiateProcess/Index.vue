<template>
  <div class="initiate-process">
    <div class="flow-content" v-loading="loading">
      <!-- :accordion="true" -->
      <div v-if="groupData.length > 0">
        <el-collapse
          v-if="groupData.length > 0"
          v-model="activeNames"
          @change="handleChange"
        >
          <el-collapse-item
            v-for="(item, index) in groupData"
            :key="index"
            :name="index + 1"
          >
            <template slot="title">
              <div class="collapse_title">
                <i
                  class="el-icon-arrow-right right-icon"
                  :class="item.isExpend ? 'right-icon-active' : ''"
                ></i>
                {{ item.group_name }}
                <label class="group-length"
                  >( {{ item.process.length }} )</label
                >
              </div>
            </template>
            <ul class="scrollbar">
              <li
                class="collapse-box pointer"
                v-for="(el, i) in item.process"
                :key="i"
                @click="openDetail(el)"
              >
                <div class="left">
                  <div class="icon">
                    <img
                      v-if="el.img.length"
                      :src="require(`@/assets/images/flowimg/${el.img}`)"
                      alt=""
                    />
                  </div>
                </div>
                <div class="right">{{ el.name }}</div>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-if="groupShow" class="nogroup">
        您还没有设置流程模板，请通过“后台管理”，进行设置流程模板。
      </div>
    </div>
    <!-- :destroy-on-close="true"  -->
    <el-drawer title :visible.sync="drawer" :with-header="false" size="60%">
      <process
        :process_id="process_id"
        ref="process"
        @closeDarwer="drawer = false"
      ></process>
    </el-drawer>
  </div>
</template>

<script>
import { groupList } from '@/api/flowManage'
import { processAddLog } from '@/api/common'
import Process from '../process'
export default {
  name: '',
  components: {
    Process
  },
  data() {
    return {
      activeNames: [], //默认打开的折叠面板
      drawer: false,
      loading: false,
      groupShow: false,
      groupData: [],
      process_id: ''
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    handleChange(val) {
      this.groupData.forEach(el => {
        this.$set(el, 'isExpend', false)
      })
      val.forEach(el => {
        if (el) this.$set(this.groupData[el - 1], 'isExpend', true)
      })
    },
    async getGroupList(name) {
      this.loading = true
      try {
        let { data } = await groupList({ name: name })
        if (data.length > 0) this.groupShow = false
        else this.groupShow = true
        this.groupData = data
        this.activeNames = []
        this.groupData.forEach((el, index) => {
          // el['isExpend'] = true;
          this.$set(el, 'isExpend', true)
          this.activeNames.push(index + 1)
        })
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    async openDetail(item) {
      this.drawer = true
      this.process_id = item.process_id
      try {
        // 记录点击
        await processAddLog({ type: 1 })
      } catch (error) {
        this._message(error)
      }
      this.$nextTick(() => {
        this.$refs.process.getDetail(item.process_id)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.initiate-process {
  .flow-content {
    margin-top: 20px;
  }
  .collapse_title {
    width: 100%;
    box-shadow: #eee 0px -1px 0px inset;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    background: #f1f1f1;
    padding-left: 10px;
    .right-icon {
      margin-right: 5px;
      transform: rotate(0deg);
      transition: all 0.2s;
      &.right-icon-active {
        transform: rotate(90deg);
      }
    }
    .group-length {
      font-size: 14px;
      color: #888;
    }
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    .collapse-box {
      width: 180px;
      display: flex;
      align-items: center;
      padding: 10px;
      margin: 10px 10px 0px 10px;
      border-radius: 8px;
      border: 1px solid #eee;
      .left {
        width: 50px;
        margin-right: 8px;
        .icon {
          margin: 0 auto;
          width: 50px;
          height: 50px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .right {
        font-weight: bold;
        line-height: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .nogroup {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 20px;
    border: 1px solid orange;
    border-radius: 5px;
    color: orange;
  }
  .el-collapse {
    border-bottom: 0;
  }
  .el-collapse-item {
    margin-bottom: 5px;
  }
  ::v-deep .el-collapse-item__arrow {
    display: none;
  }
}
</style>
