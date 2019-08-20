<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="过滤器名称"
                v-model="listQuery.apiName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="true" style="margin-left: 10px;"
                 @click="handleCreate" type="primary"
                 icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" width="250px" label="过滤器名称">
        <template slot-scope="scope">
          <span>{{scope.row.filterName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="过滤器别称">
        <template slot-scope="scope">
          <span>{{scope.row.filterBc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="执行顺序">
        <template slot-scope="scope">
          <span>{{scope.row.filterOrder}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="定制状态">
        <template slot-scope="scope">
          <span>{{scope.row.isDz == true ? '定制':'不定制'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="325">
        <template slot-scope="scope">
          <el-button v-if="apiRouterDefineManager_btn_edit" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
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
    <!-- 编辑详细信息 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-collapse v-model="activeNames">
          <!-- 基础信息部分 -->
          <el-collapse-item title="过滤器基础信息" name="1">
            <el-form-item label="过滤器名称" prop="filterName">
              <el-input v-model="form.filterName" placeholder="请输入过滤器名称"></el-input>
            </el-form-item>
            <el-form-item label="过滤器别称" prop="filterBc">
              <el-input v-model="form.filterBc" placeholder="请输入过滤器别称"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="执行顺序" prop="filterOrder">
                  <el-input v-model="form.filterOrder" placeholder="请输入过滤器的执行顺序"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否定制" prop="isDz">
                  <el-switch v-model="form.isDz" active-color="#13ce66" inactive-color="#ff4949" active-value="1"  inactive-value="0">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>

          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
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
        dialogStatus: '',
        tableKey: 0,
        paramText: 'API参数信息',
        form: {
          filterName: undefined,
          filterBc: undefined,
          filterOrder: undefined,
          isDz: 0
        },
        dialogFormVisible: false,
        apiRouterDefineManager_btn_edit: false,
        apiRouterDefineManager_btn_del: false,
        apiRouterDefineManager_btn_add: false,
        dialogTitle: '',
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
      },
      handleCreate() {
        this.dialogTitle = '新增过滤器';
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.dialogTitle = '修改过滤器';
            this.form = response.data;
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
          });
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
                this.list.splice(index1, 1);
              });
          });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
          } else {
            return false;
          }
        });
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
            putObj(this.form.id, this.form).then(() => {
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
      }, resetTemp() {
        this.form = {
          filterName: undefined,
          filterBc: undefined,
          filterOrder: undefined,
          isDz: 0
        }
      }
    }
  }
</script>
