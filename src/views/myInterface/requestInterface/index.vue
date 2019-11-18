<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入接口名称"
                v-model="listQuery.apiName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="true" style="margin-left: 10px;"
                 @click="handleCreate" type="primary"
                 icon="edit">添加
      </el-button>
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
      <el-table-column width="200px" align="center" label="访问地址">
        <template slot-scope="scope">
          <span>{{scope.row.baseUrl}}</span>
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
      <el-table-column fixed="right" align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button v-if="dzManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="primary" @click="handleKey(scope.row)">密钥查看</el-button>
          <el-button size="small" type="primary" @click="handleRoute(scope.row)">路由设置</el-button>
          <el-button v-if="dzManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">
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
    <!-- 编辑详细信息 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
               @close="closeDialog">
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
          <el-collapse-item title="定制基础信息" name="2">
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
              <el-form-item label="访问地址" prop="dzurl">
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
          <el-collapse-item title="定制过滤器" name="3">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-table
                  ref="filterTable"
                  v-loading="!listLoading"
                  :key="tableKey"
                  :data="filterList"
                  border
                  fit
                  highlight-current-row
                  @selection-change="handleFilterChange"
                >
                  <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>

                  <el-table-column label="过滤器名称" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.label }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>

              <el-col :span="2" style="text-align:center;">
                <el-button
                  @click="addFilter"
                  type="primary"
                  :disabled="!filterData.length"
                  icon="el-icon-arrow-right"
                  circle
                ></el-button>
                <el-button
                  @click="removeFilter"
                  type="primary"
                  :disabled="!selectedFilterData.length"
                  icon="el-icon-arrow-left"
                  circle
                  style="margin-left: 0;margin-top: 10px;"
                ></el-button>
              </el-col>

              <el-col :span="11">
                <el-table
                  ref="selectedFilterTable"
                  v-loading="!listLoading"
                  :key="tableKey"
                  :data="selectedFilterList"
                  border
                  fit
                  highlight-current-row
                  @selection-change="handleSelectedFilterChange"
                >
                  <el-table-column label="过滤器名称" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.label }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="路由管理" :visible.sync="routeVisible" width="500px">
      <el-form :model="routeForm" ref="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="访问IP地址" prop="url">
              <el-input v-model="routeForm.url" placeholder="请输入IP访问地址" style="width: 250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路由后缀地址" prop="path">
              <el-input v-model="routeForm.path" placeholder="后缀地址" style="width: 250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="routeCancel()">取 消</el-button>
        <el-button type="primary" @click="routeUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="密钥信息展示" :visible.sync="keyVisible" @close="closeKeyDialog">
      <el-table :data="keyList" v-loading.body="false" border fit highlight-current-row
                style="width: 100%">
        <el-table-column width="119" align="center" label="接口Id">
          <template slot-scope="scope">
            <span>{{scope.row.apiId}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="接口名称">
          <template slot-scope="scope">
            <span>{{scope.row.apiName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="平台签名公钥">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              width="200"
              trigger="hover"
            >
              <span style="font-size: 16px;font-weight: 500">签名公钥</span>
              <el-button type="primary" v-clipboard:copy="scope.row.signPtPubkey"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError" size="mini" style="margin-left: 30px">复制
              </el-button>
              <span slot="reference" v-if="scope.row.signPtPubkey!=undefined">{{scope.row.signPtPubkey.length<=100?scope.row.signPtPubkey:scope.row.signPtPubkey.substring(0,100)+"..."}}</span>
              <div style="height: 200px;overflow: auto">
                {{scope.row.signPtPubkey}}<br/>

              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="签名私钥">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              width="200"
              trigger="hover"
            >
              <span style="font-size: 16px;font-weight: 500">签名私钥</span>
              <el-button type="primary" v-clipboard:copy="scope.row.signSecretKey"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError" size="mini" style="margin-left: 30px">复制
              </el-button>
              <span slot="reference" v-if="scope.row.signSecretKey!=undefined">{{scope.row.signSecretKey.length<=100?scope.row.signSecretKey:scope.row.signSecretKey.substring(0,100)+"..."}}</span>
              <div style="height: 200px;overflow: auto">
                {{scope.row.signSecretKey}}<br/>

              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="数据密钥">
          <template slot-scope="scope">
            <span>{{scope.row.symmetricPubkey}}</span>
          </template>
        </el-table-column>

      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="keyCancel('form')">取 消</el-button>
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

  import {
    getRequestAllApiBaseInfo
  } from '@/api/myPublish/apiBaseInfo/index';
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
          apiName: undefined
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
        activeNames: ['1', '2', '3'],
        rules: {
          apiName: [
            {
              required: true,
              message: '请输入接口名称',
              trigger: 'blur'
            }
          ], path: [
            {
              required: true,
              message: '请输入后缀地址',
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
              message: '请输入附记',
              trigger: 'blur'
            }
          ], contentType: [
            {
              required: true,
              message: '请输入内容类型',
              trigger: 'blur'
            }
          ], dzurl: [
            {
              required: true,
              message: '请输入定制访问地址',
              trigger: 'blur'
            }
          ], responsiblePersonName: [
            {
              required: true,
              message: '请输入负责人名称',
              trigger: 'blur'
            }
          ], responsiblePersonTel: [
            {
              required: true,
              message: '请输入负责人电话',
              trigger: 'blur'
            }
          ], soapbodyReq: [
            {
              required: true,
              message: '请输入请求demo',
              trigger: 'blur'
            }
          ], soapbodyResp: [
            {
              required: true,
              message: '请输入响应demo',
              trigger: 'blur'
            }
          ]
        },
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
        routeForm: {
          path: undefined,
          url: undefined
        },
        routeVisible: false,
        apiRouterDefineManager_btn_edit: false,
        apiRouterDefineManager_btn_del: false,
        routeUpdateApiId: undefined,
        keyArr: [],
        keyVisible: false,
        keyList: null
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
        this.listLoading = false;
        getRequestAllApiBaseInfo(this.listQuery)
          .then(response => {
            const status = response.status;
            if (status === 200) {
              this.list = response.data.rows;
              this.list.forEach((item,index)=>{
                item.index = (this.listQuery.page-1)*this.listQuery.limit+index+1
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
      getFilterList() {
        getAllDzFilter(this.api_id).then(response => {
          let rsp_data = response;
          let all_filters = rsp_data.allFilter;
          if (all_filters != null && all_filters.length > 0) {
            for (let index = 0; index < all_filters.length; index++) {
              const element = all_filters[index];
              this.filterList.push({key: element.id, label: element.filterName});
            }
          }
        });
      }, getUpdateFilterList() {
        getAllDzFilter(this.api_id).then(response => {
          let rsp_data = response;
          let all_filters = rsp_data.allFilter;
          let api_user_filters = rsp_data.apiUserFilterList;
          if (api_user_filters.length > 0) {
            for (let index = 0; index < api_user_filters.length; index++) {
              const element = api_user_filters[index];
              this.selectedFilterList.push({key: element.filterDouterId, label: element.filterName});
              this.originList.push({key: element.filterDouterId, label: element.filterName});
            }
          }
          if (all_filters != null && all_filters.length > 0) {
            for (let index = 0; index < all_filters.length; index++) {
              const element = all_filters[index];
              this.updateFilterList.push({key: element.id, label: element.filterName});
            }
          }
          let originAuthSet = new Set(this.updateFilterList);
          let filterIdValueSet = new Set(this.selectedFilterList);
          // 取原始权限和待提交的权限列表的交集
          let interactAuthSet = [...originAuthSet].filter(x => [...filterIdValueSet].some(y => y.key === x.key));
          // 将待提交的权限与交集取差集，获得新增的权限
          let diffFilterIdValueAndInterActObjArr = [...originAuthSet].filter(x => [...interactAuthSet].every(y => y.key !== x.key));
          diffFilterIdValueAndInterActObjArr.forEach(element => {
            this.filterList.push({key: element.key, label: element.label});
          });
        });
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
        this.api_id = undefined;
        this.getFilterList();
        this.dialogTitle = '新增定制';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.dialogFormVisible = true;
        this.updateId = row.apiId;
        getObj(row.apiId)
          .then(response => {
            this.dialogTitle = '修改定制';
            this.getApiInfo(row.apiId, response.data);
            this.form = response.data;
            this.dialogStatus = 'update';
          });
        if (typeof row.apiId !== 'undefined') {
          this.api_id = row.apiId;
          this.getUpdateFilterList();
        }
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
                  this.resetTemp();
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
      keyCancel() {
        this.keyList = null;
        this.keyArr = [];
        this.keyVisible = false;
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.submitUpdateAuthData();
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
        };
        this.filterList = [];
        this.originList = [];
        this.updateFilterList = [];
        this.selectedFilterList = [];
      },
      submitAuthData() {
        let filterIdValueSet = new Set(this.selectedFilterList);
        // 取原始权限和待提交的权限列表的交集
        let diffOriginAndInterAct = [];
        let diffFilterIdValueAndInterAct = [];
        filterIdValueSet.forEach(d => {
          diffFilterIdValueAndInterAct.push(d.key);
        });
        let req_json = {addIdList: diffFilterIdValueAndInterAct, deleteIdList: diffOriginAndInterAct};
        this.filterUserjson = req_json;
      },
      submitUpdateAuthData() {
        let originAuthSet = new Set(this.originList);
        let filterIdValueSet = new Set(this.selectedFilterList);
        // 取原始权限和待提交的权限列表的交集
        let interactAuthSet = [...originAuthSet].filter(x => [...filterIdValueSet].some(y => y.key === x.key));
        // 将原始权限与交集取差集，获得删除的权限
        let diffOriginAndInterActObjArr = [...originAuthSet].filter(x => [...interactAuthSet].every(y => y.key !== x.key));
        // 将待提交的权限与交集取差集，获得新增的权限t
        let diffFilterIdValueAndInterActObjArr = [...filterIdValueSet].filter(x => [...interactAuthSet].every(y => y.key !== x.key));
        // 提交请求
        let diffOriginAndInterAct = [];
        let diffFilterIdValueAndInterAct = [];
        diffOriginAndInterActObjArr.forEach(d => {
          diffOriginAndInterAct.push(d.key);
        });
        diffFilterIdValueAndInterActObjArr.forEach(d => {
          diffFilterIdValueAndInterAct.push(d.key);
        });
        let req_json = {addIdList: diffFilterIdValueAndInterAct, deleteIdList: diffOriginAndInterAct};
        this.filterUserjson = req_json;
      },
      // 左边表格选择项移到右边
      addFilter() {
        setTimeout(() => {
          this.$refs["filterTable"].clearSelection();
          this.$refs["selectedFilterTable"].clearSelection();
        }, 0);
        let repeat = false;
        this.selectedFilterList.forEach(item => {
          if (this.filterData[0] && item.key === this.filterData[0].key) {
            repeat = true;
            alert("过滤器已添加");
            return;
          }
        });
        if (repeat === false) {
          this.filterData.forEach(item => {
            this.selectedFilterList.push(item);
          });
          for (let i = 0; i < this.filterList.length; i++) {
            for (let j = 0; j < this.filterData.length; j++) {
              if (
                this.filterList[i] &&
                this.filterData[j] &&
                this.filterList[i].key === this.filterData[j].key
              ) {
                this.filterList.splice(i, 1);
              }
            }
          }
        }
      },
      // 右边表格选择项移到左边
      removeFilter() {
        setTimeout(() => {
          this.$refs["filterTable"].clearSelection();
          this.$refs["selectedFilterTable"].clearSelection();
        }, 0);
        this.selectedFilterData.forEach(item => {
          this.filterList.push(item);
        });
        for (let i = 0; i < this.selectedFilterList.length; i++) {
          for (let j = 0; j < this.selectedFilterData.length; j++) {
            if (
              this.selectedFilterList[i] &&
              this.selectedFilterData[j] &&
              this.selectedFilterList[i].key === this.selectedFilterData[j].key
            ) {
              this.selectedFilterList.splice(i, 1);
            }
          }
        }
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
        updateApiRouterInfo(this.routeUpdateApiId, this.routeForm).then(response => {
          const status = response.status;
          if (status === 200) {
            this.routeVisible = false;
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
          } else if (status === 20500) {
            this.$message({
              message: response.message,
              type: 'error',
              duration: 1500
            })
          }
        });
      },
      closeDialog() {
        this.resetTemp();
      },
      handleKey(row) {
        getOneApiBaseInfo(row.apiId).then(response => {
          const status = response.status;
          if (status === 200) {
            this.keyVisible = true;
            this.keyArr.push(response.data);
            this.keyList = this.keyArr;
          } else if (status === 20500) {
            this.$message({
              message: response.message,
              type: 'error',
              duration: 1500
            })
          }
        });
      }, onCopy() {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1500
        })
      }
      ,
      // 复制失败
      onError() {
        this.$message({
          message: '复制失败',
          type: 'error',
          duration: 1500
        })
      },
      closeKeyDialog() {
        this.keyList = [];
        this.keyArr = [];
        this.keyVisible = false;
      },
    }
  }
</script>

