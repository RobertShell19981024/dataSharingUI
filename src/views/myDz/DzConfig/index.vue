<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="路由名称"-->
      <!--v-model="listQuery.apiName">-->
      <!--</el-input>-->
      <!--<el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>-->
      <el-button class="filter-item" v-if="true" style="margin-left: 10px;"
                 @click="handleCreate" type="primary"
                 icon="edit">添加
      </el-button>
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
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
                <el-form-item label="访问IP地址" prop="url">
                  <el-input v-model="form.url" placeholder="请输入IP访问地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="路由后缀地址" prop="path">
                  <el-input v-model="form.path" placeholder="后缀地址"></el-input>
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
    getOneApiBaseInfo,
    getAllApiBaseInfo,
    delObj,
    putObj,
    getAdminApiBaseInfo
  } from '@/api/myPublish/apiBaseInfo/index';
  import {
    getAdminAllApiJgtoPtInfo
  } from '@/api/myRequest/requestInterfaceManage/index';

  export default {
    data() {
      // baseURL 校验
      let urlValidate = (rule, value, callback) => {
        // base_url 正则，匹配http或https开头,host为IP:端口或域名:端口,不允许携带任何后缀
        let base_url_reg = new RegExp('^((https|http)?://)(([0-9]{1,3}.){3}[0-9]{1,3})(:[0-9]{1,5})(?!.)|([0-9a-z_!~*\'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6}(:[0-9]{1,5})?(?!.)$');
        if (value === '' || value === undefined) {
          callback(new Error('请输入IP访问地址'));
        } else if (!base_url_reg.test(value)) {
          callback(new Error('baseURL格式错误，请检查格式(例:http://10.10.10.10:8080)'));
        } else {
          callback();
        }
      };
      // path 校验
      let pathValidate = (rule, value, callback) => {
        // path正则表达式,匹配/xxx一次或多次,不能以字符/结尾
        let path_reg = new RegExp('\/.+');
        if (value === '' || value === undefined) {
          callback(new Error('请输入后缀地址'));
        } else if (!path_reg.test(value)) {
          callback(new Error('path格式错误，请检查格式(例:/xxx)'));
        } else {
          callback();
        }
      };
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
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
              message: '路径格式不能为空',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'blur',
              validator: pathValidate
            }
          ], url: [
            {
              required: true,
              message: '路由地址不能为空',
              trigger: 'blur'
            }, {
              required: true,
              trigger: 'blur',
              validator: urlValidate
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
        getAdminApiBaseInfo(this.listQuery)
          .then(response => {
            const status = response.status;
            if (status === 200) {
              this.listLoading = false;
              this.list = response.data.rows;
              this.total = response.data.total;
            } else if (status === 20500) {
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
              .then(response => {
                const status = response.status;
                if (status === 20500) {
                  this.$message({
                    message: response.message,
                    type: 'error',
                    duration: 1500
                  })
                } else {
                  this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                  });
                }
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
              .then(response => {
                const status = response.status;
                if (status === 20500) {
                  this.$message({
                    message: response.message,
                    type: 'error',
                    duration: 1500
                  })
                } else {
                  this.dialogFormVisible = false;
                  this.getList();
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  });
                }
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
            putObj(this.form.id, this.form).then(response => {
              const status = response.status;
              if (status === 20500) {
                this.$message({
                  message: response.message,
                  type: 'error',
                  duration: 1500
                })
              } else {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                });
              }
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

