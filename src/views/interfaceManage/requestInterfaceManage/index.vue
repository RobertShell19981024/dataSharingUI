<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入ip访问地址" v-model="listQuery.uri">
    </el-input>
    <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%" v-loading="!listLoading">
      <el-table-column prop="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column width="170px" align="center" label="接口主鍵">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="路径">
        <template slot-scope="scope">
          <span>{{scope.row.uri}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="访问用户ID">
        <template slot-scope="scope">
          <span>{{scope.row.fromUser}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="平台签名公钥">
        <template slot-scope="scope">
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
          >
            <span style="font-size: 16px;font-weight: 500">签名公钥</span>
            <el-button type="primary" v-clipboard:copy="scope.row.ptPubKey"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError" size="mini" style="margin-left: 30px">复制
          </el-button>
            <span slot="reference" v-if="scope.row.ptPubKey!=undefined">{{scope.row.ptPubKey.length<=100?scope.row.ptPubKey:scope.row.ptPubKey.substring(0,100)+"..."}}</span>
            <div style="height: 200px;overflow: auto">
              {{scope.row.ptPubKey}}<br/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="350px" align="center" label="签名私钥">
        <template slot-scope="scope">
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
          >
            <span style="font-size: 16px;font-weight: 500">签名私钥</span>
            <el-button type="primary" v-clipboard:copy="scope.row.secretKey"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError" size="mini" style="margin-left: 30px">复制
          </el-button>
            <span slot="reference" v-if="scope.row.secretKey!=undefined">{{scope.row.secretKey.length<=100?scope.row.secretKey:scope.row.secretKey.substring(0,100)+"..."}}</span>
            <div style="height: 200px;overflow: auto">
            {{scope.row.secretKey}}<br/>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="数据密钥">
        <template slot-scope="scope">
          <span>{{scope.row.symPubkey}}</span>
        </template>
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
    getAdminAllApiJgtoPtInfo
  } from '@/api/myRequest/requestInterfaceManage/index';

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
          uri:undefined
        }, handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.getList();
        },
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = false;
        getAdminAllApiJgtoPtInfo(this.listQuery)
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
      handleFilter() {
        this.getList();
      }

    }
  }
</script>

