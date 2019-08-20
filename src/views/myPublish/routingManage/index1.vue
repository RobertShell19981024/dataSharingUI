<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" v-if="true" style="margin-left: 10px;"
                 @click="handleCreate" type="primary"
                 icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" width="250px" label="路径">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="访问地址">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否重试">
        <template slot-scope="scope">
          <span>{{scope.row.retryable == true ? '重试':'不重试'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否可用">
        <template slot-scope="scope">
          <span>{{scope.row.enabled == true ? '可用':'不可用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否有前缀">
        <template slot-scope="scope">
          <span>{{scope.row.stripPrefix == true ? '有前缀':'没有前缀'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建用户名">
        <template slot-scope="scope">
          <span>{{scope.row.crtUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新用户名">
        <template slot-scope="scope">
          <span>{{scope.row.updUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
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
          <el-collapse-item title="路由基础信息" name="1">
            <el-row>
              <el-col :span="12">
                <el-form-item label="路由路径" prop="path">
                  <el-input v-model="form.path" placeholder="请输入路由路径"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="访问地址" prop="url">
                  <el-input v-model="form.url" placeholder="请输入访问地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否重试" prop="retryable">
                  <el-switch v-model="form.retryable" active-color="#13ce66" inactive-color="#ff4949"  active-value="1"  inactive-value="0">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否可用" prop="enabled">
                  <el-switch v-model="form.enabled" active-color="#13ce66" inactive-color="#ff4949"  active-value="1"  inactive-value="0">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否有前缀" prop="stripPrefix">
                  <el-switch v-model="form.stripPrefix" active-color="#13ce66" inactive-color="#ff4949"  active-value="1"  inactive-value="0">
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
  } from '@/api/myPublish/apiRouterDefine/index';

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
          path: undefined,
          url: undefined,
          retryable: 0,
          enabled: 0,
          stripPrefix: 0
        },
        dialogFormVisible: false,
        apiRouterDefineManager_btn_edit: false,
        apiRouterDefineManager_btn_del: false,
        apiRouterDefineManager_btn_add: false,
        dialogTitle: '',
        activeNames: ['1'],
        rules: {
          path: [
            {
              required: true,
              message: '请输入路由路径',
              trigger: 'blur'
            }
          ], url: [
            {
              required: true,
              message: '请输入路由地址',
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
        this.dialogTitle = '新增路由';
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.dialogTitle = '修改路由';
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
                this.list.splice(index, 1);
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
          path: undefined,
          url: undefined,
          retryable: 0,
          enabled: 0,
          stripPrefix: 0
        }
      }
    }
  }
</script>

