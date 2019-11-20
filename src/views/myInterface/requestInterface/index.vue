<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入接口名称"
                v-model="listQuery.apiName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%" v-loading="!listLoading">
      <el-table-column prop="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column width="300px" align="center" label="接口名称">
        <template slot-scope="scope">
          <span>{{scope.row.apiName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="方法">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="后缀地址">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人">
        <template slot-scope="scope">
          <span>{{scope.row.responsiblePersonName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人电话">
        <template slot-scope="scope">
          <span>{{scope.row.responsiblePersonTel}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button size="small" type="primary">
            <router-link
              :to="{path:'/myInterface/onlineTest',query: {apiId:scope.row.apiId,path:scope.row.path,isEdit:false}}">
              在线测试
            </router-link>
          </el-button>
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
    getRequestAllApiBaseInfo
  } from '@/api/myPublish/apiBaseInfo/index';

  export default {
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          apiName: undefined
        },
        tableKey: 0,
        dialogFormVisible: false,
        dzManager_btn_edit: false,
        dzManager_btn_del: false,
        dzManager_btn_add: false,
        updateFilterList: [],
        filterData: [],
        filterList: [],
        selectedFilterData: [],
        selectedFilterList: [],
        originList: [],
        filterUserjson: {},
        api_id: undefined,
        middle: {},
        updateId: undefined,
        options: [],
        apiRouterDefineManager_btn_edit: false,
        apiRouterDefineManager_btn_del: false,
        routeUpdateApiId: undefined,
        keyArr: [],
        keyVisible: false,
        keyList: null
      }
    },
    mounted() {
      this.getList();
      this.dzManager_btn_edit = true;
      this.dzManager_btn_del = true;
    },
    methods: {
      getList() {
        this.listLoading = false;
        getRequestAllApiBaseInfo(this.listQuery)
          .then(response => {
            const status = response.status;
            if (status === 200) {
              this.list = response.data.rows;
              this.list.forEach((item, index) => {
                item.index = (this.listQuery.page - 1) * this.listQuery.limit + index + 1
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
      },
      // 将左边表格选择项存入filterData中
      handleFilterChange(rows) {
        this.filterData = [];
        if (rows) {
          rows.forEach(row => {
            if (row) {
              this.filterData.push(row);
            }
          });
        }
      }
      ,
      // 将右边表格选择项存入selectedFilterData中
      handleSelectedFilterChange(rows) {
        this.selectedFilterData = [];
        if (rows) {
          rows.forEach(row => {
            if (row) {
              this.selectedFilterData.push(row);
            }
          });
        }
      }
      ,
      routeCancel() {
        this.routeVisible = false;
      },
      closeDialog() {
        this.resetTemp();
      },
    }
  }
</script>

