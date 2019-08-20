<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="API名称"-->
                <!--v-model="listQuery.apiName">-->
      <!--</el-input>-->
      <!--<el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>-->
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%">
      <el-table-column type="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column width="350px" align="center" label="接口名称">
        <template slot-scope="scope">
          <span>{{scope.row.apiName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="路径">
        <template slot-scope="scope">
          <span>{{scope.row.baseUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="访问地址">
      <template slot-scope="scope">
        <span>{{scope.row.path}}</span>
      </template>
    </el-table-column>
      <el-table-column width="100px" align="center" label="方法">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="定制状态">
        <template slot-scope="scope">
          <span>{{scope.row.isDz == true ? '定制':'未定制'}}</span>
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
      <el-table-column fixed="right" align="center" label="操作" width="325">
        <template slot-scope="scope">
          <router-link :to="{path:'/myPublishManager/addApiManage',query:{isShow:true,id:scope.row.apiId}}">
            <el-button v-if="apiRouterDefineManager_btn_edit" size="small" type="success">编辑</el-button>
          </router-link>
          <el-button v-if="apiRouterDefineManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">
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
    getOneApiBaseInfo,
    delObj,
    putObj
  } from '@/api/myPublish/apiBaseInfo/index';
  import {
    getFilterByApiId, updateFilter
  } from '@/api/myPublish/apiUserFilter/index';

  export default {
    data() {
      return {
        form: {
          apiName: undefined,
          baseUrl: undefined,
          path: undefined,
          method: '',
          enabledStatus: 0,
          isDz: 0,
          responsiblePersonName: undefined,
          responsiblePersonTel: undefined
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          apiName: undefined
        },
        dialogStatus: '',
        apiRouterDefineManager_btn_edit: false,
        apiRouterDefineManager_btn_del: false,
        tableKey: 0,
        activeNames: ['1'],
        Visible: false,
        filterData: [],
        filterIdValue: [],
        originList: [],
        api_key: '',
      }
    },
    mounted() {
      this.getList();
      this.apiRouterDefineManager_btn_edit = true;
      this.apiRouterDefineManager_btn_del = true;
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {
          });
      },
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

      handleUpdate(row) {
        getObj(row.apiId)
          .then(response => {
            this.form = response.data;
          });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj(row.apiId)
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
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            putObj(this.form.apiId, this.form).then(() => {
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
