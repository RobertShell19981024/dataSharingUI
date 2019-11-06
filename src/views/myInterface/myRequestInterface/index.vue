<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入ip访问地址"
                v-model="listQuery.uri">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="true" style="margin-left: 10px;"
                 @click="handleCreate" type="primary"
                 icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%" v-loading="!listLoading">
      <el-table-column prop="index" align="center" width="93px" label="序号">
      </el-table-column>
      <el-table-column align="center" label="用户ID">
        <template slot-scope="scope">
          <span>{{scope.row.fromUser}}</span>
        </template>
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
            width="200"
            trigger="hover"
          >
            <span style="font-size: 16px;font-weight: 500">签名公钥</span>
            <el-button type="primary" v-clipboard:copy="scope.row.ptPubKey"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError" size="mini" style="margin-left: 30px">复制
            </el-button>
            <span slot="reference" v-if="scope.row.ptPubKey!=undefined"> {{scope.row.ptPubKey.length<=100?scope.row.ptPubKey:scope.row.ptPubKey.substring(0,100)+"..."}}</span>
            <div style="height: 200px;overflow: auto">
              {{scope.row.ptPubKey}}<br/>

            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="350px" align="center" label="签名私钥">
        <template slot-scope="scope">
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
          >
            <span style="font-size: 16px;font-weight: 500">签名私钥</span>
            <el-button type="primary" v-clipboard:copy="scope.row.secretKey"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError" size="mini" style="margin-left: 30px">复制
            </el-button>
            <span slot="reference" v-if="scope.row.secretKey!=undefined">{{scope.row.secretKey.length<=100?scope.row.secretKey:scope.row.secretKey.substring(0,100)+"..."}}</span>
            <div style="height: 200px;overflow: auto">
              {{scope.row.secretKey}}<br/>

            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据密钥">
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
    <div v-show="listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form :model="form" label-width="100px" :rules=rules ref="form">
        <el-form-item label="访问地址" prop="uri">
          <el-input v-model="form.uri" placeholder="访问地址"></el-input>
        </el-form-item>
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
              <!--<el-table-column label="主键" align="center">-->
              <!--<template slot-scope="scope">-->
              <!--<span>{{ scope.row.key }}</span>-->
              <!--</template>-->
              <!--</el-table-column>-->

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
              <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
              <!--<el-table-column label="主键" align="center">-->
              <!--<template slot-scope="scope">-->
              <!--<span>{{ scope.row.key }}</span>-->
              <!--</template>-->
              <!--</el-table-column>-->

              <el-table-column label="过滤器名称" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.label }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
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
      let pathValidate = (rule, value, callback) => {
        // path正则表达式,匹配/xxx一次或多次,不能以字符/结尾
        let path_reg = new RegExp('\/.+');
        if (value === '' || value === undefined) {
          callback(new Error('请输入后缀地址'));
        } else if (!path_reg.test(value)) {
          callback(new Error('path格式错误，请检查格式(例:/getInfo/getId)'));
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
        isShow: false,
        middle: {},
        updateFilterList: [],
        filterData: [],
        filterList: [],
        selectedFilterData: [],
        selectedFilterList: [],
        originList: [],
        form: {
          uri: undefined,
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          uri: undefined
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
              validator: pathValidate
            }
          ]
        },
        dialogFormVisible: false,
        dialogTitle: ''
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
        page(this.listQuery)
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
        this.getFilterList();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.dialogTitle = '修改';
            this.form = response.data;
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
          });
        if (typeof row.id !== 'undefined') {
          this.api_id = row.id;
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
      resetTemp() {
        this.form = {
          uri: undefined
        };
        this.filterList = [];
        this.originList = [];
        this.updateFilterList = [];
        this.selectedFilterList = [];
      },
      cancel() {
        this.dialogFormVisible = false;
        this.resetTemp();
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            let path_reg = new RegExp('\/.+');
            if (typeof this.form.uri != 'undefined' && path_reg.test(this.form.uri)) {
              this.submitAuthData();
              const obj = {};
              obj.path = this.form.uri;
              obj.filterUserjson = this.filterUserjson;
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
                message: '请输入正确的访问地址',
                type: 'error',
              });
            }
          }
        });
      },
      update() {
        this.submitUpdateAuthData();
        const obj1 = {};
        obj1.filterUserjson = this.filterUserjson;
        obj1.path = this.form.uri;
        console.log(obj1);
        putObj(this.api_id, obj1).then(response => {
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
        console.log(this.originList);
        console.log(this.selectedFilterList);
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
      }, getFilterList() {
        getAllRequestFilter(this.api_id).then(response => {
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
        getAllRequestFilter(this.api_id).then(response => {
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
          console.log(this.updateFilterList);
          console.log(this.selectedFilterList);
          console.log(this.originList);
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


    }
  }
</script>
