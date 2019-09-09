<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="API名称" v-model="listQuery.apiName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column align="center" width="250px" label="api名称">
        <template slot-scope="scope">
          <span>{{scope.row.apiName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="350px"  label="apiPubkey">
        <template slot-scope="scope">
          <span>{{scope.row.apiPubkey}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="method">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="path">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启用状态">
        <template slot-scope="scope">
          <span>{{scope.row.enabledStatus == true ? '正在使用':'未启用'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleShow(scope.row)">查看参数信息
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- API参数信息展示 -->
    <el-dialog :title="paramText" :visible.sync="dialogParamFormVisible">
      <el-collapse v-model="activeNames">
        <!-- Http Header部分 -->
        <el-collapse-item title="Header参数信息" name="1">
          <el-table :data="api_info_form.apiHeaderInfoList_form" style="width: 100%">
            <el-table-column prop="headerName" label="Header Key" style="width:33%">
            </el-table-column>
            <el-table-column prop="headerValue" label="Header Value" style="width:33%">
            </el-table-column>
            <el-table-column prop="headerNote" label="备注" style="width:33%">
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <!-- QueryString部分部分 -->
        <el-collapse-item title="QueryString参数信息" name="2">
          <el-table :data="api_info_form.apiQueryInfoList_form" style="width: 100%">
            <el-table-column prop="queryName" label="key" style="width:33%">
            </el-table-column>
            <el-table-column prop="validateReg" label="校验规则" style="width:33%">
            </el-table-column>
            <el-table-column prop="queryNote" label="备注" style="width:33%">
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <!-- Http Body部分 -->
        <el-collapse-item title="Body参数信息" name="3">
          <el-table :data="api_info_form.apiBodyInfoList_form" style="width: 100%">
            <el-table-column prop="paramName" label="key" style="width:33%">
            </el-table-column>
            <el-table-column prop="validateReg" label="校验规则" style="width:33%">
            </el-table-column>
            <el-table-column prop="paramNote" label="备注" style="width:33%">
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
  import {
    page,
    getOneApiBaseInfo
  } from '@/api/interfaceService/accessServiceManage/index';
  import { mapGetters } from 'vuex';
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
        api_info_form: { // api信息表单数据
          apiHeaderInfoList_form: [],
          apiQueryInfoList_form: [],
          apiBodyInfoList_form: []
        },
        dialogParamFormVisible: false, // API参数信息展示dialog
        dialogStatus: '',
        tableKey: 0,
        paramText: 'API参数信息',
        activeNames: [1, 2, 3]
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
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.listLoading = false;
            this.list = response.data.rows;
            this.total = response.data.total;
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
      // 查看文档信息
      handleShow(row) {
        this.dialogParamFormVisible = true;
        getOneApiBaseInfo(row.apiId).then(response => {
          let rsp_data = response.data;
          this.api_info_form.apiHeaderInfoList_form = rsp_data.apiHeaderInfoList;
          this.api_info_form.apiQueryInfoList_form = rsp_data.apiQueryInfoList;
          this.api_info_form.apiBodyInfoList_form = rsp_data.apiBodyInfoList;
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            putObj(this.form.apiId, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      }
    }
  }
</script>
