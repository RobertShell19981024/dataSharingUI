<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入接口名称" v-model="listQuery.apiName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%" v-loading="!listLoading">
      <el-table-column prop="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column width="350px" align="center" label="接口Id">
        <template slot-scope="scope">
          <span>{{scope.row.apiId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="转发实际地址">
        <template slot-scope="scope">
          <span>{{scope.row.apiUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="请求共享平台地址">
        <template slot-scope="scope">
          <span>{{scope.row.accessClientIp}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="访问时间">
        <template slot-scope="scope">
          <span >{{scope.row.accessTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="请求数据">
        <template slot-scope="scope">
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
          >
            <span style="font-size: 16px;font-weight: 500">请求数据</span>
            <el-button type="primary" v-clipboard:copy="scope.row.requestData"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError" size="mini" style="margin-left: 30px">复制
            </el-button>
            <span slot="reference" v-if="scope.row.requestData!=undefined">{{scope.row.requestData.length<=100?scope.row.requestData:scope.row.requestData.substring(0,100)+"..."}}</span>
            <div style="height: 200px;overflow: auto">
              {{scope.row.requestData}}<br/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="反馈数据">
        <template slot-scope="scope">
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
          >
            <span style="font-size: 16px;font-weight: 500">反馈数据</span>
            <el-button type="primary" v-clipboard:copy="scope.row.responseData"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError" size="mini" style="margin-left: 30px">复制
            </el-button>
            <span slot="reference" v-if="scope.row.responseData!=undefined">{{scope.row.responseData.length<=100?scope.row.responseData:scope.row.responseData.substring(0,100)+"..."}}</span>
            <div style="height: 200px;overflow: auto">
              {{scope.row.responseData}}<br/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="">
      </el-table-column>
    </el-table>
    <div v-show="listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    getApiAccessRecords
  } from '@/api/journalManage/journalSearch/index';

  export default {
    data() {
      return {
        listLoading: true,
        list: null,
        total: null,
        tableKey: 0,
        listQuery: {
          page: 1,
          limit: 10,
          apiName:undefined
        }
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = false;
        getApiAccessRecords(this.listQuery)
          .then(response => {
            const status = response.status;
            if (status === 200) {
              this.list = response.data.rows;
              this.list.forEach((item,index)=>{
                item.index = (this.listQuery.page-1)*this.listQuery.limit+index+1
              });
              this.total = response.data.total;
              this.listLoading = true;
            } else if (status === 20500) {
              this.listLoading = false;
              this.$message({
                message: response.message,
                type: 'error',
                duration: 1500
              })
            }
          })
      }, handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleFilter() {
        this.getList();
      },
      onCopy() {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1500
        })
      }
      ,
      // 复制失败
      onError() {
        this.$message({
          message: '复制失败',
          type: 'error',
          duration: 1500
        })
      },
    }
  }
</script>

