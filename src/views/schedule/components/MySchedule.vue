<template>
  <div class="my-schedule">
    <div class="calendar">
      <Calendar
        v-on:choseDay="clickDay"
        :textTop="['日', '一', '二', '三', '四', '五', '六']"
        :sundayStart="true"
      ></Calendar>
    </div>
    <div class="my-schedule-flex">
      <el-input
        class="my-schedule-flex-left"
        placeholder="请输入内容"
        v-model="keyword"
        clearable
        size="small"
        @keyup.enter.native="search"
      >
        <i
          slot="prefix"
          class="el-input__icon el-icon-search"
          @click="search"
        ></i>
      </el-input>

      <el-popover placement="bottom" width="150" trigger="hover">
        <ul class="popover-box">
          <li @click="$emit('openGroupDialog', true)">新建日程组</li>
          <li @click="$emit('openSubscribeDialog', true)">订阅日程组</li>
        </ul>
        <span slot="reference" class="el-icon-plus pointer theme-color"></span>
      </el-popover>
    </div>
    <section>
      <div
        class="my-schedule-group"
        v-for="(item, index) in groupData"
        :key="index"
      >
        <div class="my-schedule-flex pointer" @click="groupClick(item)">
          <span class="my-schedule-flex-left pointer">{{ item.title }}</span>
          <span
            class="arrow-down el-icon-arrow-down"
            :class="{ 'arrow-down-active': item.isShow }"
          ></span>
        </div>
        <ul :class="{ 'ul-active': item.isShow }">
          <li v-for="(el, i) in item.data" :key="i">
            <span class="li-flex-left" @click="setChecked(el)">
              <span
                :class="
                  el.isChecked ? 'el-icon-folder-checked' : 'el-icon-folder'
                "
                :style="{ color: el.color }"
              ></span>
              {{ el.name }}
            </span>
            <span class="li-flex-right">
              <span
                class="schedule-del el-icon-error"
                @click="delGroup(el, index)"
              ></span>
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="bottom"
              >
                <span
                  v-if="el.type == 1"
                  class="schedule-del el-icon-s-tools"
                  @click="$emit('openGroupDialog', el)"
                ></span>
              </el-tooltip>
            </span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { scheduleGroupDel, userQuit } from '@/api/schedule'
import vueEvent from '@/utils/vue-event'
import Calendar from 'vue-calendar-component'

export default {
  components: { Calendar },
  props: {
    groupData: Array
  },
  data() {
    return {
      isShow: false,
      keyword: '',
      checked1: ''
    }
  },
  created() {},
  methods: {
    search() {
      this.$emit('searchGroupList', this.keyword)
    },
    groupClick(item) {
      if (item.isShow) {
        this.$set(item, 'isShow', false)
      } else {
        this.$set(item, 'isShow', true)
      }
    },
    setChecked(el) {
      this.$set(el, 'isChecked', !el.isChecked)
      let schedule_group = []
      this.groupData.forEach(el => {
        el.data.forEach(v => {
          if (v.isChecked) schedule_group.push(v)
        })
      })
      const schedule_group_id = schedule_group.map(el => el.id).join(',')
      vueEvent.$emit('refreshScheduleList', schedule_group_id)
    },
    // 删除日程组
    async scheduleGroupDel(el) {
      try {
        await scheduleGroupDel({ id: el.id })
        this.$message.success(el.name + '删除成功')
        this.$emit('searchGroupList')
      } catch (error) {
        this._message(error)
      }
    },
    // 退出或取消日程组
    async scheduleGroupQuit(el, index) {
      try {
        await userQuit({ id: el.id, type: el.type })
        if (index == 0) {
          this.$message.success('已退出' + el.name)
        } else {
          this.$message.success('已取消订阅' + el.name)
        }
        this.$emit('searchGroupList')
      } catch (error) {
        this._message(error)
      }
    },
    async delGroup(el, index) {
      // el.type == 1 时删除，我的日程组type!=1是退出 订阅日程组调用取消订阅
      if (el.type == 1) {
        this.$confirm(`删除“${el.name}”, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.scheduleGroupDel(el)
          })
          .catch(() => {})
      } else {
        this.scheduleGroupQuit(el, index)
      }
    },

    clickDay(data) {
      vueEvent.$emit('gotoPast', data)
    }
  }
}
</script>

<style scoped lang="scss">
.my-schedule {
  height: 100%;
  .my-schedule-flex {
    display: flex;
    align-items: center;
    .my-schedule-flex-left {
      flex: 1;
      margin-right: 10px;
    }
  }
  section {
    margin-top: 10px;
    .my-schedule-group {
      margin-top: 20px;
      .arrow-down {
        font-weight: bold;
        transition: all 0.5s ease;
        &.arrow-down-active {
          transform: rotate(180deg);
        }
      }
      ul {
        margin-top: 10px;
        max-height: 500px;
        overflow: auto;
        transition: all 0.5s ease;
        &::-webkit-scrollbar {
          display: none;
        }
        &.ul-active {
          max-height: 0px;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        li {
          cursor: pointer;
          font-size: 14px;
          line-height: 24px;
          padding: 0px 10px;
          display: flex;
          align-items: center;
          .li-flex-left {
            flex: 1;
          }
          .li-flex-right {
            .schedule-del {
              float: right;
              display: none;
              margin-left: 10px;
            }
          }
          &:hover .schedule-del {
            display: inline-block;
            // color: #f56c6c;
          }
        }
      }
    }
  }
  .calendar {
    margin-bottom: 20px;
  }
}
.popover-box {
  line-height: 30px;
  cursor: pointer;
}

::v-deep .wh_content_all[data-v-2ebcbc83] {
  background-color: #f8f9fa;
}

::v-deep .wh_content_item[data-v-2ebcbc83],
wh_content_item_tag[data-v-2ebcbc83] {
  color: #555;
}
::v-deep .wh_top_changge li[data-v-2ebcbc83] {
  color: #555;
}
::v-deep .wh_jiantou1[data-v-2ebcbc83] {
  border-top: 2px solid #555;
  border-left: 2px solid #555;
}
::v-deep .wh_jiantou2[data-v-2ebcbc83] {
  border-top: 2px solid #555;
  border-right: 2px solid #555;
}
::v-deep [data-v-0e199b84] .wh_isToday[data-v-2ebcbc83] {
  color: #fff;
}
::v-deep .wh_content_item .wh_chose_day[data-v-2ebcbc83] {
  color: #fff;
}
::v-deep .wh_item_date[data-v-2ebcbc83]:hover {
  border-radius: 50%;
}
::v-deep .wh_item_date[data-v-2ebcbc83],
::v-deep .wh_top_tag[data-v-2ebcbc83] {
  height: 30px;
  width: 30px;
}
::v-deep .wh_isToday[data-v-2ebcbc83] {
  background-color: #526ecc;
}
</style>
