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
      <el-table-column type="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column width="350px" align="center" label="api名称">
        <template slot-scope="scope">
          <span>{{scope.row.apiName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="baseURL">
        <template slot-scope="scope">
          <span>{{scope.row.baseUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="method">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="path">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
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
          <el-button v-if="dzManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="primary" @click="handleRoute(scope.row)">路由设置</el-button>
          <el-button v-if="dzManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="closeDialog">
      <el-form :model="form" ref="form" label-width="100px" :rules="rules">
        <el-collapse v-model="activeNames">
          <!-- 基础信息部分 -->
          <el-collapse-item title="接口基础信息" name="1">
            <el-col :span="12">
              <el-form-item label="接口名称" prop="apiName">
                <el-input v-model="form.apiName" placeholder="请输入接口名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IP访问地址" prop="baseUrl">
                <el-input v-model="form.baseUrl" placeholder="请输入IP访问地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="后缀地址" prop="path">
                <el-input v-model="form.path" placeholder="请输入后缀地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求方法" prop="method">
                <el-select v-model="form.method" placeholder="请选择" style="margin-bottom: 10px">
                  <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人名称" prop="responsiblePersonName">
                <el-input v-model="form.responsiblePersonName" placeholder="请输入负责人名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人电话" prop="responsiblePersonTel">
                <el-input v-model="form.responsiblePersonTel" placeholder="请输入负责人电话"></el-input>
              </el-form-item>
            </el-col>
          </el-collapse-item>
          <el-collapse-item title="定制基础信息" name="1">
            <el-col :span="12">
              <el-form-item label="允许访问用户" prop="fromUser">
                <el-select v-model="form.fromUser" placeholder="请输入允许访问用户">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="访问地址" prop="url">
                <el-input v-model="form.dzurl" placeholder="请输入访问地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内容类型" prop="contentType">
                <el-input v-model="form.contentType" placeholder="请输入内容类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求方式" prop="method">
                <el-select v-model="form.dzmethod" placeholder="请选择" style="margin-bottom: 10px">
                  <el-option v-for="item in dzMethodOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求DEMO" prop="soapbodyReq">
                <el-input v-model="form.soapbodyReq" placeholder="请输入请求DEMO"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="响应DEMO" prop="soapbodyResp">
                <el-input v-model="form.soapbodyResp" placeholder="请输入响应DEMO"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附记" prop="note">
                <el-input v-model="form.note" placeholder="请输入附记"></el-input>
              </el-form-item>
            </el-col>
          </el-collapse-item>
          <el-collapse-item title="定制过滤器" name="1">
            <el-transfer ref="myTransfer" v-model="filterIdValue" :data="filterData"
                         :titles="['所有过滤器列表', '有权访问过滤器列表']"></el-transfer>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="路由管理" :visible.sync="routeVisible">
      <el-form :model="routeForm" ref="form" label-width="100px">
        <el-collapse v-model="activeNames">
          <!-- 基础信息部分 -->
          <el-collapse-item title="路由基础信息" name="1">
            <el-row>
              <el-col :span="12">
                <el-form-item label="访问IP地址" prop="url">
                  <el-input v-model="routeForm.url" placeholder="请输入IP访问地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="路由后缀地址" prop="path">
                  <el-input v-model="routeForm.path" placeholder="后缀地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="routeCancel()">取 消</el-button>
        <el-button type="primary" @click="routeUpdate()">确 定</el-button>
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
  } from '@/api/myDz/DzConfig/index';

  import {
    getAllDzFilter
  } from '@/api/myPublish/apiRouterFilter/index';

  import {
    getOneApiBaseInfo
  } from '@/api/myPublish/apiBaseInfo/index';

  import {
    all
  } from '@/api/admin/user/index';
  import {
    getCountPublishByApiOwnerId,
    getCountPublishByApiUserId,
    getCountPublishByApiUserIdAndByday,
    getCountRequsetByApiOwnerId
  } from '@/api/HomePage/index';
  import {
    getOneApiRouterDefineInfo,
    updateApiRouterInfo
  } from '@/api/myPublish/apiRouterDefine/index';

  export default {
    data() {
      return {
        methodOptions: [
          {
            value: 'get',
            label: 'get'
          }, {
            value: 'post',
            label: 'post'
          }, {
            value: 'put',
            label: 'put'
          }, {
            value: 'delete',
            label: 'delete'
          }
        ],
        dzMethodOptions: [
          {
            value: 'GET',
            label: 'GET'
          }, {
            value: 'POST',
            label: 'POST'
          }, {
            value: 'PUT',
            label: 'PUT'
          }, {
            value: 'DELETE',
            label: 'DELETE'
          }
        ],
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
        },
        dialogStatus: '',
        tableKey: 0,
        paramText: 'API参数信息',
        form: {
          apiName: undefined,
          path: undefined,
          baseUrl: undefined,
          fromUser: undefined,
          method: 'get',
          note: undefined,
          contentType: undefined,
          dzmethod: 'GET',
          dzurl: undefined,
          responsiblePersonName: undefined,
          responsiblePersonTel: undefined,
          soapbodyReq: undefined,
          soapbodyResp: undefined
        },
        dialogFormVisible: false,
        dzManager_btn_edit: false,
        dzManager_btn_del: false,
        dzManager_btn_add: false,
        dialogTitle: '',
        activeNames: ['1'],
        rules: {
          apiName: [
            {
              required: true,
              message: '请输入路由路径',
              trigger: 'blur'
            }
          ], path: [
            {
              required: true,
              message: '请输入访问地址',
              trigger: 'blur'
            }
          ], baseUrl: [
            {
              required: true,
              message: '请输入访问地址',
              trigger: 'blur'
            }
          ], note: [
            {
              required: true,
              message: '请输入路由地址',
              trigger: 'blur'
            }
          ], contentType: [
            {
              required: true,
              message: '请输入路由地址',
              trigger: 'blur'
            }
          ], dzurl: [
            {
              required: true,
              message: '请输入路由地址',
              trigger: 'blur'
            }
          ], responsiblePersonName: [
            {
              required: true,
              message: '请输入路由地址',
              trigger: 'blur'
            }
          ], responsiblePersonTel: [
            {
              required: true,
              message: '请输入路由地址',
              trigger: 'blur'
            }
          ], soapbodyReq: [
            {
              required: true,
              message: '请输入路由地址',
              trigger: 'blur'
            }
          ], soapbodyResp: [
            {
              required: true,
              message: '请输入路由地址',
              trigger: 'blur'
            }
          ]
        },
        filterData: [],
        filterIdValue: [],
        originList: [],
        filterUserjson: {},
        api_id: undefined,
        middle: {},
        updateId: undefined,
        options: [],
        routeForm: {
          path: undefined,
          url: undefined
        },
        routeVisible: false,
        apiRouterDefineManager_btn_edit: false,
        apiRouterDefineManager_btn_del: false,
        routeUpdateApiId: undefined,

      }
    },
    mounted() {
      this.all();
      this.getList();
      this.dzManager_btn_edit = true;
      this.dzManager_btn_del = true;
    },
    methods: {
      all() {
        all().then(response => {
          response.forEach(item => {
            let obj = {};
            obj.label = item.username;
            obj.value = item.id;
            this.options.push(obj)
          })
        })
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
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
        this.dialogTitle = '新增定制';
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.getFilter(undefined);
      },
      handleUpdate(row) {
        this.dialogFormVisible = true;
        this.updateId = row.apiId;
        getObj(row.apiId)
          .then(response => {
            this.dialogTitle = '修改定制';
            this.getFilter(row.apiId);
            this.getApiInfo(row.apiId, response.data);
            this.form = response.data;
            this.dialogStatus = 'update';
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
            }
          });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.submitAuthData();
            const obj1 = {};
            obj1.filterUserjson = this.filterUserjson;
            const obj = Object.assign(this.form, obj1);
            console.log(obj);
            addObj(obj)
              .then(response => {
                const status = response.status;
                if (status === 20500) {
                  this.$message({
                    message: response.message,
                    type: 'error',
                    duration: 1500
                  })
                } else {
                  this.filterData = [];
                  this.filterIdValue = [];
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
        this.resetTemp();
        this.filterData = [];
        this.filterIdValue = [];
        this.dialogFormVisible = false;
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.submitAuthData();
            const obj1 = {};
            obj1.filterUserjson = this.filterUserjson;
            const obj = Object.assign(this.form, obj1);
            console.log(obj);
            putObj(this.updateId, obj).then(response => {
              const status = response.status;
              if (status === 20500) {
                this.$message({
                  message: response.message,
                  type: 'error',
                  duration: 1500
                })
              } else {
                this.filterData = [];
                this.filterIdValue = [];
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
          apiName: undefined,
          path: undefined,
          baseUrl: undefined,
          fromUser: undefined,
          method: 'get',
          note: undefined,
          contentType: undefined,
          dzmethod: 'GET',
          dzurl: undefined,
          responsiblePersonName: undefined,
          responsiblePersonTel: undefined,
          soapbodyReq: undefined,
          soapbodyResp: undefined
        }
      },
      submitAuthData() {
        let originAuthSet = new Set(this.originList);
        let filterIdValueSet = new Set(this.filterIdValue);
        // 取原始权限和待提交的权限列表的交集
        let interactAuthSet = new Set([...originAuthSet].filter(x => filterIdValueSet.has(x)));
        // 将原始权限与交集取差集，获得删除的权限
        let diffOriginAndInterAct = new Set([...originAuthSet].filter(x => !interactAuthSet.has(x)));
        // 将待提交的权限与交集取差集，获得新增的权限
        let diffFilterIdValueAndInterAct = new Set([...filterIdValueSet].filter(x => !interactAuthSet.has(x)));
        // 提交请求
        let req_json = {addIdList: diffFilterIdValueAndInterAct, deleteIdList: diffOriginAndInterAct};
        this.filterUserjson = req_json;
      },
      getFilter(apiId) {
        getAllDzFilter(apiId).then(response => {
          let rsp_data = response;
          let all_filters = rsp_data.allFilter;
          let api_user_filters = rsp_data.apiUserFilterList;
          if (all_filters != null && all_filters.length > 0) {
            for (let index = 0; index < all_filters.length; index++) {
              const element = all_filters[index];
              this.filterData.push({key: element.id, label: element.filterName});
            }
          }
          if (api_user_filters.length > 0) {
            for (let index = 0; index < api_user_filters.length; index++) {
              const element = api_user_filters[index];
              this.filterIdValue.push(element.filterDouterId);
              this.originList.push(element.filterDouterId);
            }
          }
        });
      },
      getApiInfo(apiId, dzResponse) {
        if (typeof apiId !== 'undefined') {
          getOneApiBaseInfo(apiId)
            .then(response => {
              const obj = Object.assign(response.data, dzResponse);
              this.form = obj;
            });
        }
      },
      handleRoute(row) {
        this.routeUpdateApiId = row.apiId;
        getOneApiRouterDefineInfo(row.apiId).then(response => {
          const status = response.status;
          const data = response.data;
          if (status === 200 && typeof data !== 'undefined') {
            this.routeVisible = true;
            this.routeForm = response.data;
          } else if (status === 20500) {
            this.$message({
              message: response.message,
              type: 'error',
              duration: 1500
            })
          }
        });
      },
      routeCancel() {
        this.routeVisible = false;
      },
      routeUpdate() {
        this.routeVisible = true;
        updateApiRouterInfo(this.routeUpdateApiId, this.routeForm).then(() => {
          this.routeVisible = false;
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      closeDialog() {
        this.resetTemp();
        this.filterData = [];
        this.filterIdValue = [];
        this.dialogFormVisible = false;
      }
    }
  }
</script>

