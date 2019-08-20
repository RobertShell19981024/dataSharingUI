<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="API名称"
        v-model="listQuery.apiName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="apiRouterDefineManager_btn_add" style="margin-left: 10px;" @click="handleCreate"
        type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column width="350px" align="center" label="api名称">
        <template slot-scope="scope">
          <span>{{scope.row.apiName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="baseURL">
        <template slot-scope="scope">
          <span>{{scope.row.baseUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="method">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="path">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启用状态">
        <template slot-scope="scope">
          <span>{{scope.row.enabledStatus == true ? '正在使用':'未启用'}}</span>
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
      <el-table-column fixed="right" align="center" label="操作" width="325"> <template slot-scope="scope">
          <el-button v-if="apiRouterDefineManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑详细信息
          </el-button>
          <el-button v-if="apiRouterDefineManager_btn_edit" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template> </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 编辑详细信息 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-collapse v-model="activeNames">
          <!-- 基础信息部分 -->
          <el-collapse-item title="API基础信息" name="1">
            <el-form-item label="api名称" prop="apiName">
              <el-input v-model="form.apiName" placeholder="请输入API名称"></el-input>
            </el-form-item>
            <el-row :gutter="2">
              <el-col :span="16">
                <el-form-item label="baseURL" prop="baseUrl">
                  <el-input v-model="form.baseUrl" placeholder="请输入基础URL(例如:http://192.168.1.1:8080)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="method" prop="method">
                  <el-select v-model="form.method" placeholder="请选择">
                    <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="path" prop="path">
              <el-input v-model="form.path" placeholder="请输入path(不带ip和端口号,例如:/getInfo/getId)"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="enabledStatus">
              <el-switch v-model="form.enabledStatus" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
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
  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj,
    //delOneHeader,
    //delOneQueryString,
    //delOneBodyInfo
    // getAllUserAuth,
    //updateUserAuth
  } from '@/api/interface/myInterfaceManage/index';
  import { mapGetters } from 'vuex';
  export default {
    //name: 'apiRouterDefine',
    data() {
      // baseURL 校验
      let urlValidate = (rule, value, callback) => {
        // base_url 正则，匹配http或https开头,host为IP:端口或域名:端口,不允许携带任何后缀
        let base_url_reg = new RegExp('^((https|http)?://)(([0-9]{1,3}.){3}[0-9]{1,3})(:[0-9]{1,5})(?!.)|([0-9a-z_!~*\'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6}(:[0-9]{1,5})?(?!.)$');
        if (value === '' || value === undefined) {
          callback(new Error('请输入baseURL'));
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
        auth_api_pubkey: '', // 权限对话框，记录api_pubkey
        originAuthList: [], // 原始权限列表
        reqAddAuthArr: [], // 待发送新增用户权限ID列表
        reqRemoveAuthArr: [], // 待发送删除用户权限ID列表
        userData: [], // 权限列表（用户）
        userIdValue: [], // 有权限的用户列表
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
        form: {
          apiName: undefined,
          baseUrl: undefined,
          path: undefined,
          method: '',
          enabledStatus: false,
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
        textMap: {
          update: '修改API服务接口',
          create: '新增API服务接口'
        },
        tableKey: 0,
        activeNames: ['1', '2', '3', '4']
      }
    },
    created() {
      this.getList();
      // this.apiRouterDefineManager_btn_edit = this.elements['apiRouterDefineManager:btn_edit'];
      // this.apiRouterDefineManager_btn_del = this.elements['apiRouterDefineManager:btn_del'];
      // this.apiRouterDefineManager_btn_add = this.elements['apiRouterDefineManager:btn_add'];
      this.apiRouterDefineManager_btn_edit = true;
      this.apiRouterDefineManager_btn_del = true;
      this.apiRouterDefineManager_btn_add = true;
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
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
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.apiId)
          .then(response => {
            this.form = response.data;
            this.apiHeaderInfoList_form = response.data.apiHeaderInfoList;
            let apiQueryInfoList_rsp = response.data.apiQueryInfoList;
            let apiBodyInfoList_rsp = response.data.apiBodyInfoList;
            this.apiQueryInfoList_form = [];
            this.apiBodyInfoList_form = [];
            for (let index = 0; index < apiQueryInfoList_rsp.length; index++) {
              const element = apiQueryInfoList_rsp[index];
              if (element.regUserDefined == 0) { // 用户自定义正则
                this.apiQueryInfoList_form.push({ queryId: element.queryId, queryName: element.queryName, validateReg: 'userDefine', userValidateReg: element.validateReg, queryNote: element.queryNote })
              } else { // 非用户自定义正则
                this.apiQueryInfoList_form.push({ queryId: element.queryId, queryName: element.queryName, validateReg: element.validateReg, userValidateReg: '', queryNote: element.queryNote })
              }
            }
            for (let index = 0; index < apiBodyInfoList_rsp.length; index++) {
              const element = apiBodyInfoList_rsp[index];
              if (element.regUserDefined == 0) { // 用户自定义正则
                this.apiBodyInfoList_form.push({ bodyId: element.bodyId, paramName: element.paramName, validateReg: 'userDefine', userValidateReg: element.validateReg, paramNote: element.paramNote })
              } else { // 非用户自定义正则
                this.apiBodyInfoList_form.push({ bodyId: element.bodyId, paramName: element.paramName, validateReg: element.validateReg, userValidateReg: '', paramNote: element.paramNote })
              }
            }
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
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

      // 关闭权限对话框
      cancelAuthDialog() {
        this.userData = [];
        this.userIdValue = [];
        this.originAuthList = [];
        this.dialogAuthFormVisible = false;
      },
      // 提交权限数据，先对数组取交集，再与各自取差集，即可得到删除的和增加的权限
      submitAuthData() {
        let originAuthSet = new Set(this.originAuthList);
        let userIdValueSet = new Set(this.userIdValue);
        // 取原始权限和待提交的权限列表的交集
        let interactAuthSet = new Set([...originAuthSet].filter(x => userIdValueSet.has(x)));
        // 将原始权限与交集取差集，获得删除的权限
        let diffOriginAndInterAct = new Set([...originAuthSet].filter(x => !interactAuthSet.has(x)));
        // 将待提交的权限与交集取差集，获得新增的权限
        let diffUserIdValueAndInterAct = new Set([...userIdValueSet].filter(x => !interactAuthSet.has(x)));
        // 提交请求
        let req_json = { addIdList: diffUserIdValueAndInterAct, deleteIdList: diffOriginAndInterAct };
        updateUserAuth(req_json, this.auth_api_pubkey).then(() => {
          this.dialogAuthFormVisible = false;
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
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
        }
        );
      },
      resetTemp() {
        this.form = {
          apiName: undefined,
          baseUrl: undefined,
          path: undefined,
          method: '',
          enabledStatus: false
        }
      },
      // 添加Header
      addOneHeader() {
        this.apiHeaderInfoList_form.push({ headerName: '', headerValue: '', headerNote: '' });
      },
      // 删除Header
      deleteCurrentHeader(i, status, headerId) {
        this.apiHeaderInfoList_form.splice(i, 1);
        if (status == 'update') {
          delOneHeader(headerId)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
            });
        }
      },
      // 添加QueryString
      addOneQueryString() {
        this.apiQueryInfoList_form.push({ queryName: '', validateReg: '', userValidateReg: '', queryNote: '' });
      },
      // 删除QueryString
      deleteCurrentQueryString(i, status, queryId) {
        this.apiQueryInfoList_form.splice(i, 1);
        if (status == 'update') {
          delOneQueryString(queryId)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
            });
        }
      },
      // 添加Param
      addOneParam() {
        this.apiBodyInfoList_form.push({ paramName: '', validateReg: '', userValidateReg: '', paramNote: '' });
      },
      // 删除param
      deleteCurrentBodyParam(i, status, bodyId) {
        this.apiBodyInfoList_form.splice(i, 1);
        if (status == 'update') {
          delOneBodyInfo(bodyId)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
            });
        }
      }
    }
  }
</script>
