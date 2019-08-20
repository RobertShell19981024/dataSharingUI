<template>
    <div class="app-container calendar-list-container">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="API名称" v-model="listQuery.apiName">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" v-if="apiRouterDefineManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary"
          icon="edit">添加</el-button>
      </div>
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
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
            <!-- <el-button size="small" type="primary">测试</el-button> -->
            <el-button size="small" type="warning" @click="handleAuthSet(scope.row)">权限</el-button>
            <el-button v-if="apiRouterDefineManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button v-if="apiRouterDefineManager_btn_edit" size="small" type="danger" @click="handleDelete(scope.row)">删除
            </el-button>
          </template> </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
            <!-- Http Header部分 -->
            <!-- <el-collapse-item title="Header设置" name="2">
              <el-row :gutter="5" v-for="(item, index) in apiHeaderInfoList_form" :key="index">
                <el-col :span="6">
                  <el-form-item label="名称">
                    <el-input placeholder="" v-model="item.headerName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="值">
                    <el-input placeholder="" v-model="item.headerValue"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注">
                    <el-input placeholder="" v-model="item.headerNote"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button type="danger" plain @click="deleteCurrentHeader(index,dialogStatus,item.headerId)">删除</el-button>
                </el-col>
              </el-row>
              <el-button type="info" plain round style="margin-left:100px" @click="addOneHeader">添加Header</el-button>
            </el-collapse-item> -->
            <!-- QueryString部分 -->
            <!-- <el-collapse-item title="QueryString" name="3">
              <el-row :gutter="1" v-for="(item, index) in apiQueryInfoList_form" :key="index">
                <el-col :span="5">
                  <el-form-item label="名称">
                    <el-input placeholder="" v-model="item.queryName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="校验规则">
                    <el-select v-model="item.validateReg" clearable placeholder="请选择">
                      <el-option v-for="item2 in regValidateOptions" :key="item2.value" :label="item2.label" :value="item2.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="自定义正则">
                    <el-input v-if="item.validateReg=='userDefine'" v-model="item.userValidateReg" placeholder="请输入内容"></el-input>
                    <el-input v-else :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="备注">
                    <el-input placeholder="" v-model="item.queryNote"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-button type="danger" plain @click="deleteCurrentQueryString(index,dialogStatus,item.queryId)">删除</el-button>
                </el-col>
              </el-row>
              <el-button type="info" plain round style="margin-left:100px" @click="addOneQueryString">添加QueryString</el-button>
            </el-collapse-item> -->
            <!-- body 部分 -->
            <el-collapse-item title="Body" name="4">
              <el-row :gutter="1" v-for="(item, index) in apiBodyInfoList_form" :key="index">
                <el-col :span="5">
                  <el-form-item label="参数名称">
                    <el-input placeholder="" v-model="item.paramName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="校验规则">
                    <el-select v-model="item.validateReg" clearable placeholder="请选择">
                      <el-option v-for="item2 in regValidateOptions" :key="item2.value" :label="item2.label" :value="item2.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="自定义正则">
                    <el-input v-if="item.validateReg=='userDefine'" v-model="item.userValidateReg" placeholder="请输入内容"></el-input>
                    <el-input v-else :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="备注">
                    <el-input placeholder="" v-model="item.paramNote"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-button type="danger" plain @click="deleteCurrentBodyParam(index,dialogStatus,item.bodyId)">删除</el-button>
                </el-col>
              </el-row>
              <el-button type="info" plain round style="margin-left:100px" @click="addOneParam">添加Param</el-button>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel('form')">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
          <el-button v-else type="primary" @click="update('form')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 权限配置 -->
      <el-dialog :title="authText" :visible.sync="dialogAuthFormVisible" width="550px">
        <el-transfer v-model="userIdValue" :data="userData" :titles="['所有机构列表', '有权访问机构列表']"></el-transfer>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAuthDialog">取 消</el-button>
          <el-button @click="submitAuthData" type="primary">确 定</el-button>
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
      delOneHeader,
      delOneQueryString,
      delOneBodyInfo,
      getAllUserAuth,
      updateUserAuth
    } from '@/api/interfaceService/sendServiceConfig/index';
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
          auth_api_pubkey:'', // 权限对话框，记录api_pubkey
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
            enabledStatus: false,
            responsiblePersonName:undefined,
            responsiblePersonTel:undefined
          },
          apiHeaderInfoList_form: [{ headerId: '', headerName: '', headerValue: '', headerNote: '' }], // header临时表单数组
          apiQueryInfoList_form: [{ queryId: '', queryName: '', validateReg: '', userValidateReg: '', queryNote: '' }], // queryString临时表单数组
          apiBodyInfoList_form: [{ bodyId: '', paramName: '', validateReg: '', userValidateReg: '', paramNote: '' }], // body临时表单数组
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
            ], responsiblePersonName:[
              {
                required: true,
                message: '请填写负责人姓名',
                trigger: 'blur'
              }
            ], responsiblePersonTel:[
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
          dialogAuthFormVisible: false, // 权限配置dialog
          dialogStatus: '',
          apiRouterDefineManager_btn_edit: false,
          apiRouterDefineManager_btn_del: false,
          apiRouterDefineManager_btn_add: false,
          textMap: {
            update: '修改API服务接口',
            create: '新增API服务接口'
          },
          authText: '权限配置',
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
        this.apiRouterDefineManager_btn_del =  true;
        this.apiRouterDefineManager_btn_add =  true;
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
        // 初始化权限列表信息
        handleAuthSet(row) {
          this.auth_api_pubkey = row.apiPubkey;
          this.userData = [];
          this.userIdValue = [];
          this.originAuthList = [];
          this.dialogAuthFormVisible = true;
          getAllUserAuth(row.apiPubkey).then(response => {
            let rsp_data = response.data;
            let all_user = rsp_data.allUserInfo;
            let own_auth_user = rsp_data.ownAuth;
            // 所有用户
            for (let index = 0; index < all_user.length; index++) {
              const element = all_user[index];
              this.userData.push({ key: element.userPubkey, label: element.username });
            }
            // 有权限的用户
            for (let index = 0; index < own_auth_user.length; index++) {
              const element = own_auth_user[index];
              this.userIdValue.push(element);
              this.originAuthList.push(element);
            }
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
          updateUserAuth(req_json,this.auth_api_pubkey).then(() => {
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
            if (valid) {
              this.form.apiHeaderInfoList = [];
              this.form.apiQueryInfoList = [];
              this.form.apiBodyInfoList = [];
              // 复制临时header表单至待提交表单
              for (let index = 0; index < this.apiHeaderInfoList_form.length; index++) {
                const element = this.apiHeaderInfoList_form[index];
                if (element.headerName.trim() != '') {
                  this.form.apiHeaderInfoList.push({ headerName: element.headerName, headerValue: element.headerValue, headerNote: element.headerNote });
                }
              }
              // 复制临时queryString表单至待提交表单
              for (let index = 0; index < this.apiQueryInfoList_form.length; index++) {
                const element = this.apiQueryInfoList_form[index];
                let reg_result = element.validateReg == 'userDefine' ? element.userValidateReg : element.validateReg;
                let reg_user_define = element.validateReg == 'userDefine' ? 1 : 0; // 正则是否为用户自定义,1--是,0--不是
                if (element.queryName.trim() != '') {
                  this.form.apiQueryInfoList.push({ queryName: element.queryName, validateReg: reg_result, regUserDefined: reg_user_define,queryNote: element.queryNote });
                }
              }
              // 复制临时body表单至待提交表单
              for (let index = 0; index < this.apiBodyInfoList_form.length; index++) {
                const element = this.apiBodyInfoList_form[index];
                let reg_result = element.validateReg == 'userDefine' ? element.userValidateReg : element.validateReg;
                let reg_user_define = element.validateReg == 'userDefine' ? 1 : 0; // 正则是否为用户自定义,1--是,0--不是
                if (element.paramName.trim() != '') {
                  this.form.apiBodyInfoList.push({ paramName: element.paramName, validateReg: reg_result, regUserDefined: reg_user_define,paramNote: element.paramNote });
                }
              }
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
              this.form.apiHeaderInfoList = [];
              this.form.apiQueryInfoList = [];
              this.form.apiBodyInfoList = [];
              // 复制临时header表单至待提交表单
              for (let index = 0; index < this.apiHeaderInfoList_form.length; index++) {
                const element = this.apiHeaderInfoList_form[index];
                if (element.headerName.trim() != '') {
                  this.form.apiHeaderInfoList.push({ headerId: element.headerId, headerName: element.headerName, headerValue: element.headerValue, headerNote: element.headerNote });
                }
              }
              // 复制临时queryString表单至待提交表单
              for (let index = 0; index < this.apiQueryInfoList_form.length; index++) {
                const element = this.apiQueryInfoList_form[index];
                let reg_result = element.validateReg == 'userDefine' ? element.userValidateReg : element.validateReg;
                let reg_user_define = element.validateReg == 'userDefine' ? 1 : 0; // 正则是否为用户自定义,1--是,0--不是
                if (element.queryId.trim() != '') {
                  this.form.apiQueryInfoList.push({ queryId: element.queryId, queryName: element.queryName, validateReg: reg_result, regUserDefined: reg_user_define, queryNote: element.queryNote });
                }
              }
              // 复制临时body表单至待提交表单
              for (let index = 0; index < this.apiBodyInfoList_form.length; index++) {
                const element = this.apiBodyInfoList_form[index];
                let reg_result = element.validateReg == 'userDefine' ? element.userValidateReg : element.validateReg;
                let reg_user_define = element.validateReg == 'userDefine' ? 1 : 0; // 正则是否为用户自定义,1--是,0--不是
                if (element.bodyId.trim() != '') {
                  this.form.apiBodyInfoList.push({ bodyId: element.bodyId, paramName: element.paramName, validateReg: reg_result, regUserDefined: reg_user_define, paramNote: element.paramNote });
                }
              }
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
            enabledStatus: false
          },
          this.apiHeaderInfoList_form = [{ headerName: '', headerValue: '', headerNote: '' }] // header临时表单数组
          this.apiQueryInfoList_form = [{ queryName: '', validateReg: '', userValidateReg: '', queryNote: '' }] // queryString临时表单数组
          this.apiBodyInfoList_form = [{ paramName: '', validateReg: '', userValidateReg: '', paramNote: '' }] // body临时表单数组
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
