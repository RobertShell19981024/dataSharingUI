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
      <el-table-column align="center" label="启用状态">
        <template slot-scope="scope">
          <span>{{scope.row.enabledStatus == true ? '正在使用':'未启用'}}</span>
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
          <el-button v-if="apiRouterDefineManager_btn_edit" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="apiRouterDefineManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
          <el-button v-if="apiRouterDefineManager_btn_conf" size="small" type="primary"
                     @click="handleConfig(scope.row)">
            配置过滤器
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
          <el-collapse-item title="API基础信息" name="1">
            <el-form-item label="api名称" prop="apiName">
              <el-input v-model="form.apiName" placeholder="请输入API名称"></el-input>
            </el-form-item>
            <el-row :gutter="2">
              <el-col :span="16">
                <el-form-item label="IP访问地址" prop="baseUrl">
                  <el-input v-model="form.baseUrl" placeholder="请输入IP访问地址(例如:http://192.168.1.1:8080)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="请求方式" prop="method">
                  <el-select v-model="form.method" placeholder="请选择">
                    <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="后缀地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入后缀地址(不带ip和端口号,例如:/getInfo/getId)"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否启用" prop="enabledStatus">
                  <el-switch v-model="form.enabledStatus" active-color="#13ce66" inactive-color="#ff4949"
                             active-value="1" inactive-value="0">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否定制" prop="isDz">
                  <el-switch v-model="form.isDz" active-color="#13ce66" inactive-color="#ff4949" active-value="1"
                             inactive-value="0">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="负责人姓名" prop="responsiblePersonName">
              <el-input v-model="form.responsiblePersonName" placeholder="请输入负责人姓名"></el-input>
            </el-form-item>
            <el-form-item label="负责人电话" prop="responsiblePersonTel">
              <el-input v-model="form.responsiblePersonTel" placeholder="请输入负责人电话"></el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog
      title="接口过滤器配置"
      :visible.sync="Visible"
      width="30%"
      :before-close="handleClose">
      <el-row :gutter="10">
        <el-transfer v-model="filterIdValue" :data="filterData" :titles="['所有过滤器列表', '有权访问过滤器列表']"></el-transfer>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelAuthDialog">取 消</el-button>
    <el-button type="primary" @click="submitAuthData">确 定</el-button>
     </span>
    </el-dialog>

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
      // baseURL 校验
      let urlValidate = (rule, value, callback) => {
        // base_url 正则，匹配http或https开头,host为IP:端口或域名:端口,不允许携带任何后缀
        let base_url_reg = new RegExp('^((https|http)?://)(([0-9]{1,3}.){3}[0-9]{1,3})(:[0-9]{1,5})(?!.)|([0-9a-z_!~*\'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6}(:[0-9]{1,5})?(?!.)$');
        if (value === '' || value === undefined) {
          callback(new Error('请输入IP访问地址\n'));
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
          callback(new Error('请输入path'));
        } else if (!path_reg.test(value)) {
          callback(new Error('path格式错误，请检查格式(例:/getInfo/getId)'));
        } else {
          callback();
        }
      };
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
        regValidateOptions: [
          {
            value: '',
            label: '不检验'
          },
          {
            value: '^.{1,}$',
            label: '非空'
          }, {
            value: '^\d$',
            label: '纯数字'
          }, {
            value: 'userDefine',
            label: '自定义'
          }
        ],
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
        rules: {
          apiName: [
            {
              required: true,
              message: '请输入api名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], baseUrl: [
            {
              required: true,
              trigger: 'blur',
              validator: urlValidate
            }
          ], path: [
            {
              required: true,
              trigger: 'blur',
              validator: pathValidate
            }
          ], method: [
            {
              required: true,
              message: '请选择method',
              trigger: 'blur'
            }
          ], responsiblePersonName: [
            {
              required: true,
              message: '请填写负责人姓名',
              trigger: 'blur'
            }
          ], responsiblePersonTel: [
            {
              required: true,
              message: '请填写负责人联系电话',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          apiName: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        apiRouterDefineManager_btn_edit: false,
        apiRouterDefineManager_btn_del: false,
        apiRouterDefineManager_btn_add: false,
        apiRouterDefineManager_btn_conf: false,
        tableKey: 0,
        activeNames: ['1'],
        dialogTitle: '',
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
      this.apiRouterDefineManager_btn_conf = true;
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
      handleCreate() {
        this.dialogTitle = '新增API服务接口';
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.apiId)
          .then(response => {
            this.dialogTitle = '修改API服务接口';
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
      handleConfig(row) {
        this.api_key = row.apiId;
        this.filterData = [];
        this.filterIdValue = [];
        this.originList = [];
        this.Visible = true;
        getFilterByApiId(row.apiId).then(response => {
          let rsp_data = response.data;
          let own_api_filters = rsp_data.apiFilters;
          let all_filters = rsp_data.filters;
          for (let index = 0; index < all_filters.length; index++) {
            const element = all_filters[index];
            this.filterData.push({key: element.id, label: element.filterName});
          }
          for (let index = 0; index < own_api_filters.length; index++) {
            const element = own_api_filters[index];
            this.filterIdValue.push(element.filterid);
            this.originList.push(element);
          }
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
      },
      resetTemp() {
        this.form = {
          apiName: undefined,
          baseUrl: undefined,
          path: undefined,
          method: '',
          enabledStatus: 0,
          isDz: 0,
          responsiblePersonName: undefined,
          responsiblePersonTel: undefined
        }
      },
      // 关闭权限对话框
      cancelAuthDialog() {
        this.filterData = [];
        this.filterIdValue = [];
        this.originList = [];
        this.Visible = false;
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
        updateFilter(req_json, this.api_key).then(() => {
          this.Visible = false;
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        });
      }
    }
  }
</script>
