<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" width="250px" label="过滤器名称">
        <template slot-scope="scope">
          <span>{{scope.row.filterName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="过滤器功能说明">
        <template slot-scope="scope">
          <span>{{scope.row.functionalDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="过滤器别称">
        <template slot-scope="scope">
          <span>{{scope.row.filterBc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="过滤器注意事项">
        <template slot-scope="scope">
          <span>{{scope.row.filterNote}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用场景">
        <template slot-scope="scope">
          <span>{{scope.row.filterType}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="定制状态">
        <template slot-scope="scope">
          <span>{{scope.row.isDz == '1' ? '定制':'未定制'}}</span>
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
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from '@/api/myPublish/apiRouterFilter/index';


  export default {

    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          apiName: undefined
        },
        tableKey: 0,
        paramText: 'API参数信息',
        form: {
          filterName: undefined,
          functionalDesc: undefined,
          filterBc: undefined,
          filterOrder: undefined,
          filterNote: undefined,
          filterType: 0
        },
        dialogFormVisible: false,
        activeNames: ['1'],
        rules: {
          filterName: [
            {
              required: true,
              message: '请输入过滤器名称',
              trigger: 'blur'
            }
          ], filterBc: [
            {
              required: true,
              message: '请输入过滤器别称',
              trigger: 'blur'
            }
          ], filterOrder: [
            {
              required: true,
              message: '请输入执行顺序',
              trigger: 'blur'
            }
          ]
        },
      }
    },
    mounted() {
      this.getList();
      this.apiRouterDefineManager_btn_edit = true;
      this.apiRouterDefineManager_btn_del = true;
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
      }
    }
  }
</script>
