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
      <el-table-column type="index" align="center" width="200px" label="序号">
      </el-table-column>
      <el-table-column width="200px" align="center" label="路径">
        <template slot-scope="scope">
          <span>{{scope.row.uri}}</span>
        </template>
      </el-table-column>
      <el-table-column width="350px" align="center" label="平台签名公钥">
        <template slot-scope="scope">
          <el-popover
            placement="left"
            title="平台签名公钥"
            width="200"
            trigger="hover"
          >
            <span slot="reference">{{scope.row.ptPubKey.length<=100?scope.row.ptPubKey:scope.row.ptPubKey.substring(0,100)+"..."}}</span>
            <div style="height: 200px;overflow: auto">
              {{scope.row.ptPubKey}}<br/>
              <el-button type="primary" v-clipboard:copy="scope.row.ptPubKey"
                         v-clipboard:success="onCopy"
                         v-clipboard:error="onError">复制
              </el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="350px" align="center" label="签名私钥">
        <template slot-scope="scope">
          <el-popover
            placement="left"
            title="签名私钥"
            width="200"
            trigger="hover"
          >
            <span slot="reference">{{scope.row.secretKey.length<=100?scope.row.secretKey:scope.row.secretKey.substring(0,100)+"..."}}</span>
            <div style="height: 200px;overflow: auto">
              {{scope.row.secretKey}}<br/>
            <el-button type="primary" v-clipboard:copy="scope.row.secretKey"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError">复制
            </el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="350px" align="center" label="数据密钥">
        <template slot-scope="scope">
          <span>{{scope.row.symPubkey}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200">
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
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form :model="form" label-width="100px" :rules=rules>
        <el-form-item label="访问地址" prop="path">
          <el-input v-model="form.uri" placeholder="访问地址" class="FORM"></el-input>
        </el-form-item>
        <el-row style="margin-left: 100px;margin-bottom: 50px">
          <el-transfer v-model="filterIdValue" :data="filterData" :titles="['所有过滤器列表', '有权访问过滤器列表']"></el-transfer>
        </el-row>
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
  } from '@/api/myRequest/requestInterfaceManage/index';
  import {
    getAllRequestFilter
  } from '@/api/myPublish/apiRouterFilter/index';

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
      // let pathValidate = (rule, value, callback) => {
      //   // path正则表达式,匹配/xxx一次或多次,不能以字符/结尾
      //   let path_reg = new RegExp('\/.+');
      //   if (value === '' || value === undefined) {
      //     callback(new Error('请输入后缀地址'));
      //   } else if (!path_reg.test(value)) {
      //     callback(new Error('path格式错误，请检查格式(例:/getInfo/getId)'));
      //   } else {
      //     callback();
      //   }
      // };
      return {
        jgId: undefined,
        isShow: false,
        middle: {},
        filterData: [],
        filterIdValue: [],
        originList: [],
        form: {
          uri: undefined,
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        dialogStatus: '',
        tableKey: 0,
        activeNames: ['1'],
        rules: {
          uri: [
            {
              required: true,
              message: '请输入访问地址别称',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'blur',
              validator: urlValidate
            }
          ]
        },
        dialogFormVisible: false
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
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            const status = response.status;
            if (status === 200) {
              this.list = response.data.rows;
              this.total = response.data.total;
              this.listLoading = false;
            } else if (status === 20500) {
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
        this.jgId = undefined;
        this.getAllFilter();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.jgId = row.id;
        this.getAllFilter();
        getObj(row.id)
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
            }
          });
      }
      ,
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
      }
      ,
      resetTemp() {
        this.form = {
          uri: undefined
        };
        this.filterData = [];
        this.filterIdValue = [];
        this.originList = [];
      },
      cancel() {
        this.dialogFormVisible = false;
        this.resetTemp();
      },
      create() {
        let path_reg = new RegExp('\/.+');
        if (typeof this.form.path != 'undefined' && path_reg.test(this.form.path)) {
          this.submitAuthData();
          this.$set(this.middle, 'filterUserjson', this.filterUserjson);
          const obj = Object.assign(this.form, this.middle);
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
        } else {
          this.$notify({
            title: '失败',
            message: '创建失败',
            type: 'error',
          });
        }
      },
      update() {
        this.submitAuthData();
        const obj1 = {};
        obj1.filterUserjson = this.filterUserjson;
        obj1.path = this.form.uri;
        console.log(obj1);
        putObj(this.jgId, obj1).then(response => {
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
      getAllFilter() {
        getAllRequestFilter(this.jgId).then(response => {
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
      }, closeDialog() {
        this.dialogFormVisible = false;
        this.resetTemp();
      }

    }
  }
</script>
