<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%">
      <el-table-column type="index" align="center" width="200px" label="序号">
      </el-table-column>
      <el-table-column width="400px" align="center" label="接口名称">
      <template slot-scope="scope">
        <span>{{scope.row.apiName}}</span>
      </template>
    </el-table-column >
      <el-table-column width="400px" align="center" label="平台签名公钥" >
      <template slot-scope="scope">
        <el-popover
        placement="left"
        title="平台签名公钥"
        width="200"
        trigger="hover"
        >
          <span slot="reference">{{scope.row.signPtPubkey.length<=100?scope.row.signPtPubkey:scope.row.signPtPubkey.substring(0,100)+"..."}}</span>
          {{scope.row.signPtPubkey}}<br/>
          <el-button type="primary"  v-clipboard:copy="scope.row.signPtPubkey"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onError">复制</el-button>
      </el-popover>
      </template>
    </el-table-column>
      <el-table-column width="400px" align="center" label="签名私钥">
      <template slot-scope="scope">
        <el-popover
          placement="left"
          title="签名私钥"
          width="200"
          trigger="hover"
        >
        <span slot="reference">{{scope.row.signSecretKey.length<=100?scope.row.signSecretKey:scope.row.signSecretKey.substring(0,100)+"..."}}</span>
          {{scope.row.signSecretKey}}<br/>
          <el-button type="primary"  v-clipboard:copy="scope.row.signSecretKey"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onError">复制</el-button>
        </el-popover>
      </template>
    </el-table-column>
      <el-table-column width="400px" align="center" label="数据密钥">
        <template slot-scope="scope">
          <span>{{scope.row.symmetricPubkey}}</span>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
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
    getAllApiBaseInfo
  } from '@/api/myPublish/apiBaseInfo/index';

  export default {
    data() {
      return {
        form: {
          path: undefined,
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        dialogStatus: '',
        tableKey: 0,
        activeNames: ['1'],
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getAllApiBaseInfo(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },// 复制成功
      onCopy(){
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1500
        })
      },
      // 复制失败
      onError(){
        this.$message({
        message: '复制失败',
        type: 'error',
        duration: 1500
      })
      }
    }
  }
</script>
