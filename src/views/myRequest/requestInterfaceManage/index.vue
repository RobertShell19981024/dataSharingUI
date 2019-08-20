<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%">
      <el-table-column type="index" align="center" width="200px" label="序号">
      </el-table-column>
      <el-table-column width="700px" align="center" label="路径">
        <template slot-scope="scope">
          <span>{{scope.row.uri}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="500">
        <template slot-scope="scope">
          <router-link :to="{path:'/myRequestManager/requestInitialConfig',query:{isShow:true,jgId:scope.row.id}}">
            <el-button v-if="apiRequestInitialConfig_btn_edit" size="small" type="success">编辑</el-button>
          </router-link>
          <el-button v-if="apiRequestInitialConfig_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
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
  } from '@/api/myRequest/requestInterfaceManage/index';

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
      this.apiRequestInitialConfig_btn_edit = true;
      this.apiRequestInitialConfig_btn_del = true;
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
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
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj(row.id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              });
          });
      }
    }
  }
</script>
