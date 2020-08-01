<template>
  <div class="announcement">
    <el-card shadow="hover">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部公告" name="first">
          <ul>
            <li
              class="pointer"
              v-for="(item, index) in announcement.listData"
              :key="index"
              @click="openDetail(item)"
            >
              <span class="el-icon-document"></span>&nbsp;
              <span class="list-title">{{ item.title }}</span>
              <p class="color9">{{ item.created_at }}</p>
            </li>
          </ul>
        </el-tab-pane>
        <!-- <el-tab-pane label="内部新闻" name="second">
                    <ul>
                        <li class="pointer" v-for="(item, index) in announcement.listData" :key="index" @click="openDetail(item)">
                            <span class="el-icon-document"></span>&nbsp;
                            <span class="list-title">{{item.title}}</span>
                            <span class="fr">{{item.created_at}}</span>
                        </li>
                    </ul>
        </el-tab-pane>-->
        <!-- <el-tab-pane label="奖励公示" name="third">奖励公示</el-tab-pane>
        <el-tab-pane label="ERP系统公告" name="fourth">ERP系统公告</el-tab-pane>-->
      </el-tabs>
    </el-card>
    <el-dialog :title="detailData.title" :visible.sync="dialogTableVisible">
      <div class="content">
        <div>创建时间：{{ detailData.created_at }}</div>
        <span>{{ detailData.content }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { announcementList, announcementDetail } from '@/api/home'
import { announcementAddLog } from '@/api/common'
export default {
  name: '',
  data() {
    return {
      activeName: 'first',
      dialogTableVisible: false,
      announcement: {
        params: {
          page: 1,
          pageSize: 20,
          type: ''
        },
        listData: [],
        total: null
      },
      detailData: {}
    }
  },
  created() {
    this.getAnnouncementList()
  },
  methods: {
    async getAnnouncementList() {
      try {
        let { data, paginator } = await announcementList(
          this.announcement.params
        )
        this.announcement.listData = data
        this.announcement.total = paginator.totalCount
      } catch (error) {
        this._message(error)
      }
    },
    async openDetail(item) {
      this.dialogTableVisible = true
      try {
        let { data } = await announcementDetail({
          announcement_id: item.announcement_id
        })
        this.detailData = data
        await announcementAddLog({
          announcement_id: item.announcement_id,
          type: 1
        })
      } catch (error) {
        this._message(error)
      }
    },

    handleClick(tab) {
      switch (tab.paneName) {
        case 'first':
          this.announcement.params.type = ''

          break
        case 'second':
          this.announcement.params.type = 'company'

          break
        default:
          break
      }
      this.getAnnouncementList()
    }
  }
}
</script>

<style scoped lang="scss">
.announcement {
  ul {
    line-height: 20px;
    li {
      margin-bottom: 10px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      p {
        padding-left: 22px;
      }
    }
  }
  .content {
    line-height: 24px;
  }
  ::v-deep .el-dialog__body {
    padding-top: 10px;
  }
}
</style>
