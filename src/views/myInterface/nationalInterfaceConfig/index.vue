<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" v-if="true" style="margin-left: 10px;"
                 @click="handleCreate" type="primary"
                 icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%" v-loading="!listLoading">
      <el-table-column align="center" label="用户ID">
        <template slot-scope="scope">
          <span>{{scope.row.userid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门名称">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门唯一标识">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="区县代码">
        <template slot-scope="scope">
          <span>{{scope.row.qxdm}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="密钥">
        <template slot-scope="scope">
          <span>{{scope.row.token}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="apiRequestInitialConfig_btn_edit" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="apiRequestInitialConfig_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">
            删除
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form :model="form" label-width="100px" :rules=rules ref="form">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="部门名称"></el-input>
        </el-form-item>
        <el-form-item label="部门唯一标识" prop="id">
          <el-input v-model="form.id" placeholder="部门唯一标识"></el-input>
        </el-form-item>
        <el-form-item label="区县代码" prop="qxdm">
          <el-input v-model="form.qxdm" placeholder="区县代码"></el-input>
        </el-form-item>
        <el-form-item label="密钥" prop="token">
          <el-input v-model="form.token" placeholder="密钥"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getAllApiNotionalConfigInfo,
    insertNotionalsharedConfig,
    getOneApiNotionalsharedConfig,
    deleteNotionalsharedConfig,
    updateNotionalsharedConfig
  } from '@/api/myPublish/nationalInterfaceConfig/index';

  export default {
    data() {
      return {
        form: {
          id: undefined,
          deptName: undefined,
          qxdm: undefined,
          token: undefined,
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
        },
        dialogStatus: '',
        tableKey:
          0,
        activeNames:
          ['1'],
        rules:
          {
            id: {
              required: true,
              message: '请输入部门唯一标识',
              trigger: 'blur'
            },
            deptName: {
              required: true,
              message: '请输入部门名称',
              trigger: 'blur'
            },
            qxdm: {
              required: true,
              message: '请输入区县代码',
              trigger: 'blur'
            },
            token: {
              required: true,
              message: '请输入密钥',
              trigger: 'blur'
            }
          }
        ,
        dialogFormVisible: false,
        dialogTitle: '',
        updateUserId: ''
      }
    },
    mounted() {
      this.getList();
      this.apiRequestInitialConfig_btn_edit = true;
      this.apiRequestInitialConfig_btn_del = true;
    }
    ,
    methods: {
      getList() {
        this.listLoading = false;
        getAllApiNotionalConfigInfo(this.listQuery)
          .then(response => {
            const status = response.status;
            if (status === 200) {
              this.list = response.data.rows;
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
      }
      ,
      handleFilter() {
        this.getList();
      }
      ,
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      }
      ,
      handleCurrentChange(val) {
        alert(val);
        this.listQuery.page = val;
        this.getList();
      }
      , handleCreate() {
        this.dialogTitle = '新增';
        this.api_id = undefined;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.updateUserId = row.userid;
        getOneApiNotionalsharedConfig(row.userid)
          .then(response => {
            this.dialogTitle = '修改';
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
          .then(response => {
            const status = response.status;
            if (status === 20500) {
              this.$message({
                message: response.message,
                type: 'error',
                duration: 1500
              })
            } else {
              deleteNotionalsharedConfig(row.userid)
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
            }
          });
      }
      ,
      resetTemp() {
        this.form = {
          deptName: undefined,
          qxdm: undefined,
          token: undefined,
        };
      },
      cancel() {
        this.dialogFormVisible = false;
        this.resetTemp();
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            insertNotionalsharedConfig(this.form)
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
                  this.resetTemp();
                  this.getList();
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  });
                }
              })
          }
        });
      },
      update() {
        updateNotionalsharedConfig(this.updateUserId, this.form).then(response => {
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
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
            this.dialogFormVisible = false;
            this.resetTemp();
            this.getList();
          }
        });
      },
      closeDialog() {
        this.resetTemp();
      },
    }
  }
</script>
