<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-date-picker v-model="timeStr" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
      style="width: 100%">
      <el-table-column type="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column align="center" width="250px" label="接收用户">
        <template slot-scope="scope">
          <span>{{scope.row.receiverName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="350px" label="接收地址">
        <template slot-scope="scope">
          <span>{{scope.row.receiverUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送类型">
        <template slot-scope="scope">
          <span>{{scope.row.typedesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送日期">
        <template slot-scope="scope">
          <span>{{scope.row.sendTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status==0?'发送成功':'发送失败'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="数据">
        <template slot-scope="scope">
          <span>{{scope.row.requestData}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" width="350" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="showRequestData(scope.row)">发送的数据
          </el-button>
          <el-button size="small" type="warning" @click="RequestDataAgain(scope.row)">重新发送
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="word-break: break-all">
        {{httpData}}
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    page, getObj
  } from '@/api/notice/noticeDataManage/index';
  import { mapGetters } from 'vuex';
  export default {

    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          startTime: undefined,
          endTime: undefined
        },
        dialogStatus: '',
        tableKey: 0,
        httpData: '', // 显示发送的或接收的数据
        dialogFormVisible: false,
        textMap: {
          requestTitle: 'request数据',
        },
        noticeDialogTitle: false,
        timeStr: []
      }
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = false;
        page(this.listQuery)
          .then(response => {
            this.listLoading = false;
            this.list = response.data.rows;
            this.total = response.data.total;
          })
      },
      handleFilter() {
        if (this.timeStr == null || this.timeStr == '' || this.timeStr[0] == undefined || this.timeStr[1] == undefined) {
          this.listQuery.startTime = null;
          this.listQuery.endTime = null;
          this.getList();
        } else {
          let startTime = this.timeStr[0];
          let endTime = this.timeStr[1];
          endTime = endTime.substring(0, 11) + '23:59:59';
          this.listQuery.startTime = startTime;//把修改后的正确时间给要传递的参数
          this.listQuery.endTime = endTime;
          this.getList();
        }
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },

      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      // 显示请求的数据
      showRequestData(row) {
        this.dialogFormVisible = true;
        this.dialogStatus = 'requestTitle';
        this.httpData = '';
        this.httpData = row.requestData;
      },
      RequestDataAgain(row) {
        getObj(row.recordId)
          .then(() => {
            this.$notify({
              title: '成功',
              message: '发送成功',
              type: 'success',
              duration: 2000
            });
          });
      }
    }
  }
</script>
